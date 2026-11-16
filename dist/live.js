// Live conversations with an AI assistant, by voice or by text (browser only).
//
// SmartLinks mints a short-lived key with the assistant's instructions and tools fixed on it; the browser
// then connects straight to the provider's realtime service (WebRTC), so audio never passes through
// SmartLinks. Tool calls arrive on the data channel: a tool that belongs to the page (open a screen, read
// what's on it) runs here; anything else runs in SmartLinks through the caller's `tool` endpoint.
//
// The same client serves the Studio assistant and the customer guide (`ai.guide.start`): what differs is
// where a session is minted, where server tools run and where events are logged — the `endpoints`.
//
// Voice: microphone in, speech out, captions of what the assistant says. Text: no microphone, the person
// types (`send`), the assistant answers in text (captions carry it).
const CALLS_URL = 'https://api.openai.com/v1/realtime/calls';
/** The service's answers that mean "there was nothing to cancel or clear": not shown as errors. */
const HARMLESS = /response_cancel_not_active|no active response|output_audio_buffer|nothing to clear/i;
function meter(ctx, stream) {
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    ctx.createMediaStreamSource(stream).connect(analyser);
    const buf = new Uint8Array(analyser.frequencyBinCount);
    return () => {
        analyser.getByteTimeDomainData(buf);
        let sum = 0;
        for (const v of buf)
            sum += (v - 128) * (v - 128);
        return Math.min(1, Math.sqrt(sum / buf.length) / 40);
    };
}
/** Start a live conversation. Resolves once connected (or failed: then it is stopped and onError was told). */
export async function startLive(opts) {
    var _a, _b, _c, _d, _e, _f, _g;
    const textMode = opts.mode === 'text';
    const screenTools = opts.screenTools || {};
    const t0 = typeof performance !== 'undefined' ? performance.now() : Date.now();
    let stopped = false;
    let state = 'connecting';
    let caption = '';
    let sessionId = null;
    let paused = false;
    let startedAt = null;
    let toolCalls = 0;
    let replies = 0;
    const held = [];
    let replyOwed = false;
    let micTrack = null;
    let micSender = null;
    // A reply is being made (between response.created and response.done): only then is there one to cancel.
    let responding = false;
    let muted = false;
    let micLevel = () => 0;
    let voiceLevel = () => 0;
    const log = (e) => {
        var _a, _b, _c;
        try {
            (_b = (_a = opts.endpoints).event) === null || _b === void 0 ? void 0 : _b.call(_a, Object.assign(Object.assign(Object.assign({}, e), { sessionId: (_c = e.sessionId) !== null && _c !== void 0 ? _c : sessionId }), (opts.build ? { build: opts.build } : {})));
        }
        catch ( /* never in the way */_d) { /* never in the way */ }
    };
    const setState = (s) => {
        var _a;
        if (stopped || state === s || (paused && s !== 'paused'))
            return;
        state = s;
        (_a = opts.onState) === null || _a === void 0 ? void 0 : _a.call(opts, s);
    };
    (_a = opts.onState) === null || _a === void 0 ? void 0 : _a.call(opts, 'connecting');
    const pc = new RTCPeerConnection();
    const audio = textMode ? null : new Audio();
    if (audio)
        audio.autoplay = true;
    let mic = null;
    let ctx = null;
    const dc = pc.createDataChannel('oai-events');
    const send = (ev) => { if (dc.readyState === 'open')
        dc.send(JSON.stringify(ev)); };
    const stop = () => {
        var _a;
        if (stopped)
            return;
        stopped = true;
        if (startedAt)
            log({ kind: 'stop', ms: Date.now() - startedAt, detail: `${toolCalls} tool calls, ${replies} replies` });
        try {
            dc.close();
        }
        catch ( /* closed */_b) { /* closed */ }
        try {
            pc.close();
        }
        catch ( /* closed */_c) { /* closed */ }
        mic === null || mic === void 0 ? void 0 : mic.getTracks().forEach((t) => t.stop());
        if (audio)
            audio.srcObject = null;
        void (ctx === null || ctx === void 0 ? void 0 : ctx.close().catch(() => undefined));
        state = 'idle';
        (_a = opts.onState) === null || _a === void 0 ? void 0 : _a.call(opts, 'idle');
    };
    async function runTool(call) {
        var _a;
        const started = Date.now();
        let output;
        let ok = true;
        const screen = screenTools[call.name];
        try {
            const args = call.arguments ? JSON.parse(call.arguments) : {};
            if (screen) {
                output = await screen(args);
            }
            else {
                const reply = await opts.endpoints.tool(call.name, args, sessionId);
                await ((_a = opts.onToolReply) === null || _a === void 0 ? void 0 : _a.call(opts, call.name, reply));
                output = reply.result;
            }
            if (output && typeof output === 'object' && 'error' in output)
                ok = false;
        }
        catch (err) {
            ok = false;
            output = { error: err instanceof Error ? err.message : "That didn't work" };
        }
        toolCalls++;
        const failed = !ok && output && typeof output === 'object' && 'error' in output ? String(output.error) : undefined;
        log(Object.assign({ kind: 'tool', tool: call.name, where: screen ? 'screen' : 'server', ms: Date.now() - started, ok }, (failed ? { error: failed } : {})));
        send({ type: 'conversation.item.create', item: { type: 'function_call_output', call_id: call.call_id, output: JSON.stringify(output !== null && output !== void 0 ? output : {}) } });
    }
    dc.onmessage = (e) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        let ev;
        try {
            ev = JSON.parse(String(e.data));
        }
        catch (_l) {
            return;
        }
        const type = String((_a = ev['type']) !== null && _a !== void 0 ? _a : '');
        if (type === 'input_audio_buffer.speech_started')
            setState('hearing');
        else if (type === 'input_audio_buffer.speech_stopped')
            setState('thinking');
        else if (type === 'response.created') {
            responding = true;
            caption = '';
            if (textMode)
                setState('thinking');
        }
        else if (type === 'output_audio_buffer.started')
            setState('speaking');
        else if (type === 'output_audio_buffer.stopped' || type === 'output_audio_buffer.cleared')
            setState('listening');
        else if (/^response\.(output_audio_transcript|audio_transcript|output_text|text)\.delta$/.test(type)) {
            caption += String((_b = ev['delta']) !== null && _b !== void 0 ? _b : '');
            if (textMode)
                setState('speaking');
            (_c = opts.onCaption) === null || _c === void 0 ? void 0 : _c.call(opts, caption);
        }
        else if (type === 'response.done') {
            responding = false;
            if (caption.trim()) {
                replies++;
                (_d = opts.onReply) === null || _d === void 0 ? void 0 : _d.call(opts, caption.trim());
                log({ kind: 'reply', detail: caption.trim().slice(0, 300) });
            }
            const response = ((_e = ev['response']) !== null && _e !== void 0 ? _e : {});
            const calls = ((_f = response.output) !== null && _f !== void 0 ? _f : []).filter((o) => o['type'] === 'function_call');
            if (calls.length) {
                setState('thinking');
                void Promise.all(calls.map((c) => { var _a, _b, _c; return runTool({ name: String((_a = c['name']) !== null && _a !== void 0 ? _a : ''), call_id: String((_b = c['call_id']) !== null && _b !== void 0 ? _b : ''), arguments: String((_c = c['arguments']) !== null && _c !== void 0 ? _c : '') }); }))
                    .then(() => { if (paused)
                    replyOwed = true;
                else
                    send({ type: 'response.create' }); });
            }
            else if (textMode)
                setState('listening');
        }
        else if (type === 'error') {
            const err = ((_g = ev['error']) !== null && _g !== void 0 ? _g : {});
            const message = String((_h = err['message']) !== null && _h !== void 0 ? _h : 'The assistant hit a problem');
            // "Nothing to cancel" (a pause or a stop between replies) is not a problem: say nothing.
            if (HARMLESS.test(String((_j = err['code']) !== null && _j !== void 0 ? _j : '')) || HARMLESS.test(message))
                return;
            log({ kind: 'error', error: message, detail: 'realtime service' });
            (_k = opts.onError) === null || _k === void 0 ? void 0 : _k.call(opts, message);
        }
    };
    pc.onconnectionstatechange = () => {
        var _a;
        if (stopped)
            return;
        if (pc.connectionState === 'failed' || pc.connectionState === 'disconnected' || pc.connectionState === 'closed') {
            if (paused) {
                log({ kind: 'stop', detail: `ended while paused (${pc.connectionState})` });
                stop();
                return;
            }
            log({ kind: 'error', error: `connection ${pc.connectionState}` });
            (_a = opts.onError) === null || _a === void 0 ? void 0 : _a.call(opts, 'The connection dropped.');
            stop();
        }
    };
    const noop = async () => null;
    try {
        const [mint, stream] = await Promise.all([
            opts.endpoints.mint(),
            textMode ? Promise.resolve(null) : navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } }),
        ]);
        if (stopped) {
            stream === null || stream === void 0 ? void 0 : stream.getTracks().forEach((t) => t.stop());
            return handle();
        }
        mic = stream;
        sessionId = (_b = mint.sessionId) !== null && _b !== void 0 ? _b : null;
        const missing = ((_c = mint.tools) !== null && _c !== void 0 ? _c : []).filter((t) => t.runs === 'screen' && !screenTools[t.name]).map((t) => t.name);
        if (missing.length)
            log({ kind: 'error', error: `this page can't run: ${missing.join(', ')}`, detail: 'client older than the server' });
        if (stream) {
            ctx = new AudioContext();
            micLevel = meter(ctx, stream);
            for (const track of stream.getTracks()) {
                const sender = pc.addTrack(track, stream);
                if (track.kind === 'audio' && !micTrack) {
                    micTrack = track;
                    micSender = sender;
                }
            }
            pc.ontrack = (e) => {
                const remote = e.streams[0];
                if (!remote || !audio)
                    return;
                audio.srcObject = remote;
                if (ctx)
                    voiceLevel = meter(ctx, remote);
            };
        }
        else {
            // A typed conversation: nothing to send, nothing to hear, but the call still carries an audio line.
            pc.addTransceiver('audio', { direction: 'recvonly' });
        }
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        const res = await fetch(CALLS_URL, { method: 'POST', headers: { Authorization: `Bearer ${mint.clientSecret}`, 'Content-Type': 'application/sdp' }, body: (_d = offer.sdp) !== null && _d !== void 0 ? _d : '' });
        if (!res.ok)
            throw new Error(`The assistant's service refused the call (${res.status})`);
        await pc.setRemoteDescription({ type: 'answer', sdp: await res.text() });
        await new Promise((resolve, reject) => {
            if (dc.readyState === 'open')
                return resolve();
            const timer = setTimeout(() => reject(new Error("The assistant's service didn't answer")), 15000);
            dc.onopen = () => { clearTimeout(timer); resolve(); };
        });
        startedAt = Date.now();
        log({ kind: 'start', ms: Math.round((typeof performance !== 'undefined' ? performance.now() : Date.now()) - t0), detail: `${mint.model} ${(_f = (_e = mint.tools) === null || _e === void 0 ? void 0 : _e.length) !== null && _f !== void 0 ? _f : 0} tools ${textMode ? 'text' : 'voice'}` });
        setState('listening');
    }
    catch (err) {
        const denied = typeof DOMException !== 'undefined' && err instanceof DOMException && (err.name === 'NotAllowedError' || err.name === 'NotFoundError');
        log({ kind: 'error', error: err instanceof Error ? err.message : String(err), detail: denied ? 'microphone' : 'starting' });
        (_g = opts.onError) === null || _g === void 0 ? void 0 : _g.call(opts, denied ? 'I need the microphone to listen. Allow it for this page and try again.' : err instanceof Error ? err.message.replace(/^Error \d+:\s*/, '') : "Couldn't start");
        stop();
    }
    function handle() {
        const say = (text) => send({ type: 'conversation.item.create', item: { type: 'message', role: 'user', content: [{ type: 'input_text', text }] } });
        const answer = (text) => {
            if (stopped)
                return;
            if (paused)
                return void held.push(text);
            say(text);
            send({ type: 'response.create' });
        };
        return {
            stop,
            pause: () => {
                var _a;
                if (stopped || paused || state === 'connecting')
                    return;
                paused = true;
                void (micSender === null || micSender === void 0 ? void 0 : micSender.replaceTrack(null).catch(() => undefined));
                send({ type: 'input_audio_buffer.clear' });
                if (responding)
                    send({ type: 'response.cancel' });
                if (!textMode && state === 'speaking')
                    send({ type: 'output_audio_buffer.clear' });
                if (audio)
                    audio.muted = true;
                state = 'paused';
                (_a = opts.onState) === null || _a === void 0 ? void 0 : _a.call(opts, 'paused');
                log({ kind: 'pause' });
            },
            resume: () => {
                var _a;
                if (stopped || !paused)
                    return;
                paused = false;
                if (!muted)
                    void (micSender === null || micSender === void 0 ? void 0 : micSender.replaceTrack(micTrack).catch(() => undefined));
                if (audio)
                    audio.muted = false;
                state = 'listening';
                (_a = opts.onState) === null || _a === void 0 ? void 0 : _a.call(opts, 'listening');
                const waiting = held.splice(0);
                for (const text of waiting)
                    say(text);
                if (waiting.length || replyOwed)
                    send({ type: 'response.create' });
                replyOwed = false;
                log({ kind: 'resume', detail: waiting.length ? `${waiting.length} message(s) held while paused` : '' });
            },
            mute: () => {
                var _a;
                if (stopped || muted || state === 'connecting' || textMode)
                    return;
                muted = true;
                void (micSender === null || micSender === void 0 ? void 0 : micSender.replaceTrack(null).catch(() => undefined));
                send({ type: 'input_audio_buffer.clear' });
                (_a = opts.onMuted) === null || _a === void 0 ? void 0 : _a.call(opts, true);
                log({ kind: 'pause', detail: 'mic muted' });
            },
            unmute: () => {
                var _a;
                if (stopped || !muted)
                    return;
                muted = false;
                if (!paused)
                    void (micSender === null || micSender === void 0 ? void 0 : micSender.replaceTrack(micTrack).catch(() => undefined));
                (_a = opts.onMuted) === null || _a === void 0 ? void 0 : _a.call(opts, false);
                log({ kind: 'resume', detail: 'mic on' });
            },
            muted: () => muted,
            hush: () => {
                if (stopped)
                    return;
                if (responding)
                    send({ type: 'response.cancel' });
                if (!textMode && state === 'speaking')
                    send({ type: 'output_audio_buffer.clear' });
            },
            send: (text) => { if (text.trim())
                answer(text.trim()); },
            tell: (what) => answer(`[On screen] ${what}`),
            report: (text) => answer(text),
            note: (what) => { if (!stopped)
                say(`[On screen] ${what}`); },
            ask: async (name, args) => {
                var _a;
                if (stopped || !sessionId)
                    return noop();
                const reply = await opts.endpoints.tool(name, args, sessionId);
                return (_a = reply.result) !== null && _a !== void 0 ? _a : null;
            },
            session: () => sessionId,
            state: () => state,
            level: () => (state === 'speaking' ? voiceLevel() : !muted && (state === 'hearing' || state === 'listening') ? micLevel() : 0),
        };
    }
    return handle();
}

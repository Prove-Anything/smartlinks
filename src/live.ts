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

export type LiveState = 'idle' | 'connecting' | 'listening' | 'hearing' | 'thinking' | 'speaking' | 'paused' | 'error'

export type LiveToolHandler = (args: Record<string, unknown>) => Promise<unknown> | unknown

/** What SmartLinks returns when it mints a live session. */
export interface LiveMintReply {
  clientSecret: string
  expiresAt?: number | null
  model: string
  voice?: string | null
  tools: Array<{ name: string; runs: 'screen' | 'server' }>
  sessionId: string
  mode?: 'voice' | 'text'
  [key: string]: unknown
}

/** A server tool's answer: `result` goes back to the assistant; anything else is for the page. */
export interface LiveToolReply {
  result?: unknown
  [key: string]: unknown
}

export interface LiveEvent {
  kind: 'tool' | 'error' | 'start' | 'stop' | 'reply' | 'pause' | 'resume' | 'handoff'
  sessionId?: string | null
  tool?: string
  where?: 'screen' | 'server'
  ms?: number
  ok?: boolean
  error?: string
  detail?: string
  build?: string
}

export interface LiveEndpoints {
  /** Mint the session (instructions and tools are fixed on the key by SmartLinks). */
  mint: () => Promise<LiveMintReply>
  /** Run one server tool. */
  tool: (name: string, args: Record<string, unknown>, sessionId: string | null) => Promise<LiveToolReply>
  /** Log what happened here, into SmartLinks' logs. Fire and forget. */
  event?: (event: LiveEvent) => void
}

export interface LiveOptions {
  endpoints: LiveEndpoints
  /** 'voice' (default) or 'text'. Text: no microphone, `send` to say something, answers come as captions. */
  mode?: 'voice' | 'text'
  /** The tools that run in the page (open a screen, read it). Everything else runs in SmartLinks. */
  screenTools?: Record<string, LiveToolHandler>
  onState?: (s: LiveState) => void
  /** What the assistant is saying or writing, as it goes (replaces the previous caption each turn). */
  onCaption?: (text: string) => void
  /** A whole reply, once finished. */
  onReply?: (text: string) => void
  /** A server tool's reply, for the page to act on (cards, screens to open…). */
  onToolReply?: (name: string, reply: LiveToolReply) => void | Promise<void>
  onError?: (message: string) => void
  /** Names this client in the logs. */
  build?: string
}

export interface LiveHandle {
  stop: () => void
  /** Stop listening and speaking without ending the session; anything it would say waits for `resume`. */
  pause: () => void
  resume: () => void
  /** Text mode (or voice): give the assistant the person's words and have it answer. */
  send: (text: string) => void
  /** Tell the assistant something that happened in the page, and have it answer. */
  tell: (what: string) => void
  /** Give the assistant a message as it is, and have it answer. */
  report: (text: string) => void
  /** Let the assistant know something without asking it to answer (where the person is now). */
  note: (what: string) => void
  /** Run one of this session's server tools directly. */
  ask: (name: string, args: Record<string, unknown>) => Promise<unknown>
  /** The SmartLinks session id (where its history is kept). */
  session: () => string | null
  state: () => LiveState
  /** 0..1, how loud the person (listening) or the assistant (speaking) is right now. */
  level: () => number
}

const CALLS_URL = 'https://api.openai.com/v1/realtime/calls'

function meter(ctx: AudioContext, stream: MediaStream): () => number {
  const analyser = ctx.createAnalyser()
  analyser.fftSize = 256
  ctx.createMediaStreamSource(stream).connect(analyser)
  const buf = new Uint8Array(analyser.frequencyBinCount)
  return () => {
    analyser.getByteTimeDomainData(buf)
    let sum = 0
    for (const v of buf) sum += (v - 128) * (v - 128)
    return Math.min(1, Math.sqrt(sum / buf.length) / 40)
  }
}

/** Start a live conversation. Resolves once connected (or failed: then it is stopped and onError was told). */
export async function startLive(opts: LiveOptions): Promise<LiveHandle> {
  const textMode = opts.mode === 'text'
  const screenTools = opts.screenTools || {}
  const t0 = typeof performance !== 'undefined' ? performance.now() : Date.now()
  let stopped = false
  let state: LiveState = 'connecting'
  let caption = ''
  let sessionId: string | null = null
  let paused = false
  let startedAt: number | null = null
  let toolCalls = 0
  let replies = 0
  const held: string[] = []
  let replyOwed = false
  let micTrack: MediaStreamTrack | null = null
  let micSender: RTCRtpSender | null = null
  let micLevel: () => number = () => 0
  let voiceLevel: () => number = () => 0

  const log = (e: LiveEvent) => {
    try { opts.endpoints.event?.({ ...e, sessionId: e.sessionId ?? sessionId, ...(opts.build ? { build: opts.build } : {}) }) } catch { /* never in the way */ }
  }
  const setState = (s: LiveState) => {
    if (stopped || state === s || (paused && s !== 'paused')) return
    state = s
    opts.onState?.(s)
  }
  opts.onState?.('connecting')

  const pc = new RTCPeerConnection()
  const audio = textMode ? null : new Audio()
  if (audio) audio.autoplay = true
  let mic: MediaStream | null = null
  let ctx: AudioContext | null = null
  const dc = pc.createDataChannel('oai-events')
  const send = (ev: Record<string, unknown>) => { if (dc.readyState === 'open') dc.send(JSON.stringify(ev)) }

  const stop = () => {
    if (stopped) return
    stopped = true
    if (startedAt) log({ kind: 'stop', ms: Date.now() - startedAt, detail: `${toolCalls} tool calls, ${replies} replies` })
    try { dc.close() } catch { /* closed */ }
    try { pc.close() } catch { /* closed */ }
    mic?.getTracks().forEach((t) => t.stop())
    if (audio) audio.srcObject = null
    void ctx?.close().catch(() => undefined)
    state = 'idle'
    opts.onState?.('idle')
  }

  async function runTool(call: { name: string; call_id: string; arguments: string }) {
    const started = Date.now()
    let output: unknown
    let ok = true
    const screen = screenTools[call.name] as LiveToolHandler | undefined
    try {
      const args = call.arguments ? (JSON.parse(call.arguments) as Record<string, unknown>) : {}
      if (screen) {
        output = await screen(args)
      } else {
        const reply = await opts.endpoints.tool(call.name, args, sessionId)
        await opts.onToolReply?.(call.name, reply)
        output = reply.result
      }
      if (output && typeof output === 'object' && 'error' in (output as object)) ok = false
    } catch (err) {
      ok = false
      output = { error: err instanceof Error ? err.message : "That didn't work" }
    }
    toolCalls++
    const failed = !ok && output && typeof output === 'object' && 'error' in (output as object) ? String((output as { error: unknown }).error) : undefined
    log({ kind: 'tool', tool: call.name, where: screen ? 'screen' : 'server', ms: Date.now() - started, ok, ...(failed ? { error: failed } : {}) })
    send({ type: 'conversation.item.create', item: { type: 'function_call_output', call_id: call.call_id, output: JSON.stringify(output ?? {}) } })
  }

  dc.onmessage = (e) => {
    let ev: Record<string, unknown>
    try { ev = JSON.parse(String(e.data)) as Record<string, unknown> } catch { return }
    const type = String(ev['type'] ?? '')
    if (type === 'input_audio_buffer.speech_started') setState('hearing')
    else if (type === 'input_audio_buffer.speech_stopped') setState('thinking')
    else if (type === 'response.created') { caption = ''; if (textMode) setState('thinking') }
    else if (type === 'output_audio_buffer.started') setState('speaking')
    else if (type === 'output_audio_buffer.stopped' || type === 'output_audio_buffer.cleared') setState('listening')
    else if (/^response\.(output_audio_transcript|audio_transcript|output_text|text)\.delta$/.test(type)) {
      caption += String(ev['delta'] ?? '')
      if (textMode) setState('speaking')
      opts.onCaption?.(caption)
    } else if (type === 'response.done') {
      if (caption.trim()) {
        replies++
        opts.onReply?.(caption.trim())
        log({ kind: 'reply', detail: caption.trim().slice(0, 300) })
      }
      const response = (ev['response'] ?? {}) as { output?: Array<Record<string, unknown>> }
      const calls = (response.output ?? []).filter((o) => o['type'] === 'function_call')
      if (calls.length) {
        setState('thinking')
        void Promise.all(calls.map((c) => runTool({ name: String(c['name'] ?? ''), call_id: String(c['call_id'] ?? ''), arguments: String(c['arguments'] ?? '') })))
          .then(() => { if (paused) replyOwed = true; else send({ type: 'response.create' }) })
      } else if (textMode) setState('listening')
    } else if (type === 'error') {
      const message = String(((ev['error'] ?? {}) as Record<string, unknown>)['message'] ?? 'The assistant hit a problem')
      log({ kind: 'error', error: message, detail: 'realtime service' })
      opts.onError?.(message)
    }
  }

  pc.onconnectionstatechange = () => {
    if (stopped) return
    if (pc.connectionState === 'failed' || pc.connectionState === 'disconnected' || pc.connectionState === 'closed') {
      if (paused) { log({ kind: 'stop', detail: `ended while paused (${pc.connectionState})` }); stop(); return }
      log({ kind: 'error', error: `connection ${pc.connectionState}` })
      opts.onError?.('The connection dropped.')
      stop()
    }
  }

  const noop = async () => null
  try {
    const [mint, stream] = await Promise.all([
      opts.endpoints.mint(),
      textMode ? Promise.resolve(null) : navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } }),
    ])
    if (stopped) {
      stream?.getTracks().forEach((t) => t.stop())
      return handle()
    }
    mic = stream
    sessionId = mint.sessionId ?? null
    const missing = (mint.tools ?? []).filter((t) => t.runs === 'screen' && !screenTools[t.name]).map((t) => t.name)
    if (missing.length) log({ kind: 'error', error: `this page can't run: ${missing.join(', ')}`, detail: 'client older than the server' })
    if (stream) {
      ctx = new AudioContext()
      micLevel = meter(ctx, stream)
      for (const track of stream.getTracks()) {
        const sender = pc.addTrack(track, stream)
        if (track.kind === 'audio' && !micTrack) { micTrack = track; micSender = sender }
      }
      pc.ontrack = (e) => {
        const remote = e.streams[0]
        if (!remote || !audio) return
        audio.srcObject = remote
        if (ctx) voiceLevel = meter(ctx, remote)
      }
    } else {
      // A typed conversation: nothing to send, nothing to hear, but the call still carries an audio line.
      pc.addTransceiver('audio', { direction: 'recvonly' })
    }
    const offer = await pc.createOffer()
    await pc.setLocalDescription(offer)
    const res = await fetch(CALLS_URL, { method: 'POST', headers: { Authorization: `Bearer ${mint.clientSecret}`, 'Content-Type': 'application/sdp' }, body: offer.sdp ?? '' })
    if (!res.ok) throw new Error(`The assistant's service refused the call (${res.status})`)
    await pc.setRemoteDescription({ type: 'answer', sdp: await res.text() })
    await new Promise<void>((resolve, reject) => {
      if (dc.readyState === 'open') return resolve()
      const timer = setTimeout(() => reject(new Error("The assistant's service didn't answer")), 15000)
      dc.onopen = () => { clearTimeout(timer); resolve() }
    })
    startedAt = Date.now()
    log({ kind: 'start', ms: Math.round((typeof performance !== 'undefined' ? performance.now() : Date.now()) - t0), detail: `${mint.model} ${mint.tools?.length ?? 0} tools ${textMode ? 'text' : 'voice'}` })
    setState('listening')
  } catch (err) {
    const denied = typeof DOMException !== 'undefined' && err instanceof DOMException && (err.name === 'NotAllowedError' || err.name === 'NotFoundError')
    log({ kind: 'error', error: err instanceof Error ? err.message : String(err), detail: denied ? 'microphone' : 'starting' })
    opts.onError?.(denied ? 'I need the microphone to listen. Allow it for this page and try again.' : err instanceof Error ? err.message.replace(/^Error \d+:\s*/, '') : "Couldn't start")
    stop()
  }

  function handle(): LiveHandle {
    const say = (text: string) => send({ type: 'conversation.item.create', item: { type: 'message', role: 'user', content: [{ type: 'input_text', text }] } })
    const answer = (text: string) => {
      if (stopped) return
      if (paused) return void held.push(text)
      say(text)
      send({ type: 'response.create' })
    }
    return {
      stop,
      pause: () => {
        if (stopped || paused || state === 'connecting') return
        paused = true
        void micSender?.replaceTrack(null).catch(() => undefined)
        send({ type: 'input_audio_buffer.clear' })
        send({ type: 'response.cancel' })
        if (!textMode) send({ type: 'output_audio_buffer.clear' })
        if (audio) audio.muted = true
        state = 'paused'
        opts.onState?.('paused')
        log({ kind: 'pause' })
      },
      resume: () => {
        if (stopped || !paused) return
        paused = false
        void micSender?.replaceTrack(micTrack).catch(() => undefined)
        if (audio) audio.muted = false
        state = 'listening'
        opts.onState?.('listening')
        const waiting = held.splice(0)
        for (const text of waiting) say(text)
        if (waiting.length || replyOwed) send({ type: 'response.create' })
        replyOwed = false
        log({ kind: 'resume', detail: waiting.length ? `${waiting.length} message(s) held while paused` : '' })
      },
      send: (text: string) => { if (text.trim()) answer(text.trim()) },
      tell: (what: string) => answer(`[On screen] ${what}`),
      report: (text: string) => answer(text),
      note: (what: string) => { if (!stopped) say(`[On screen] ${what}`) },
      ask: async (name, args) => {
        if (stopped || !sessionId) return noop()
        const reply = await opts.endpoints.tool(name, args, sessionId)
        return reply.result ?? null
      },
      session: () => sessionId,
      state: () => state,
      level: () => (state === 'speaking' ? voiceLevel() : state === 'hearing' || state === 'listening' ? micLevel() : 0),
    }
  }
  return handle()
}

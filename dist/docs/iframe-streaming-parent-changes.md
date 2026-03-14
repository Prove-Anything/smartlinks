# Iframe Streaming Parent Changes

This note describes the parent-side changes needed to support AI streaming when an embedded SmartLinks app is running in iframe proxy mode.

If you are using the SDK `IframeResponder` directly, this is already implemented in the SDK changes. You only need this document if your parent application has its own iframe proxy handler and does not rely on `IframeResponder`.

## Goal

Keep the existing architecture:

- local mode: child calls API directly
- iframe proxy mode: child never owns auth state and streams through the parent

This keeps user/session authority in the parent while making AI streaming behave like the rest of the SDK transport.

## What changed

Previously, proxy mode only supported one-shot request/response messages:

- `_smartlinksProxyRequest`
- `_smartlinksProxyResponse`

Streaming now adds a second protocol for long-lived responses:

- `_smartlinksProxyStreamRequest`
- `_smartlinksProxyStream`
- `_smartlinksProxyStreamAbort`

## New parent message handling

### 1. Listen for stream requests

The iframe child may now send this message:

```ts
{
  _smartlinksProxyStreamRequest: true,
  id: string,
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  path: string,
  body?: any,
  headers?: Record<string, string>
}
```

Parent behavior:

- treat this like a proxied API request
- build the real API URL from your configured base URL plus `path`
- send the request using the parent's current auth/session context
- expect an SSE / streaming response body
- keep the request open until the stream ends or is aborted

### 2. Forward stream lifecycle messages back to the child

The parent should send messages back to the iframe using this envelope:

```ts
{
  _smartlinksProxyStream: true,
  id: string,
  phase: 'open' | 'event' | 'end' | 'error',
  data?: any,
  error?: string,
  status?: number
}
```

Phases:

- `open`
  - optional but recommended
  - indicates the upstream streaming request was accepted and a body exists
- `event`
  - contains one parsed JSON event from an SSE `data:` frame
  - send one message per logical event payload
- `end`
  - sent once when the stream finishes normally
- `error`
  - sent if the upstream request fails before or during streaming

### 3. Support abort from the child

The child may stop reading early and send:

```ts
{
  _smartlinksProxyStreamAbort: true,
  id: string
}
```

Parent behavior:

- look up the active stream by `id`
- abort the underlying fetch / reader
- clean up any local state for that stream
- do not keep streaming after abort

## SSE forwarding rules

The upstream AI endpoints return SSE-like frames. The parent should:

- read the response body as a stream
- buffer text until line boundaries
- collect `data:` lines for a single event
- join multi-line `data:` payloads with `\n`
- ignore blank events
- stop on `data: [DONE]`
- JSON-parse each event payload
- forward parsed payloads to the iframe as `_smartlinksProxyStream` with `phase: 'event'`

Minimal parsing behavior:

1. accumulate bytes into text
2. split on `\r?\n`
3. collect each `data:` line
4. on blank line, finalize the event
5. if payload is `[DONE]`, finish
6. otherwise `JSON.parse(payload)` and forward

## Auth and session expectations

The parent remains the source of truth for auth.

That means the parent stream handler should:

- use the same auth headers/token source as normal proxied requests
- not require the iframe to know the bearer token or API key
- naturally pick up the current logged-in user when the stream starts
- cancel active streams if your app invalidates session state on logout or account switch

In practice, the stream request should use the same header-building logic as your normal parent proxy transport.

## Error handling expectations

If the upstream fetch returns a non-2xx status:

- try to read the JSON error body
- derive a useful message
- send one `_smartlinksProxyStream` message with `phase: 'error'`
- include `status` when available
- do not send `end` afterward

If the stream body is missing unexpectedly:

- send `phase: 'error'`

If JSON parsing fails for a single event chunk:

- safest behavior is to ignore that malformed chunk and continue

## State the parent should keep

Track active streams in a map keyed by `id`:

```ts
Map<string, AbortController>
```

Recommended cleanup points:

- on normal stream end
- on error
- on child abort
- on iframe detach/unmount
- on parent auth reset/logout if you want all in-flight streams cancelled immediately

## Parent implementation outline

```ts
const activeStreams = new Map<string, AbortController>()

window.addEventListener('message', async (event) => {
  const msg = event.data

  if (msg?._smartlinksProxyStreamAbort && msg.id) {
    activeStreams.get(msg.id)?.abort()
    activeStreams.delete(msg.id)
    return
  }

  if (msg?._smartlinksProxyStreamRequest && msg.id) {
    const controller = new AbortController()
    activeStreams.set(msg.id, controller)

    try {
      const response = await fetch(buildUrl(msg.path), {
        method: msg.method,
        headers: msg.headers,
        body: msg.body ? JSON.stringify(msg.body) : undefined,
        signal: controller.signal,
      })

      if (!response.ok || !response.body) {
        postError(...)
        return
      }

      postOpen(...)
      await forwardSse(response.body, parsed => postEvent(...parsed))
      postEnd(...)
    } catch (err) {
      if (err?.name !== 'AbortError') postError(...)
    } finally {
      activeStreams.delete(msg.id)
    }
  }
})
```

## Exact protocol summary

### Child → parent

Standard stream request:

```ts
{
  _smartlinksProxyStreamRequest: true,
  id,
  method,
  path,
  body,
  headers
}
```

Abort request:

```ts
{
  _smartlinksProxyStreamAbort: true,
  id
}
```

### Parent → child

Open:

```ts
{
  _smartlinksProxyStream: true,
  id,
  phase: 'open'
}
```

Event:

```ts
{
  _smartlinksProxyStream: true,
  id,
  phase: 'event',
  data: parsedJsonEvent
}
```

End:

```ts
{
  _smartlinksProxyStream: true,
  id,
  phase: 'end'
}
```

Error:

```ts
{
  _smartlinksProxyStream: true,
  id,
  phase: 'error',
  error: 'message',
  status?: number
}
```

## What does not change

These parts of the parent iframe integration stay the same:

- normal `_smartlinksProxyRequest` request/response flow
- upload proxy flow
- auth login/logout postMessage handling
- route/deep-link handling
- resize handling

This is an additive protocol, not a replacement.

## Current SDK reference

The SDK implementation lives in:

- [src/http.ts](src/http.ts)
- [src/iframeResponder.ts](src/iframeResponder.ts)
- [src/types/iframeResponder.ts](src/types/iframeResponder.ts)
- [src/api/ai.ts](src/api/ai.ts)

## Practical recommendation

If your parent already uses `IframeResponder`, prefer upgrading to the SDK version with these changes instead of re-implementing the protocol manually.

If your parent has a custom iframe bridge, implement exactly the three new message types above and reuse your existing auth/header logic from normal proxied requests.

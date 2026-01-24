# Communications Overview (Broadcasts & Settings)

This guide explains how to configure communications (unsubscribe, topics) and how to preview/test/send multi-channel broadcasts via the SDK.

## What You Can Do
- Configure unsubscribe behavior and topics per collection.
- Preview templates and send test messages for Email, Web Push, SMS, Wallet.
- Enqueue production sends with multi-channel strategies.
- Query recipients and log events for analytics.
- Manage public consent and preferences (topics/channels), register methods, and resolve subscriptions.

---

## End-to-End Workflow
A typical flow from admin setup to a delivered broadcast:

1) Define topics and unsubscribe behavior (admin):
```ts
import { comms } from '@proveanything/smartlinks'
await comms.patchSettings('collectionId', {
  unsub: { requireToken: true, secret: '<your-secret>' },
  topics: {
    newsletter: {
      label: 'Newsletter',
      description: 'Occasional updates and stories',
      defaults: {
        channels: { email: true, push: false, sms: false },
        topics: { newsletter: true }
      },
      rules: { allowChannels: ['email', 'push', 'sms'], allowUnsubscribe: true }
    },
    critical: {
      label: 'Critical Notices',
      description: 'Security and operational alerts',
      defaults: { channels: { email: true, push: true }, topics: { critical: true } },
      rules: { allowChannels: ['email', 'push'], allowUnsubscribe: false },
      required: true
    }
  }
})
```

2) Register contact methods (public):
```ts
// Email
await comms.registerEmail('collectionId', { contactId: 'contact_123', email: 'user@example.com' })
// SMS
await comms.registerSms('collectionId', { contactId: 'contact_123', phone: '+12065550100' })
// Push (browser)
const { publicKey } = await comms.getPushVapidPublicKey('collectionId')
const sw = await navigator.serviceWorker.ready
const sub = await sw.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlBase64ToUint8Array(publicKey) })
await comms.registerPush('collectionId', {
  contactId: 'contact_123',
  endpoint: sub.endpoint,
  keys: (sub.toJSON() as any)?.keys,
  meta: { userId: 'user_1' }
})
```

3) Upsert consent and preferences (public):
```ts
await comms.upsertConsent('collectionId', {
  contactId: 'contact_123',
  channels: { email: true, push: true },
  topics: { newsletter: true, critical: true },
  topicsByChannel: { email: { newsletter: true }, push: { critical: true } }
})
// Optional subject-specific override
await comms.upsertPreferences('collectionId', {
  contactId: 'contact_123',
  subject: { type: 'product', id: 'prod_1' },
  channels: { email: true },
  topics: { newsletter: false }
})
```

4) Create a broadcast with a topic, preview, and send (admin):
```ts
import { broadcasts } from '@proveanything/smartlinks'
// Ensure broadcast.data.topic is set to a configured topic
const preview = await broadcasts.preview('collectionId', 'broadcastId', {
  channelOverride: 'email',
  props: { headline: 'Hello World' },
  hydrate: true,
  include: { product: true }
})
// Enqueue production send (auto channel selection via mode)
await broadcasts.send('collectionId', 'broadcastId', {
  pageSize: 200,
  hydrate: true,
  include: { product: true, user: true }
})
```

---

## Admin Comms Settings
Base path: `admin/collection/:collectionId/comm.settings`

### GET Settings
Returns current comms settings. Secrets are masked unless `includeSecret=true`.

SDK:
```ts
import { comms } from '@proveanything/smartlinks'
const { settings } = await comms.getSettings('collectionId', { includeSecret: true })
```

Typical response:
```json
{
  "ok": true,
  "settings": {
    "unsub": { "requireToken": true, "hasSecret": true },
    "topics": { /* managed under comm.settings.topics */ }
  }
}
```

### PATCH Settings
Patch partial settings. To clear `unsub.secret`, send an empty string.

SDK:
```ts
await comms.patchSettings('collectionId', {
  unsub: { requireToken: true, secret: '<your-secret>' }
})
```

#### Topics
- Manage under `settings.topics` (map: topic key → config).
- Public clients fetch via `GET public/collection/:collectionId/comm/topics`.
- Each topic can declare `classification` and default consent `policy`:
  - Classification: `transactional` (order confirmations, password resets) vs `marketing` (newsletters, promos).
  - Default policy: `opt-in` or `opt-out`, with optional per-channel overrides under `defaults.byChannel`.

SDK:
```ts
const { topics } = await comms.getPublicTopics('collectionId')
```

Example topic config:
```json
{
  "product-updates": {
    "label": "Product Updates",
    "description": "News and updates about products",
    "labels": ["news", "releases"],
    "classification": "marketing",
    "defaults": {
      "policy": "opt-in",
      "byChannel": { "email": "opt-in", "push": "opt-in" },
      "channels": { "email": true, "sms": false, "push": true },
      "topics": { "news": true, "releases": true }
    },
    "rules": {
      "allowChannels": ["email", "sms", "push", "wallet"],
      "allowUnsubscribe": true
    },
    "required": false
  }
}
```

Transactional example:
```json
{
  "critical": {
    "label": "Critical Notices",
    "description": "Security and operational alerts",
    "classification": "transactional",
    "defaults": {
      "policy": "opt-out",
      "byChannel": { "email": "opt-out", "push": "opt-out" },
      "channels": { "email": true, "push": true },
      "topics": { "critical": true }
    },
    "rules": { "allowChannels": ["email", "push"], "allowUnsubscribe": false },
    "required": true
  }
}
```

#### Unsubscribe Token
If `unsub.requireToken` is true, public unsubscribe requires a token:
- Basis: `${contactId}:${topic}` (topic opt-out) OR `${contactId}:channel:${channel}` (per-channel) OR `${contactId}`.
- Token: `sha256(basis + ':' + unsub.secret)` (hex).

Public endpoint: `GET public/collection/:collectionId/comm/unsubscribe`

SDK:
```ts
await comms.unsubscribe('collectionId', {
  contactId: 'contact_123',
  topic: 'news',
  token: '<sha256-hex>'
})
```

Helper (browser) for token generation:
```ts
async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2,'0')).join('')
}
// Example: const basis = `${contactId}:${topic}`; const token = await sha256Hex(`${basis}:${secret}`)
```

---

## Public Comms API (Unified)
Base path: `public/collection/:collectionId/comm/*`

### Topics
List configured topics (admin-defined).

SDK:
```ts
const { topics } = await comms.getPublicTopics('collectionId')
```

Response includes UI metadata for defaults and classification:
- `topics[key].classification`: `transactional` | `marketing`
- `topics[key].defaults.policy`: `opt-in` | `opt-out`
- `topics[key].defaults.byChannel[channel]`: `opt-in` | `opt-out`

UI guidance for toggles:
- If `defaults.byChannel[channel]` exists, use it to set the default toggle position.
- Else use `defaults.policy` for all channels.
- If neither is present, fall back by classification: transactional → opt-out; marketing → opt-in.
- Explicit preferences always override defaults.

Helper to compute effective policy per channel:
```ts
type Policy = 'opt-in' | 'opt-out'
function effectivePolicy(topic: any, channel: 'email'|'sms'|'push'|'wallet'): Policy {
  return (
    topic?.defaults?.byChannel?.[channel] ??
    topic?.defaults?.policy ??
    (topic?.classification === 'marketing' ? 'opt-in' : 'opt-out')
  ) as Policy
}
```

### Consent (default)
Upsert default consent for a contact (applies when no subject context).

SDK:
```ts
await comms.upsertConsent('collectionId', {
  contactId: 'contact_123',
  channels: { email: true, push: true },
  topics: { newsletter: true, alerts: true },
  topicsByChannel: { email: { newsletter: true }, push: { alerts: true } }
})
```

### Preferences (subject-specific)
Upsert consent for a specific subject, or omit `subject` to target defaults.

SDK:
```ts
await comms.upsertPreferences('collectionId', {
  contactId: 'contact_123',
  subject: { type: 'product', id: 'prod_1' },
  channels: { email: true },
  topics: { updates: true }
})
```

### Subscribe / Unsubscribe (subject)
Create or remove a subscription to a subject.

SDK:
```ts
const { subscriptionId } = await comms.subscribe('collectionId', {
  contactId: 'contact_123',
  subject: { type: 'proof', id: 'prf_1', productId: 'prod_1' },
  subscribe: true,
  source: 'api'
})
```

### Subscription Check
Check if a contact is subscribed to a subject.

SDK:
```ts
const r = await comms.checkSubscription('collectionId', {
  contactId: 'contact_123', subjectType: 'proof', subjectId: 'prf_1', productId: 'prod_1'
})
// r.subscribed === true|false
```

### Methods (list and register)
- List methods:
```ts
const methods = await comms.listMethods('collectionId', { contactId: 'contact_123', type: 'email' })
```
- Register email:
```ts
await comms.registerEmail('collectionId', { contactId: 'contact_123', email: 'user@example.com' })
```
- Register SMS:
```ts
await comms.registerSms('collectionId', { contactId: 'contact_123', phone: '+12065550100' })
```

### Resolve Subscriptions
Resolve contacts for a subject using identity hints.

SDK:
```ts
const res = await comms.resolveSubscriptions('collectionId', {
  subject: { type: 'product', id: 'prod_1' },
  hints: { userId: 'user_1', email: 'user@example.com' }
})
```

### Unsubscribe (public link)
Unsubscribe a contact from a topic or channel. If `requireToken=true` in settings, include a token.

SDK:
```ts
await comms.unsubscribe('collectionId', {
  contactId: 'contact_123',
  topic: 'newsletter',
  token: '<sha256-hex-when-required>'
})
```

## Broadcasts (Multi-Channel)
Base path: `admin/collection/:collectionId/broadcasts/:id`
Channels: `email`, `push`, `sms`, `wallet`.

### Preview
`POST .../preview` — Preview rendering for a chosen channel (or auto).

SDK:
```ts
import { broadcasts } from '@proveanything/smartlinks'
const preview = await broadcasts.preview('collectionId', 'broadcastId', {
  email: 'user@example.com',
  channelOverride: 'push',
  props: { productId: 'prod_123' },
  hydrate: true,
  include: { product: true, proof: true }
})
// preview.channel === 'push'; preview.payload or subject/body based on channel
```

### Test Send
`POST .../send/test` — Sends a single test via chosen/auto channel.

SDK:
```ts
await broadcasts.sendTest('collectionId', 'broadcastId', {
  contactId: 'contact_123',
  props: { promo: 'JAN' }
})
```

### Enqueue Production Send
`POST .../send` — Enqueue background send. When `channel` is omitted, uses broadcast mode:
- `preferred`: best single channel per recipient.
- `channels`/`all`: sends on all enabled channels.

SDK:
```ts
import type { BroadcastSendRequest } from '@proveanything/smartlinks'
const body: BroadcastSendRequest = {
  pageSize: 200,
  channel: undefined, // omit to use broadcast mode
  hydrate: true,
  include: { product: true, proof: true, user: true }
}
await broadcasts.send('collectionId', 'broadcastId', body)
```

### Topic Targeting and Consent

Broadcasts must declare a message `topic` under `broadcast.data.topic` (e.g., `newsletter`, `marketing`, `critical`). This ties directly to comms settings topics and consent:

- Topic keys should match those used in `settings.topics` (see Admin Comms Settings above).
- During preview/send, consent is enforced using the contact’s preferences:
  - Channel-level: `preferences/_default.channels[channel]`
  - Topic-level: `preferences/_default.topics[topic]`
  - Per-channel topic: `preferences/_default.topicsByChannel[channel][topic]`
  - Subject-specific preferences apply when preview/send hydrates a subject context.

Minimal example:
```json
{
  "data": {
    "topic": "critical",
    "channelSettings": {
      "mode": "preferred",
      "channels": [
        { "channel": "email", "enabled": true, "priority": 1, "templateId": "tmpl_email_critical" },
        { "channel": "push",  "enabled": true, "priority": 2 }
      ]
    }
  }
}
```

Guidance:
- Use `topic` for high-level purpose (e.g., newsletters vs. urgent notices).
- Define topics in `settings.topics` and set defaults (`defaults.topics` and optionally `defaults.channels`).
- For urgent/mandatory messages, consider marking the topic with `rules.required: true` or `rules.allowUnsubscribe: false`.

### Recipients & Events
SDK:
```ts
// Recipients page
const recips = await broadcasts.recipients('collectionId', 'broadcastId', { limit: 50 })

// Append single event
await broadcasts.append('collectionId', {
  broadcastId: 'broadcastId',
  contactId: 'contact_123',
  channel: 'email',
  eventType: 'delivered',
  outcome: 'success'
})

// Append bulk events
await broadcasts.appendBulk('collectionId', {
  params: { broadcastId: 'broadcastId', channel: 'push' },
  ids: ['contact_1', 'contact_2'],
  idField: 'contactId'
})
```

---

## Analytics (Comms)
Additional analytics helpers live under `comms`:
```ts
import { comms } from '@proveanything/smartlinks'

// Query events by user/contact
const events = await comms.queryByUser('collectionId', { userId: 'user_123', limit: 100 })

// Recipient IDs for a source
const ids = await comms.queryRecipientIds('collectionId', { broadcastId: 'br_456' })

// Recipients without action
const without = await comms.queryRecipientsWithoutAction('collectionId', { broadcastId: 'br_456', actionId: 'open' })

// Recipients with action
const withAction = await comms.queryRecipientsWithAction('collectionId', { broadcastId: 'br_456', actionId: 'click', includeOutcome: true })

// Append event(s)
await comms.logCommunicationEvent('collectionId', { eventType: 'opened', channel: 'email', contactId: 'contact_123' })
await comms.logBulkCommunicationEvents('collectionId', { params: { broadcastId: 'br_456' }, ids: ['contact_1','contact_2'], idField: 'contactId' })
```

---

## Push Registration (Quick Ref)
Browser Web Push registration via public endpoints.

### Endpoints

- GET `/public/collection/:collectionId/comm/push/vapidPublicKey`
  - Response: `{ publicKey: string }`
  - Returns the VAPID public key for creating browser push subscriptions via comms.
  - Prefer unified registration via `/public/collection/:collectionId/comm/push/register`.

### Request Shapes

Unified registration body:
```json
{
  "contactId": "contact_123",
  "endpoint": "https://fcm.googleapis.com/fcm/send/abc...",
  "keys": { "p256dh": "...", "auth": "..." },
  "meta": { "userId": "user_1" }
}
```

### Client Flow (Browser)

1) Fetch VAPID public key:
```ts
import { comms } from '@proveanything/smartlinks'
const { publicKey } = await comms.getPushVapidPublicKey(collectionId);
```

2) Create a subscription via the Service Worker:
```ts
const registration = await navigator.serviceWorker.ready;
const subscription = await registration.pushManager.subscribe({
  userVisibleOnly: true,
  applicationServerKey: urlBase64ToUint8Array(publicKey),
});
// Convert to JSON shape acceptable by server
const subJson = subscription.toJSON() as any
```

3) Register push method via unified comms:
```ts
await comms.registerPush(collectionId, {
  contactId,
  endpoint: subscription.endpoint,
  keys: subJson?.keys,
  meta: { userId },
});

---

## Public API Quick Start (curl)

Replace `COLL` and `CONTACT` with your values.

Topics:
```bash
curl -s "https://api.example.com/public/collection/COLL/comm/topics"
```

Consent:
```bash
curl -X POST "https://api.example.com/public/collection/COLL/comm/consent" \
  -H "Content-Type: application/json" \
  -d '{
    "contactId": "CONTACT",
    "channels": { "email": true, "push": true },
    "topics": { "newsletter": true },
    "topicsByChannel": { "email": { "newsletter": true } }
  }'
```

Preferences (subject-specific):
```bash
curl -X POST "https://api.example.com/public/collection/COLL/comm/preferences" \
  -H "Content-Type: application/json" \
  -d '{
    "contactId": "CONTACT",
    "subject": { "type": "product", "id": "prod_1" },
    "channels": { "email": true },
    "topics": { "updates": true }
  }'
```

Subscribe:
```bash
curl -X POST "https://api.example.com/public/collection/COLL/comm/subscribe" \
  -H "Content-Type: application/json" \
  -d '{
    "contactId": "CONTACT",
    "subject": { "type": "proof", "id": "prf_1", "productId": "prod_1" },
    "subscribe": true,
    "source": "api"
  }'
```

Check subscription:
```bash
curl -s "https://api.example.com/public/collection/COLL/comm/check?contactId=CONTACT&subjectType=proof&subjectId=prf_1&productId=prod_1"
```

List methods:
```bash
curl -s "https://api.example.com/public/collection/COLL/comm/methods?contactId=CONTACT&type=email"
```

Register email:
```bash
curl -X POST "https://api.example.com/public/collection/COLL/comm/methods/email/register" \
  -H "Content-Type: application/json" \
  -d '{ "contactId": "CONTACT", "email": "user@example.com" }'
```

Register SMS:
```bash
curl -X POST "https://api.example.com/public/collection/COLL/comm/methods/sms/register" \
  -H "Content-Type: application/json" \
  -d '{ "contactId": "CONTACT", "phone": "+12065550100" }'
```

VAPID public key:
```bash
curl -s "https://api.example.com/public/collection/COLL/comm/push/vapidPublicKey"
```

Register Push:
```bash
curl -X POST "https://api.example.com/public/collection/COLL/comm/push/register" \
  -H "Content-Type: application/json" \
  -d '{
    "contactId": "CONTACT",
    "endpoint": "https://fcm.googleapis.com/fcm/send/abc...",
    "keys": { "p256dh": "...", "auth": "..." },
    "meta": { "userId": "user_1" }
  }'
```

Unsubscribe (token when required):
```bash
curl -s "https://api.example.com/public/collection/COLL/comm/unsubscribe?contactId=CONTACT&topic=newsletter&token=HEX_TOKEN"
```
```

Utility: `urlBase64ToUint8Array` for VAPID key:
```ts
export function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i);
  return outputArray;
}
```

### Server Notes
- The VAPID key endpoint is global and not collection-scoped.
- It derives `domain` and `userAgent` from request headers.
- Provide `contactId`; derive from `userId` or from endpoint hash for anonymous.
- Linked via `CommService.upsertMethod` type `push` stored for analytics/broadcasts.
- Error codes: `INVALID_SUBSCRIPTION`, `MISSING_COLLECTION`, `SERVER_ERROR`.

---

## Notes & Prereqs
- Email: SendGrid credentials via env or collection comm settings.
- Push: `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`.
- SMS: Twilio credentials.
- Wallet: Google Wallet issuer + service account.
- Hydration: set `hydrate: true` and use `include` to enrich template props.
- To make a type mandatory, set `rules.required: true` or `rules.allowUnsubscribe: false`.

# Communications (Comms & Broadcasts)

This guide covers the full communications surface of the SDK: transactional sends, multi-channel broadcasts, consent management, push registration, and analytics.

---

## What You Can Do

- **Transactional Send** — Fire a single targeted message to one contact without creating a broadcast record.
- **Broadcasts** — Define and enqueue multi-channel campaigns (email, push, SMS, wallet); preview and test before sending.
- **Comms Settings** — Configure topics and unsubscribe behaviour per collection.
- **Consent & Preferences** — Record opt-ins/outs and per-subject preferences.
- **Method Registration** — Register email, SMS, and Web Push contact methods.
- **Analytics** — Query delivery events, recipient lists, and log custom events.

---

## Transactional Send

Sends a single message to one contact using a template. No broadcast record is created. The send is logged to the contact's communication history with `sourceType: 'transactional'`.

**Endpoint:** `POST /admin/collection/:collectionId/comm.send`

```typescript
import { comms } from '@proveanything/smartlinks'
import type { TransactionalSendRequest } from '@proveanything/smartlinks'

const result = await comms.sendTransactional('collectionId', {
  contactId:  'e4f2a1b0-...',
  templateId: 'warranty-update',
  channel:    'preferred',          // 'email' | 'sms' | 'push' | 'wallet' | 'preferred' (default)
  props:      { claimRef: 'CLM-0042', decision: 'approved' },
  include: {
    productId: 'prod-abc123',       // hydrate product context into template
    appCase:   'c9d1e2f3-...',      // hydrate an app case record
  },
  ref:   'warranty-decision-notification',  // arbitrary string for your own tracking
  appId: 'warrantyApp',
})

if (result.ok) {
  console.log(`Sent via ${result.channel}`, result.messageId)
} else {
  console.error('Send failed:', result.error)
}
```

### Request Body

| Field | Type | Description |
|-------|------|-------------|
| `contactId` | `string` | **Required.** Contact to send to. |
| `templateId` | `string` | **Required.** Template to render. |
| `channel` | `'email' \| 'sms' \| 'push' \| 'wallet' \| 'preferred'` | Channel to send on. `'preferred'` (default) picks the contact's best available channel. |
| `props` | `Record<string, unknown>` | Extra variables merged into template rendering. |
| `include` | object | Hydration flags — see table below. |
| `ref` | `string` | Arbitrary reference string stored with the event. |
| `appId` | `string` | App identifier, used for context/logging. |

**`include` fields:**

| Field | Type | Description |
|-------|------|-------------|
| `collection` | `boolean` | Include collection data in template context. |
| `productId` | `string` | Hydrate a specific product. |
| `proofId` | `string` | Hydrate a specific proof. |
| `user` | `boolean` | Include the requesting user's data. |
| `appCase` | `string` | Hydrate an app case record by ID. |
| `appThread` | `string` | Hydrate an app thread record by ID. |
| `appRecord` | `string` | Hydrate an app record by ID. |

### Response

```typescript
// Success
{ ok: true; channel: 'email' | 'sms' | 'push' | 'wallet'; messageId?: string }

// Failure
{ ok: false; error: string }
```

---

## Broadcasts

Broadcasts are multi-channel campaigns defined and managed under a collection. Create a broadcast record in the platform first, then use the SDK to preview, test, and enqueue.

**Import:**
```typescript
import { broadcasts } from '@proveanything/smartlinks'
import type { BroadcastSendRequest } from '@proveanything/smartlinks'
```

### Preview

Render a broadcast template for a given channel without sending.

```typescript
const preview = await broadcasts.preview('collectionId', 'broadcastId', {
  email: 'user@example.com',       // optional: override recipient email for preview
  channelOverride: 'push',         // force a specific channel
  props: { productId: 'prod_123' },
  hydrate: true,
  include: { product: true, proof: true }
})
// preview.channel — which channel was rendered
// preview.payload / preview.subject / preview.body — channel-specific render output
```

### Test Send

Send a single test message to a contact.

```typescript
await broadcasts.sendTest('collectionId', 'broadcastId', {
  contactId: 'contact_123',
  props: { promo: 'JAN' }
})
```

### Enqueue Production Send

Enqueue a background send to all recipients. When `channel` is omitted the broadcast's own mode setting drives channel selection:
- `preferred` — picks the best single channel per recipient.
- `channels` / `all` — sends on every enabled channel.

```typescript
const body: BroadcastSendRequest = {
  pageSize: 200,
  hydrate: true,
  include: { product: true, proof: true, user: true }
}
await broadcasts.send('collectionId', 'broadcastId', body)
```

### Manual Send

```typescript
await broadcasts.sendManual('collectionId', 'broadcastId', { /* overrides */ })
```

### Topic Targeting and Consent

A broadcast must declare a `topic` under `broadcast.data.topic` (e.g. `newsletter`, `critical`). The topic key must match one defined in your collection's comms settings, and consent enforcement uses it at send time.

Consent resolution order (per recipient, per channel):
1. `preferences._default.topicsByChannel[channel][topic]`
2. `preferences._default.channels[channel]`
3. `preferences._default.topics[topic]`
4. Subject-specific preferences (when hydrating a subject context)

Minimal broadcast data shape:
```json
{
  "data": {
    "topic": "newsletter",
    "channelSettings": {
      "mode": "preferred",
      "channels": [
        { "channel": "email", "enabled": true, "priority": 1, "templateId": "tmpl_newsletter_email" },
        { "channel": "push",  "enabled": true, "priority": 2 }
      ]
    }
  }
}
```

### Append Recipients and Events

```typescript
// Append a single delivery event
await broadcasts.append('collectionId', {
  broadcastId: 'broadcastId',
  contactId:   'contact_123',
  channel:     'email',
  eventType:   'delivered',
  outcome:     'success'
})

// Append bulk events
await broadcasts.appendBulk('collectionId', {
  params: { broadcastId: 'broadcastId', channel: 'push' },
  ids:    ['contact_1', 'contact_2'],
  idField: 'contactId'
})

// List recipients
const recips = await broadcasts.recipients('collectionId', 'broadcastId', { limit: 50 })
```

---

## Admin Comms Settings

Configure unsubscribe behaviour and topics per collection.

**Base path:** `admin/collection/:collectionId/comm.settings`

### Get Settings

```typescript
import { comms } from '@proveanything/smartlinks'
const { settings } = await comms.getSettings('collectionId', { includeSecret: true })
// settings.unsub — { requireToken, hasSecret }
// settings.topics — map of topic key → config
```

### Patch Settings

```typescript
await comms.patchSettings('collectionId', {
  unsub: { requireToken: true, secret: '<your-secret>' },
  topics: { /* ... */ }
})
```

To clear the unsubscribe secret, send `secret: ''`.

### Topics Config

Each topic key maps to a config object:

```json
{
  "newsletter": {
    "label": "Newsletter",
    "description": "Occasional updates and stories",
    "classification": "marketing",
    "defaults": {
      "policy": "opt-in",
      "byChannel": { "email": "opt-in", "push": "opt-in" },
      "channels": { "email": true, "push": true, "sms": false }
    },
    "rules": {
      "allowChannels": ["email", "sms", "push"],
      "allowUnsubscribe": true
    },
    "required": false
  },
  "critical": {
    "label": "Critical Notices",
    "classification": "transactional",
    "defaults": {
      "policy": "opt-out",
      "channels": { "email": true, "push": true }
    },
    "rules": { "allowChannels": ["email", "push"], "allowUnsubscribe": false },
    "required": true
  }
}
```

- `classification`: `'transactional'` or `'marketing'` — used by the UI when no explicit policy is set.
- `defaults.policy`: `'opt-in'` or `'opt-out'` — fallback policy for channels not overridden by `byChannel`.
- `required: true` and `rules.allowUnsubscribe: false` — use for critical/mandatory messages.

### Unsubscribe Tokens

If `unsub.requireToken` is true, public unsubscribe calls must include a `token` query param.

Token generation (topic opt-out):
```
basis = "${contactId}:${topic}"
token = sha256(basis + ":" + unsub.secret)   // hex
```

Token generation (channel opt-out):
```
basis = "${contactId}:channel:${channel}"
token = sha256(basis + ":" + unsub.secret)
```

Browser helper:
```typescript
async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

const token = await sha256Hex(`${contactId}:${topic}:${secret}`)
```

---

## Public Comms API

All public endpoints live under `public/collection/:collectionId/comm/*` and do not require an API key.

### Get Topics

```typescript
const { topics } = await comms.getPublicTopics('collectionId')
```

Each topic carries UI metadata:
- `classification`: `'transactional'` | `'marketing'`
- `defaults.policy`: `'opt-in'` | `'opt-out'`
- `defaults.byChannel[channel]`: per-channel override

Helper to resolve effective policy for a toggle UI:
```typescript
type Policy = 'opt-in' | 'opt-out'

function effectivePolicy(topic: any, channel: 'email' | 'sms' | 'push' | 'wallet'): Policy {
  return (
    topic?.defaults?.byChannel?.[channel] ??
    topic?.defaults?.policy ??
    (topic?.classification === 'marketing' ? 'opt-in' : 'opt-out')
  ) as Policy
}
```

### Consent (Default)

Record a contact's default channel and topic opt-ins.

```typescript
await comms.upsertConsent('collectionId', {
  contactId: 'contact_123',
  channels:        { email: true, push: true },
  topics:          { newsletter: true, critical: true },
  topicsByChannel: { email: { newsletter: true }, push: { critical: true } }
})
```

### Preferences (Subject-Specific)

Record consent specific to a product, proof, or other subject. Omit `subject` to update defaults.

```typescript
await comms.upsertPreferences('collectionId', {
  contactId: 'contact_123',
  subject:   { type: 'product', id: 'prod_1' },
  channels:  { email: true },
  topics:    { updates: true }
})
```

### Subscribe / Unsubscribe (Subject)

Manage subscriptions to a specific subject (e.g. product updates, proof alerts).

```typescript
// Subscribe
const { subscriptionId } = await comms.subscribe('collectionId', {
  contactId: 'contact_123',
  subject:   { type: 'proof', id: 'prf_1', productId: 'prod_1' },
  subscribe: true,
  source:    'api'
})

// Unsubscribe (same call, subscribe: false)
await comms.subscribe('collectionId', {
  contactId: 'contact_123',
  subject:   { type: 'proof', id: 'prf_1', productId: 'prod_1' },
  subscribe: false,
  source:    'api'
})
```

### Check Subscription

```typescript
const r = await comms.checkSubscription('collectionId', {
  contactId:   'contact_123',
  subjectType: 'proof',
  subjectId:   'prf_1',
  productId:   'prod_1'
})
// r.subscribed === true | false
```

### Resolve Subscriptions

Find contacts that are subscribed to a subject using identity hints.

```typescript
const res = await comms.resolveSubscriptions('collectionId', {
  subject: { type: 'product', id: 'prod_1' },
  hints:   { userId: 'user_1', email: 'user@example.com' }
})
```

### List and Register Methods

```typescript
// List registered methods for a contact
const { methods } = await comms.listMethods('collectionId', {
  contactId: 'contact_123',
  type: 'email'          // optional filter: 'email' | 'sms' | 'push'
})

// Register email
await comms.registerEmail('collectionId', {
  contactId: 'contact_123',
  email: 'user@example.com'
})

// Register SMS
await comms.registerSms('collectionId', {
  contactId: 'contact_123',
  phone: '+12065550100'
})
```

### Unsubscribe (Public Link / One-Click)

```typescript
await comms.unsubscribe('collectionId', {
  contactId: 'contact_123',
  topic:     'newsletter',
  token:     '<sha256-hex-when-requireToken-is-true>'
})
```

Omit `topic` to unsubscribe from all. Omit `channel` to apply across all channels.

---

## Push Registration

Web Push requires a service worker and the browser's Push API.

### 1. Fetch the VAPID Public Key

```typescript
import { comms } from '@proveanything/smartlinks'
const { publicKey } = await comms.getPushVapidPublicKey('collectionId')
```

### 2. Subscribe in the Service Worker

```typescript
const registration = await navigator.serviceWorker.ready
const subscription = await registration.pushManager.subscribe({
  userVisibleOnly: true,
  applicationServerKey: urlBase64ToUint8Array(publicKey),
})
const subJson = subscription.toJSON() as any
```

### 3. Register the Method

```typescript
await comms.registerPush('collectionId', {
  contactId: 'contact_123',
  endpoint:  subscription.endpoint,
  keys:      subJson?.keys,
  meta:      { userId: 'user_1' }
})
```

### VAPID Key Utility

```typescript
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  const output = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; i++) output[i] = rawData.charCodeAt(i)
  return output
}
```

---

## Analytics

### Query Events by User / Contact

```typescript
const events = await comms.queryByUser('collectionId', {
  userId: 'user_123',
  limit:  100
})
```

### Recipient IDs for a Source

```typescript
const ids = await comms.queryRecipientIds('collectionId', {
  broadcastId: 'br_456'
})
```

### Recipients Without an Action

```typescript
const withoutOpen = await comms.queryRecipientsWithoutAction('collectionId', {
  broadcastId: 'br_456',
  actionId:    'open'
})
```

### Recipients With an Action

```typescript
const withClick = await comms.queryRecipientsWithAction('collectionId', {
  broadcastId:    'br_456',
  actionId:       'click',
  includeOutcome: true    // returns RecipientWithOutcome[] instead of RecipientId[]
})
```

### Log Events

```typescript
// Single event
await comms.logCommunicationEvent('collectionId', {
  eventType: 'opened',
  channel:   'email',
  contactId: 'contact_123'
})

// Bulk events (same params applied to all IDs)
await comms.logBulkCommunicationEvents('collectionId', {
  params: { broadcastId: 'br_456', channel: 'email', eventType: 'delivered' },
  ids:    ['contact_1', 'contact_2', 'contact_3'],
  idField: 'contactId'
})
```

---

## End-to-End Admin Workflow

A typical sequence from setup to delivery:

```typescript
import { comms, broadcasts } from '@proveanything/smartlinks'

// 1. Configure topics and unsubscribe rules
await comms.patchSettings('collectionId', {
  unsub: { requireToken: true, secret: process.env.UNSUB_SECRET },
  topics: {
    newsletter: {
      label: 'Newsletter', classification: 'marketing',
      defaults: { policy: 'opt-in', channels: { email: true, push: true } },
      rules: { allowChannels: ['email', 'push', 'sms'], allowUnsubscribe: true }
    }
  }
})

// 2. Register contact methods (done at contact creation / profile update)
await comms.registerEmail('collectionId', { contactId: 'c_123', email: 'user@example.com' })

// 3. Record consent (done when user confirms opt-in)
await comms.upsertConsent('collectionId', {
  contactId: 'c_123',
  channels: { email: true }, topics: { newsletter: true }
})

// 4a. Transactional: send a one-off triggered message
const result = await comms.sendTransactional('collectionId', {
  contactId: 'c_123', templateId: 'order-confirmed',
  channel: 'email', props: { orderId: 'ORD-001' }
})

// 4b. Broadcast: preview → test → enqueue
const preview = await broadcasts.preview('collectionId', 'br_spring', {
  channelOverride: 'email', hydrate: true, include: { product: true }
})
await broadcasts.sendTest('collectionId', 'br_spring', { contactId: 'c_123' })
await broadcasts.send('collectionId', 'br_spring', { pageSize: 200, hydrate: true })
```

---

## Prerequisites

| Feature | Requirement |
|---------|-------------|
| Email | SendGrid credentials (env or collection comms settings) |
| Push | `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY` env vars |
| SMS | Twilio credentials (env or collection comms settings) |
| Wallet | Google Wallet issuer + service account |
| Hydration | Set `hydrate: true` and populate `include` on broadcast/transactional sends |

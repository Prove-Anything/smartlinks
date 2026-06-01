# SmartLinks Auth Kit (`@proveanything/smartlinks` — `authKit` namespace)

> End-user authentication flows for SmartLinks microapps. Covers email/password, magic links, phone OTP, Google OAuth, profile management, and password/email change flows.
>
> **This is part of the core SDK** — no separate install required. Import from `@proveanything/smartlinks`.

---

## What is Auth Kit for?

Auth Kit is the **end-user identity layer** for microapps that need users to sign in. It is distinct from the admin/platform authentication (Bearer tokens) used to call admin endpoints.

Use Auth Kit when:
- Your app has a login/register screen for end users (not collection admins)
- You need to gate features behind a verified user identity
- You want to store user-specific data with the `userAppData` API (see [app-data-storage.md](app-data-storage.md))

Do **not** use Auth Kit for:
- Admin-side API calls (those use Bearer tokens set by the platform shell)
- Claiming proofs (see proof claiming methods)

---

## Setup: creating an Auth Kit client

Each app requires an Auth Kit configuration, created by a collection admin:

```ts
// Admin setup (one-time, done in admin console)
import { authKit } from '@proveanything/smartlinks';

// Returns an authKitId to store in your app config
const config = await authKit.create(collectionId, {
  name: 'My App Auth',
  loginMethods: ['email', 'google', 'magic_link'],
  redirectUrl: 'https://myapp.example.com/auth/callback',
});
```

---

## Key flows

### Email / password

```ts
import { authKit } from '@proveanything/smartlinks';

// Register
const session = await authKit.register(clientId, {
  email: 'user@example.com',
  password: 'securePassword123',
  displayName: 'Alice',
});

// Login
const session = await authKit.login(clientId, 'user@example.com', 'securePassword123');

// session.token — store this; pass to initializeApi for subsequent calls
```

### Magic link (passwordless email)

```ts
await authKit.sendMagicLink(clientId, {
  email: 'user@example.com',
  redirectUrl: 'https://myapp.example.com/auth/verify',
});

// On callback page, extract token from URL and verify
const session = await authKit.verifyMagicLink(clientId, tokenFromUrl);
```

### Phone OTP

```ts
await authKit.sendPhoneCode(clientId, '+61400000000');
const session = await authKit.verifyPhoneCode(clientId, '+61400000000', '123456');
```

### Lightweight verification (WhatsApp + SMS)

Use these flows when you want low-friction verification before or without full account sign-in.

WhatsApp verification is token-first. The user does not type their phone number in your app for this flow; phone ownership is proven by the inbound WhatsApp sender number.

```ts
import { authKit } from '@proveanything/smartlinks';

// 1) Send WhatsApp verification deep link
const wa = await authKit.sendWhatsApp(clientId);

// Optional: pass redirect context and/or a post-verification reply
// const wa = await authKit.sendWhatsApp(clientId, {
//   redirectUrl: 'https://app.example.com/checkout/continue',
//   prefillMessage: 'Please let me bid in this auction. Code: {{token}}',
//   contactData: {
//     name: 'Jane Doe',
//     email: 'jane@example.com',
//     source: 'auction-checkout',
//     customFields: { agreedToTerms: true },
//   },
//   reply: {
//     cta: {
//       body: "You're verified and ready to bid.",
//       buttonLabel: 'Back to Auction',
//       buttonUrl: '{{returnUrl}}',
//       // mediaUrl: 'https://cdn.example.com/bid-confirmed.jpg',  // optional: include to use image card template
//     },
//     text: "You're verified. Return to the app to continue.",
//   },
// });

// wa.waLink can be opened directly by the app/browser
// Poll status while user switches to WhatsApp and back
const status = await authKit.getWhatsAppStatus(clientId, wa.token);

// Optional: exchange verified WhatsApp proof for an Auth Kit session
if (status.status === 'verified' && wa.sessionKey) {
  const session = await authKit.exchangeWhatsAppSession(clientId, wa.token, wa.sessionKey);
  // session.token can be used as the authenticated bearer token
}

// Optional legacy fallback path if webhook confirmation is unavailable
await authKit.verifyWhatsApp(clientId, wa.token, '+447911123456');

// 2) Or send SMS click-to-verify link
await authKit.sendSmsVerify(clientId, {
  phoneNumber: '+447911123456',
  redirectUrl: 'https://app.example.com/raffle/checkout',
  ctaText: 'Tap to continue',
});

// Optional API verification path
await authKit.verifySms(clientId, '<token>', '+447911123456');
```

`contactData` is optional and is useful when you collect name/email before the customer switches to WhatsApp.

- Auth Kit stores `contactData` on the verification token metadata first.
- Contact details are written to durable contact storage only after WhatsApp verification succeeds.
- If the user abandons before verification, no contact is created.
- `contactData` must not include phone; the verified inbound WhatsApp sender number is always authoritative.

### Contact bootstrap / durable identity

After verification, upsert contact identity and store `contactId` on downstream records (raffle ticket, bid, claim intent).

```ts
const contact = await authKit.upsertContact(clientId, {
  phone: '+447911123456',
  name: 'Jane Doe',
  source: 'raffle-checkout',
  customFields: { channelVerified: 'whatsapp' },
  externalIds: { raffleSessionId: 'rfl_123' },
});

// Persist these on your business record
// contact.contactId, contact.collectionId, verified channel, verifiedAt
```

Verification status values returned by `authKit.getWhatsAppStatus` are:
- `pending`
- `verified`
- `failed`
- `expired`
- `unknown`

#### Post-verification reply

Pass a `reply` object in `sendWhatsApp` to send a message back to the user after they confirm `CONFIRM <token>`. Reply resolution order:

1. `reply.contentSid` — explicit Twilio Content SID
2. `reply.cta` — CTA shorthand:
   - If `cta.mediaUrl` is present (valid public `https://` URL), uses the **image card** Twilio Content template (`TWILIO_WHATSAPP_IMAGE_CTA_SID`)
   - Otherwise uses the **text CTA** template (`TWILIO_WHATSAPP_GENERIC_CTA_SID`)
3. `reply.text` — plain-text fallback
4. Per-client default (`authKit/{clientId}.whatsapp` config)
5. Built-in default text

> **Important:** Only pass `mediaUrl` when you have a valid, publicly reachable `https://` JPEG or PNG. If the field is absent or blank, the text-only CTA template is selected automatically. Never pass an empty string — omit the field entirely to avoid Twilio rejecting the send.

The following template placeholders are available in `reply.text`, `reply.cta` fields, and `reply.contentVariables` values:

| Placeholder | Description |
|---|---|
| `{{returnUrl}}` | The resolved redirect URL |
| `{{phoneNumber}}` | The verified phone number |
| `{{clientId}}` | The Auth Kit client ID |
| `{{token}}` | The verification token |

You can also set `prefillMessage` on `sendWhatsApp` to customize the text pre-filled in the `wa.me` deep link. If `{{token}}` is not present, the token is appended to the message.

#### Session exchange after verification

After polling returns `status === 'verified'`, exchange the verification proof for an Auth Kit login session:

```ts
const session = await authKit.exchangeWhatsAppSession(clientId, wa.token, wa.sessionKey!);
// session: { success, token, user, accountData? }
```

`sessionKey` is returned by `sendWhatsApp` and is used to mitigate token replay from contexts that did not initiate the browser flow.

When `contactData.name` or explicit name parts were supplied on the original `sendWhatsApp` call, `session.user.displayName` and the returned bearer token claims are now seeded from the verified contact record instead of staying `null`.

> **Note:** `redirectUrl` is optional. WhatsApp tokens are short hex strings (16 chars) for better UX.
>
> **Legacy note:** `verifyWhatsApp` is for older phone-bound token flows. Prefer inbound WhatsApp token confirmation plus status polling for new implementations.

### Google OAuth

```ts
// After Google sign-in, pass the id_token to Auth Kit
const session = await authKit.googleLogin(clientId, googleIdToken);
```

### Sign in with Apple

Pass the Apple **identity token** (a JWT). On iOS/native it's
`ASAuthorizationAppleIDCredential.identityToken` (UTF-8 decoded); on web it's
`response.authorization.id_token` from Apple JS.

```ts
const session = await authKit.appleLogin(clientId, appleIdentityToken, {
  // All optional:
  nonce,                                  // raw nonce, if you used nonce binding
  userInfo: { name, email },              // first authorization callback ONLY — Apple never resends it
});
// session.isNewUser and session.expiresAt (ms epoch) are populated by this endpoint.
```

Apple returns the user's name/email **only on the very first authorization, ever**, and
never inside the token. Capture it from that first callback and forward it via `userInfo`
so the server can seed the display name — it's treated as untrusted and never used for identity.

Apple login requires the client's AuthKit config to list allowed audiences in
`appleClientIds`; until then the endpoint returns `400 APPLE_AUTH_NOT_CONFIGURED`.

#### Verified-to-verified account linking (affects Google too)

Both `appleLogin` and `googleLogin` now refuse to silently merge a federated login into a
pre-existing account whose email is **unverified**. Instead they throw
`SmartlinksApiError` with `errorCode === 'ACCOUNT_EXISTS_UNVERIFIED'` (409) and
`err.details?.requiresEmailVerification === true`. Treat this as recoverable, not fatal:

```ts
try {
  const session = await authKit.appleLogin(clientId, appleIdentityToken);
} catch (err) {
  if (err instanceof SmartlinksApiError && err.errorCode === 'ACCOUNT_EXISTS_UNVERIFIED') {
    // "An account with this email exists but isn't verified. Sign in with your
    //  password (or reset it), then link Apple/Google from settings."
  }
}
```

> ⚠️ This is a behaviour change for `googleLogin`, which previously merged silently in
> this case. Handle the 409 for both methods.

### Refresh tokens (native sessions)

Native/Capacitor hosts can hold long-lived sessions via refresh tokens. Opt in **once**
at startup so every request carries `X-Client-Platform: native`:

```ts
initializeApi({ baseURL, platform: 'native' });
```

With the opt-in active, the login endpoints (`login`, `register` in immediate mode,
`googleLogin`, `appleLogin`, `verifyPhoneCode`, `verifyMagicLink`,
`exchangeWhatsAppSession`) additionally return `refreshToken`, `refreshTokenExpiresAt`
(absolute, fixed, ms epoch), and a **short-lived** access `token`. Web clients are
unaffected and receive the unchanged response.

```ts
// Later — exchange the refresh token for a fresh access token.
const r = await authKit.refreshToken(clientId, storedRefreshToken);
// r.refreshToken is ROTATED — persist it and discard the old one BEFORE the next call.
// The SDK already swapped in r.token as the active bearer for you.
persist(r.refreshToken, r.refreshTokenExpiresAt);

// On explicit sign-out — revokes the whole device family server-side + clears the bearer.
await authKit.logout(clientId, storedRefreshToken);
clearPersistedTokens();
```

**Rotation rules the host MUST respect:**

1. **Single-use + rotation.** Every `refreshToken()` returns a new token. Persist it and
   overwrite the old one *before* the next call.
2. **Serialize refreshes.** Fire a single in-flight refresh and queue callers behind it —
   the SDK does **not** serialize for you, and racing two refreshes spends the same token.
3. **Reuse = family death.** Replaying a consumed token throws
   `SmartlinksApiError` with `errorCode === 'REFRESH_TOKEN_REUSE_DETECTED'`; treat as a
   hard logout (clear storage, force re-login). `INVALID_REFRESH_TOKEN` (expired/revoked)
   is handled the same way.
4. **Absolute expiry is fixed.** `refreshTokenExpiresAt` never moves on rotation; once it
   passes (default 90 days) the user must log in again.

> Resume-refresh scheduling and transparent refresh-on-401 are the responsibility of the
> host/auth-ui layer, not this SDK — the SDK only exposes the `refreshToken()` / `logout()`
> primitives and the `platform` opt-in.

---

## Profile management

```ts
import { authKit } from '@proveanything/smartlinks';

// Get current user's profile
const profile = await authKit.getProfile(clientId);

// Update profile
const updatedProfile = await authKit.updateProfile(clientId, {
  displayName: 'Alice B.',
  avatarUrl: '...'
});

// The SDK automatically swaps in updatedProfile.token so future auth.verify()
// and authenticated calls use fresh displayName/photoURL claims immediately.

// Change password
await authKit.changePassword(clientId, 'currentPass', 'newPass');

// Change email (triggers verification)
await authKit.changeEmail(clientId, 'newemail@example.com', 'password', redirectUrl);

// Delete account
await authKit.deleteAccount(clientId, 'password', 'DELETE');
```

`updateProfile` now returns a fresh bearer token together with the updated profile fields. The SDK replaces the in-memory bearer token automatically so token-backed identity reads stay current without an extra refresh step.

---

## Email verification

Auth Kit can send and verify email addresses after registration:

```ts
await authKit.sendEmailVerification(clientId, {
  userId,
  email: 'user@example.com',
  redirectUrl: 'https://myapp.example.com/auth/verified',
});

// On callback page
await authKit.verifyEmail(clientId, tokenFromUrl);
```

---

## Password reset

```ts
await authKit.requestPasswordReset(clientId, {
  email: 'user@example.com',
  redirectUrl: 'https://myapp.example.com/auth/reset',
  clientName: 'My App',
});

// On reset page — verify token is still valid before showing the form
await authKit.verifyResetToken(clientId, tokenFromUrl);

// Complete reset
await authKit.completePasswordReset(clientId, tokenFromUrl, 'newSecurePassword');
```

---

## Relationship to other parts of the SDK

| Concern | Where it lives |
|---------|---------------|
| End-user sign-in / register | `authKit` namespace (this doc) |
| Admin Bearer token auth | Platform shell — not set by your app |
| Per-user data storage | `userAppData` namespace — see [app-data-storage.md](app-data-storage.md) |
| User identity in analytics | `userId` field on `analytics` and `interactions` calls |

---

## Further reading

- [app-data-storage.md](app-data-storage.md) — storing user-specific data after login
- [app-manifest.md](app-manifest.md) — `app.admin.json` setup questions for configuring `clientId`

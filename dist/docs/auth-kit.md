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
  trustedDeviceToken,                     // skip an MFA step-up challenge on a recognized device — see "Step-up MFA" below
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

## Step-up MFA (Phase 1)

Backend-only for now — **no admin-console UI and no challenge UI ship with this pass.**
Factors: **email OTP, SMS OTP, recovery codes**. WhatsApp OTP, TOTP, and passkeys as
*factors* are deferred to a later phase; don't build against them yet.

The step-up gate applies to **every login method that issues a session**:

| Method | Gated? |
|---|---|
| `login()` | ✅ |
| `googleLogin()` | ✅ |
| `appleLogin()` | ✅ — pass `opts.trustedDeviceToken` |
| `verifyPhoneCode()` | ✅ |
| `verifyMagicLink()` | ✅ |
| `exchangeWhatsAppSession()` | ✅ — **this is the WhatsApp method that needs a trusted-device token, not `verifyWhatsApp()`** |
| `verifyWhatsApp()` | ❌ — only confirms the code, never issues a session, so there's nothing to gate |
| `register()` | ❌ — a brand-new user has no enrolled factors to challenge against |
| `googleCodeLogin()` | ❌ — no `/auth/google-code` route exists server-side |

All six gated methods accept an optional `trustedDeviceToken` param (the last positional
argument, or `opts.trustedDeviceToken` for `appleLogin()`) — same purpose everywhere: skip
the challenge on a device the user already verified.

### Handling `MFA_REQUIRED`

Every gated method's return type is unchanged. When the client's MFA policy requires a
step-up, the server returns 403 instead of a session, and the method throws — identically
for all six:

```ts
import { authKit, SmartlinksApiError } from '@proveanything/smartlinks';

try {
  const session = await authKit.login(clientId, email, password);
  // logged in, no MFA required
} catch (err) {
  if (err instanceof SmartlinksApiError && err.errorCode === 'MFA_REQUIRED') {
    const { mfaSessionToken, availableFactors, preferredFactor, maskedDestinations } = err.details!;
    // → route to a challenge UI; call authKit.mfaChallengeSend(clientId, mfaSessionToken, preferredFactor)
  } else {
    throw err;
  }
}
```

### Completing the challenge

```ts
// Send (or resend, or switch factor) a code on the same mfaSessionToken
const sent = await authKit.mfaChallengeSend(clientId, mfaSessionToken, 'sms');
// sent.destination is masked, e.g. "+1******1234"

// Verify the code — behaves like login() on success: bearer token is adopted automatically
const session = await authKit.mfaChallengeVerify(clientId, mfaSessionToken, '123456', /* trustDevice */ true, 'My Laptop');

// Or finalize with a single-use recovery code instead
const session = await authKit.mfaRecoveryCode(clientId, mfaSessionToken, recoveryCode);
```

`mfaSessionToken` is short-lived (10 min) and single-use — burned on 5 failed attempts
(`MFA_TOO_MANY_ATTEMPTS`) or on success. Once burned/expired, there's no "resend within the
same session" — the caller must restart from `login()`.

### Trusted devices — "don't ask again on this device"

There's no fingerprinting involved: a "recognized device" is purely "the caller presented a
valid, unexpired, unrevoked `trustedDeviceToken`". Handle it like the native refresh token
above — same secure storage, same persist-before-next-call discipline:

```ts
// 1) Persist trustedDeviceToken from a successful challenge (trustDevice: true)
persistTrustedDeviceToken(session.trustedDeviceToken, session.trustedDeviceExpiresAt);

// 2) Send it on every subsequent call to ANY of the six gated methods — if still valid,
//    the challenge is skipped entirely. It isn't tied to which method the user challenged
//    through, so "remember this device" works no matter which login method they pick next.
const session = await authKit.login(clientId, email, password, storedTrustedDeviceToken);
const session = await authKit.googleLogin(clientId, idToken, storedTrustedDeviceToken);
const session = await authKit.exchangeWhatsAppSession(clientId, waToken, sessionKey, storedTrustedDeviceToken);
// ...and so on for appleLogin (via opts), verifyPhoneCode, verifyMagicLink.
// If it's revoked/expired, the server silently falls back to requiring a fresh challenge —
// the method just throws MFA_REQUIRED again, no special-case handling needed.

// 3) Let users audit/revoke devices from a Settings screen
const { devices } = await authKit.listTrustedDevices(clientId);
await authKit.revokeTrustedDevice(clientId, deviceId);
```

### Factor management (Settings → Security)

Authenticated (bearer token) — same `mfaSessionToken` + code mechanism as login challenges,
just against a `purpose: 'enroll'` challenge instead of `'login'`.

```ts
// Enroll email (uses the account's existing email)
const { mfaSessionToken } = await authKit.enrollEmailMfa(clientId);
await authKit.confirmEmailMfa(clientId, mfaSessionToken, code);

// Enroll SMS
const { mfaSessionToken: smsToken } = await authKit.enrollSmsMfa(clientId, '+61400000000');
await authKit.confirmSmsMfa(clientId, smsToken, code);

// Recovery codes — plaintext, shown exactly once; nothing else in the API returns them again
const { recoveryCodes } = await authKit.generateMfaRecoveryCodes(clientId, password);

// Inspect / remove
const factors = await authKit.getMfaFactors(clientId);
// factors: { enrolledFactors: { email?, sms? }, recoveryCodesRemaining, mfaEnabledForClient }
await authKit.removeMfaFactor(clientId, 'sms', password);
```

> Enrollment endpoints don't currently check the client's `mfa.mode` — enrolling is possible
> even when MFA is configured `'off'` for a client. Those factors simply won't be challenged
> at login until an admin turns the mode on (via the existing admin AuthKit config update,
> no new admin route in this pass).

### MFA error codes

| `errorCode` | HTTP | Meaning / client action |
|---|---|---|
| `MFA_REQUIRED` | 403 | From any of the six gated login methods — see above |
| `INVALID_MFA_CODE` | 401 | Wrong code — let the user retry (attempts are capped) |
| `MFA_TOO_MANY_ATTEMPTS` | 429 | 5 wrong attempts — the challenge is burned; restart from `login()` |
| `MFA_FACTOR_NOT_ENROLLED` | 400 | Requested factor isn't enrolled — programming error if the UI only offers `availableFactors` |
| `MFA_SESSION_EXPIRED` | 401 | `mfaSessionToken` past its 10-minute TTL — restart from `login()` |
| `MFA_SESSION_INVALID` | 401 | Unknown/wrong-client/already-consumed token, or (on enroll confirm) mismatched user |
| `RECOVERY_CODE_INVALID` | 401 | Wrong or already-used recovery code |

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

## Account security policy

Each collection can configure account-security rules. **The API enforces all of it**; your
login UI reads the policy for UX only (a live password checklist, idle sign-out). There are
two sides: an **admin** writes the policy, and the **login UI** reads the public subset.

**Read (login UI, public — no auth):**

```ts
const config = await authKit.load(clientId);
const policy  = config.security?.passwordPolicy; // min length, char classes, block-common
const session = config.security?.session;        // inactivity + absolute timeouts, rememberMe
```

`lockout` values are admin-only and never returned by `load`.

**Write (admin):** set the whole `security` block with `authKit.update` (or `authKit.create`).
The shape is {@link AuthKitSecurityConfig}; see {@link AuthKitConfigInput}.

```ts
await authKit.update(collectionId, clientId, {
  security: {
    passwordPolicy: {
      minLength: 8,               // hard floor enforced server-side
      blockCommonPasswords: true, // reject the common/breached list
      requireUppercase: false, requireLowercase: false,
      requireNumber: false, requireSymbol: false,
      expiryDays: 0,              // 0 = never expires
      historyCount: 0,            // 0 = reuse allowed
    },
    lockout: {                    // admin-only; enforced server-side
      enabled: true, maxFailedAttempts: 5,
      attemptWindowMinutes: 15, lockoutMinutes: 15,
      notifyUserOnLockout: true,
    },
    session: {
      inactivityTimeoutMinutes: 0, // 0 = disabled (client-enforced when set)
      inactivityWarningSeconds: 60,
      absoluteTimeoutHours: 0,     // 0 = use token lifetime (server-enforced)
      rememberMe: true,
    },
  },
});
```

Defaults if a collection has never set a policy: 8-char minimum + block-common for everyone,
lockout disabled, no expiry/history, no idle/absolute timeout. Omit any field to take its default.

### Password policy

`register`, `completePasswordReset`, and `changePassword` validate the new password
server-side and throw a `SmartlinksApiError` with a {@link PasswordPolicyErrorCode}:

| `errorCode` (400) | Meaning |
|---|---|
| `PASSWORD_TOO_SHORT` | below `minLength` |
| `PASSWORD_REQUIREMENTS_NOT_MET` | missing a required character class |
| `PASSWORD_TOO_COMMON` | on the common/breached list |
| `PASSWORD_RECENTLY_USED` | matched one of the last `historyCount` passwords |

Render a live checklist from `policy` so users see the rules before submitting.

### Lockout

After too many failed logins the account is temporarily locked. `login` throws:

```ts
try {
  await authKit.login(clientId, email, password);
} catch (err) {
  if (err.errorCode === 'ACCOUNT_TEMPORARILY_LOCKED') {
    const mins = Math.ceil(err.details.retryAfterSeconds / 60);
    show(`Too many attempts. Try again in ${mins} minute(s).`);
  }
}
```

Failed MFA challenges count toward the same lock. Locking responds identically for unknown
accounts (no enumeration).

### Password expiry

If a password is older than `passwordPolicy.expiryDays`, a valid login is refused with
**403 `PASSWORD_EXPIRED`** carrying a short-lived `resetToken` — send the user straight into
the reset form to change it in place:

```ts
catch (err) {
  if (err.errorCode === 'PASSWORD_EXPIRED') {
    await authKit.completePasswordReset(clientId, err.details.resetToken, newPassword);
  }
}
```

### Session lifetime

- **Absolute timeout** (`session.absoluteTimeoutHours`) is enforced server-side on the native
  refresh path: once the session is too old, `refreshToken` throws **401 `SESSION_EXPIRED`**
  (see {@link RefreshErrorCode}) — clear storage and route to login. Web sessions use the
  stateless bearer token and rely on inactivity sign-out below.
- **Inactivity timeout** (`session.inactivityTimeoutMinutes` / `inactivityWarningSeconds`) is
  **client-enforced** — sign the user out after idle, warning first. Sync across tabs.
- **`session.rememberMe: false`** → don't persist tokens to durable storage; treat the session
  as browser-scoped.

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

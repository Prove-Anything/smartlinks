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

### Google OAuth

```ts
// After Google sign-in, pass the id_token to Auth Kit
const session = await authKit.googleLogin(clientId, googleIdToken);
```

---

## Profile management

```ts
import { authKit } from '@proveanything/smartlinks';

// Get current user's profile
const profile = await authKit.getProfile(clientId);

// Update profile
await authKit.updateProfile(clientId, { displayName: 'Alice B.', avatarUrl: '...' });

// Change password
await authKit.changePassword(clientId, 'currentPass', 'newPass');

// Change email (triggers verification)
await authKit.changeEmail(clientId, 'newemail@example.com', 'password', redirectUrl);

// Delete account
await authKit.deleteAccount(clientId, 'password', 'DELETE');
```

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

# Members: signed-in people with a level

A club, a league, a wine club, a members' area. SmartLinks has **no separate "membership" object**,
and you don't need one:

| Piece | Where it lives |
|---|---|
| A member's login | The **auth kit**: the site's own logins (auth-kit.md → "Own logins") |
| The member | Their **contact** (one per person, created when they sign in or fill in a form) |
| What they are (gold, silver, junior, pending) | A **contact custom field**, e.g. `customFields.level` |
| Who may see or change it | The contact field's **public** setting: hidden, visible or editable |
| Members-only content | A **server function** that checks the level, then returns the content |
| Managing members | **Studio → Customers**: find people, set their level, email a segment |

**The contract: whoever manages membership writes the member's `level` field.** That can be the owner
by hand in Studio, a memberships app after a payment, or a connector syncing a club's existing system.
The site only ever reads the field, so the way people become members can change without rebuilding
the site.

---

## Questions to settle first

Ask these before building, because they change what you build:

1. **Who can join?** Anyone, or only people the club accepts?
2. **Who sets the level?** The owner (people sign up, then the owner confirms them), or the person
   themselves? Let people choose only a level that unlocks nothing, like "junior / adult".
3. **What does each level get?** Pages, results, discounts, early access, booking.
4. **Fees?** If the club takes payment by hand, the owner sets the level once they've been paid. Paying
   on the site is a memberships app's job. Never take card details in a site.
5. **Do members see each other?** A members' directory needs consent: a "show me in the directory"
   field the member sets themselves.

---

## 1. Sign-in: the site's own logins

- A site's members sign in through its auth kit. The collection's kit is `collection.defaultAuthKitId`
  (`SL.collection.get(collectionId)`).
- A club should have **its own logins**, so its members are accounts of this site only. In Forge: the
  Site tab → Members → "Set up member sign-in" (or "Use my own members" on a site that has the shared
  login). That creates the kit if needed, makes it the site's, and switches it to its own members.
- Use the flows in auth-kit.md: register, login, magic link, Google, password reset, email verification.
  Never build a login of your own, and never store passwords.
- On sign-in, the SDK keeps the member's session (`setBearerToken`). Persist `session.token`
  (respect `rememberMe`), restore it on load with `SL.setBearerToken(token)`, and clear it on sign-out.

Anyone can create a login. **Being a member is the level, not the login**, so an approval club is
just "signed in, no level yet".

## 2. The level field

In a **website**, contact fields are part of its cloud blueprint (`cloud/contacts.json`, applied with
`forge-cloud`):

```json
{
  "fields": {
    "level": { "title": "Membership", "type": "string", "enum": ["pending", "member", "gold"], "public": "visible" },
    "memberUntil": { "title": "Member until", "type": "date", "public": "visible" },
    "showInDirectory": { "title": "Show me in the members' list", "type": "boolean", "public": "editable" }
  }
}
```

| `public` | Member can see it | Member can change it | Use for |
|---|---|---|---|
| `hidden` (default) | no | no | Staff notes, a paid-until the member shouldn't see |
| `visible` | yes | **no** | **The level**, an expiry date |
| `editable` | yes | yes | Preferences and consent the member owns |

A member's own reads and writes (`SL.contact.publicGetMine`, `SL.contact.publicUpdateMine`) and public
forms follow these settings on the server, so a `visible` level can't be changed from the browser.

Outside a website (a plain app), the same settings live in the collection's `contactCustomFields`
(field definitions, a SchemaFormConfig) and `contacts` settings groups (`publicVisibleFields`,
`publicEditableFields`, paths like `customFields.level`). Those lists replace what's stored: read
them, add to them, and write back the whole list, defaults included. Prefer letting the owner set
fields up in Studio → Customers.

## 3. Showing members their status

```ts
const me = await SL.contact.publicGetMine(collectionId) // needs the member's session
// me.contact?.customFields?.level → "gold"; only fields the member may see are returned
```

Use it for the "My membership" page and to decide what to **show**. It is not a lock: anything
members-only must come from a server function.

## 4. Members-only content: check in a server function

```ts
// visibility: public, authority: collection, elevated: true
// capabilities: sl:contacts:write (forCaller), sl:records:read
export async function memberNews(ctx, event) {
  const me = await ctx.sl.contacts.forCaller() // null when signed out
  if (!me) return { ok: false, reason: "sign-in" }
  const level = me.customFields.level
  if (level !== "member" && level !== "gold") return { ok: false, reason: "not-a-member" }
  const until = me.customFields.memberUntil
  if (until && String(until) < new Date().toISOString().slice(0, 10)) return { ok: false, reason: "expired" }
  const news = await ctx.sl.appRecords.query({ recordType: "member-news" })
  return { ok: true, level, news } // never return me.contactId or staff-only fields
}
```

- `forCaller()` returns the member's contact with its tags and **all** custom fields, staff-only ones
  included. Decide with them and return only what the member may see.
- A site's `callFunction` sends the member's session with the call. Without it, the function sees an
  anonymous caller. Check that `src/site/lib/call-function.ts` adds `authorization: Bearer <token>`
  from `sl().getBearerToken()`; older sites may need it added.
- Do the same check in every function that acts for members: booking a court, entering a result,
  claiming a discount.

## 5. Joining rules

| Club | How it works |
|---|---|
| **Open** (sign up = member) | Signed in is enough; no level needed, or a `level` the site never gates on |
| **Approval** ("sign up and I'll add you") | Anyone signs up; the owner sets `level` in Studio → Customers; until then the site says "We'll confirm your membership" |
| **Tiers** (silver, gold) | `level` with an `enum`; each gated function lists the levels it allows |
| **Paid** | By hand: the owner sets `level` (and `memberUntil`) once paid. Online: a memberships app or connector writes the same fields after payment |

Record joining as an interaction (`ctx.sl.interactions.record`, e.g. `member-joined`), and a
`cloud/flows.json` flow can welcome the member and tell the team someone is waiting for approval.

## 6. The owner's side

- **Studio → Customers**: everyone who signed up, their level, and when they joined. Filter by level
  and set it on the contact.
- **Email a level**: a segment on `customFields.level`, sent from Studio (comms.md).
- **Tags** suit many-valued labels (`committee`, `coach`); a member has one `level`.

## Don't

- Keep members in app records, a table of your own, or the site's code. The contact is the member.
- Trust the browser's idea of the level. Check it in a server function.
- Let a member set a level that unlocks anything (`public: "editable"`).
- Return contact ids, other members' details, or staff-only fields to the browser.
- Build payments into a site. A memberships app or connector owns fees.

## Example: a tennis box league

- **Players** are members: own logins, `level` = `pending` or `player`, set by the organiser.
- **Fixtures, results and standings** are a custom app's records.
- Only a `player` can enter a result: the function checks `forCaller()`, then that the player is in
  that fixture.
- **Standings** are public; contact details stay hidden.
- **New player signs up**: the flow emails the organiser, who sets them to `player` in Studio.

# EU Digital Product Passports

SmartLinks hosts a brand's **EU Digital Product Passports** (ESPR) and registers them in the **EU registry** for
the brand. Each passport has its own permanent address, which is the identifier the EU registers. The public view
there is open to anyone; the restricted views (dismantling details, test reports, battery state of health) are served
only to the EU registry, for that brand.

Batteries come first (mandatory from 18 February 2027). Fields are named as in the Commission's own schemas
(`batteryChemistry`, `manufacturerIdentification`, …): `dpp.groups()` lists them, with what's required.

## Connecting a brand to the EU registry

The EU only lets an organisation register its own passports, so the **brand enrols itself**: an EU Login, and a
declaration sealed with the brand's own **qualified e-seal** (from a provider on the EU trusted list). That happens
on the EU's site. Nobody sends SmartLinks a seal, certificate or private key.

Then, once per environment (`acc` = the EU test registry, `prod` = the live one):

```ts
import { dpp } from "@proveanything/smartlinks"

// 1. SmartLinks makes the key; the brand adds the PUBLIC key to a Service Account ("Register DPPs" role).
const reg = await dpp.registry.makeKey(collectionId, "acc")
showToAdmin(reg.publicPem)            // also reg.publicJwk; reg.portal is the registry's address

// 2. The brand pastes back three values from the registry.
await dpp.registry.set(collectionId, "acc", {
  clientId: "…",                      // the Service Account's Client ID
  kid: "…",                           // the key ID the registry gave our key
  orgIdentifier: "…",                 // Organisation > Verification > Organisation ID, copied exactly
})

// 3. Check: signs in and reads the registry's product groups.
const { registry } = await dpp.registry.check(collectionId, "acc")
registry.lastCheck                    // { ok: true, … } or { ok: false, message: "…plain words…" }
```

`dpp.registry.list(collectionId)` gives both environments, each with `nextStep`
(`make-key` → `enter-service-account` → `enter-organisation-id` → `check` → `null` when connected). Show them as
numbered steps.

## Practising first: the SmartLinks practice registry

Until a brand is verified with the EU, connect it to the **SmartLinks practice registry** instead. It works like
the EU registry (it signs in as the brand, reads each passport at its address, checks the public and restricted
views and the required fields, and answers with registration ids), but **nothing reaches the EU**. Label it as
practice wherever it's shown (`registry.practice` is `true`).

```ts
const { registry } = await dpp.registry.enrolPractice(collectionId)   // key + enrolment + Service Account + check
await dpp.register(collectionId, "practice", passportIds, { wait: true })
// passport.registration.practice → { status: "registered", registryId: "uri_practice_…" }
```

Moving to the EU later is the normal set-up for `acc` (then `prod`): the passports stay the same.

## Publishing passports

Say what a passport is for (a product, a batch or one item) and its granularity. SmartLinks updates that passport
or makes it:

```ts
const { passport, created, changed } = await dpp.passports.upsert(collectionId, {
  productId,                          // and/or batchId, proofId (one battery = a proof)
  productGroup: "BATTERIES",
  productSubGroup: "EV",              // EV, LMT or IND
  granularity: "item",                // item | batch | model
  modelIdentifier: "IC-75-LFP",
  public: { batteryChemistry: ["https://repository.product-passport.ec.europa.eu/product/batteries/vocabs/battery-chemistry#lithiumIonLFP"], /* … */ },
  restricted: { dismantlingInformation: [/* … */], batteryStatus: "…" },
})

passport.url                          // its address — what goes on the QR code and to the registry
passport.check                        // { ready, missing: { pub: [...], res1: [...], res2: [...], res3: [...] } }
passport.version                      // goes up by one each time what it says changes
```

- **Publishing replaces**: the fields you send are the whole passport (`{ merge: true }` merges instead).
  Publishing the same content again changes nothing (`changed: false`).
- **Many at once** (one per battery): `dpp.passports.upsertMany(collectionId, items)` — up to 500, each answering
  on its own.
- **Versions**: `dpp.passports.versions(collectionId, id)`; read an earlier one with
  `dpp.read(collectionId, id, { version: 2 })` (also `?version=2` on its address).
- **Withdraw / restore**: a withdrawn passport stays at its address, marked invalid.
- Never put restricted fields in `public`: anyone can read the public view.

`dpp.read(collectionId, passportId)` returns the public document exactly as served — use it for a public page,
so restricted data never reaches the browser.

## Registering

```ts
const { tasks, skipped } = await dpp.register(collectionId, "acc", passportIds, { wait: true })
// skipped: not found, withdrawn, already registered, or missing required fields (with the list)
// tasks[i].passports: each one's outcome — registered (with registryId) | rejected (problems) | not-sent
```

The registry reads each passport at its address while validating it, and one bad passport rejects the whole
request — so passports still missing required fields are never sent. Without `wait`, follow up with
`dpp.tasks.refresh(collectionId, "acc", taskId)`; `dpp.tasks.list(collectionId, "acc")` lists past requests. Each
passport's `registration.acc` / `registration.prod` holds its status.

## Reference

| Call | Does |
|---|---|
| `dpp.groups(collectionId)` | product groups, kinds, every field and the required ones per view |
| `dpp.read(collectionId, id, { version? })` | the public document at its address (no sign-in) |
| `dpp.registry.list / get / makeKey / set / check` | the brand's registry connection |
| `dpp.registry.enrolPractice(collectionId)` | connect to the SmartLinks practice registry in one step (never the EU) |
| `dpp.passports.list / get / create / update / upsert / upsertMany / versions / withdraw / restore` | passports |
| `dpp.register(collectionId, env, ids, { wait? })` | send to the registry |
| `dpp.tasks.list / refresh` | registry requests and their outcomes |

Admin calls need a collection admin. Platform design: prove `server/docs/design/eu-dpp.md`.

// src/types/integrations.ts
//
// Integration flows + the sealed-secret store that backs their credentials.
//
// A flow is one input/output pipeline: an inbound flow fetches from an external
// system and writes a SmartLinks entity; an outbound flow reads a SmartLinks entity,
// transforms it, and sends it out. Credentials are never stored on the flow — the
// connection carries a `credentialRef` into the secret store, resolved server-side
// only, at execution.
export {};

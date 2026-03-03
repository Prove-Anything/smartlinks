/**
 * Attestations API Types — Postgres-backed (v2)
 *
 * These types support the new append-only, tamper-evident attestation system
 * which is polymorphic over subject types (container, proof, product, tag, etc.),
 * exposes three data-visibility zones, and maintains a SHA-256 hash chain for
 * cryptographic integrity verification.
 *
 * @see docs/attestations.md
 */
export {};

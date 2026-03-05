/**
 * Tag Management Types
 *
 * Types for the two-tier tag system:
 *  - Per-org shard (`tags` table) — full tag data, all collection-scoped queries
 *  - Shared shard (`tag_index` table) — tagId → collectionId routing only
 */
export {};

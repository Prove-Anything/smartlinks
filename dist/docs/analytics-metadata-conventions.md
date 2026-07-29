# Analytics Metadata Conventions

Use these as the recommended standard analytics keys.

Some of these are now promoted top-level analytics fields. Others remain good metadata keys for custom dimensions.

---

## Recommended Keys

### Promoted top-level fields

- `visitorId`
- `referrerHost`
- `entryType`
- `pageId`
- `scanMethod`
- `source` - collection/web-events only. Free-form client app identifier, e.g. `'portal'`, `'hub'`. No enum/whitelist. Not available on tag events - see the `analytics.tag.track(event)` section in [docs/analytics.md](analytics.md) for why.
- `redirectMode` - tag-events only. Usually server-written; only set this yourself if you're logging a redirect-style event.

These should be sent as top-level analytics fields, not inside `metadata`.

### Metadata-friendly keys

- `referrer`
- `utmSource`
- `utmMedium`
- `utmCampaign`
- `utmContent`
- `utmTerm`
- `group`
- `tag`
- `campaign`
- `placement`
- `linkGroup`
- `linkPlacement`
- `linkPosition`
- `linkTitle`
- `destinationDomain`
- `pagePath`
- `qrCodeId`

---

## Why These Matter

These keys give teams a shared vocabulary for:

- inbound traffic attribution
- outbound link analysis
- link placement and link-tree performance
- QR and page-level traffic grouping
- physical scan source analysis

---

## Recommendation

- Treat these as reserved standard keys.
- Prefer these names before inventing custom alternatives.
- Send promoted fields at top level.
- Keep values flat and scalar where possible so they are easier to filter and break down later.
- Promote a field to a first-class backend column only when it becomes a hot platform-wide dimension.
- Note: `source` (the event column) and the query-time `source` parameter (`'events' | 'tag'`, which table to query) are unrelated fields that happen to share a name. When filtering by the `source` column, use the plural `sources` array - there is no singular `source` filter, precisely to avoid colliding with the table selector.

---

## Example

```typescript
analytics.collection.track({
  sessionId: 1234567890,
  eventType: 'click_link',
  collectionId: 'demo-collection',
  visitorId: 'visitor_123',
  linkId: 'hero-cta',
  href: 'https://example.com/buy',
  referrerHost: 'instagram.com',
  placement: 'hero',
  campaign: 'summer-launch',
  utmSource: 'email',
  pageId: 'QR123',
  source: 'portal',
  metadata: {
    pagePath: '/c/demo-collection',
  },
})
```
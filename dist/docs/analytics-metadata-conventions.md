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
  metadata: {
    pagePath: '/c/demo-collection',
  },
})
```
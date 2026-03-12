# Analytics Metadata Conventions

Use these as the recommended standard keys for analytics event metadata.

You can put them in `metadata` directly today. The public analytics ingestion endpoints also accept these as top-level convenience fields and mirror them into `metadata` on the backend.

---

## Recommended Keys

### Traffic and attribution

- `referrer`
- `referrerHost`
- `utmSource`
- `utmMedium`
- `utmCampaign`
- `utmContent`
- `utmTerm`
- `entryType` — for example `direct`, `qr`, `nfc`, `social`, `email`, `paid`, or `organic`

### Link-tree and page analytics

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
- `pageId`
- `qrCodeId`

### Physical scan analytics

- `scanMethod` — for example `nfc` or `qr`

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
- Keep values flat and scalar where possible so they are easier to filter and break down later.
- Promote a field to a first-class backend column only when it becomes a hot platform-wide dimension.

---

## Example

```typescript
analytics.collection.track({
  sessionId: 'sess_123',
  eventType: 'click_link',
  collectionId: 'demo-collection',
  linkId: 'hero-cta',
  href: 'https://example.com/buy',
  placement: 'hero',
  campaign: 'summer-launch',
  utmSource: 'email',
  metadata: {
    pagePath: '/c/demo-collection',
  },
})
```
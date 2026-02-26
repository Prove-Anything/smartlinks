# App Objects: Cases, Threads, and Records

This guide covers the three generic app-scoped object types that apps can use as flexible building blocks for different use cases: **Cases**, **Threads**, and **Records**.

---

## Overview

SmartLinks provides three generic data models scoped to your app that can be adapted for countless scenarios. Think of them as configurable primitives that you shape to fit your needs:

- **Cases** — Track issues, requests, or tasks that need resolution
- **Threads** — Manage discussions, comments, or any reply-based content
- **Records** — Store structured data with flexible lifecycles

Each object type supports:
- **JSONB zones** (`data`, `owner`, `admin`) for granular access control
- **Visibility levels** (`public`, `owner`, `admin`) for content exposure
- **Flexible schemas** — store any JSON in the zone fields
- **Admin and public endpoints** for different caller contexts
- **Rich querying** with filters, sorting, pagination, and aggregations

```text
┌─────────────────────────────────────────────────────────────────┐
│ Your SmartLinks App                                             │
│                                                                 │
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────┐           │
│  │   Cases     │   │   Threads   │   │   Records   │           │
│  │             │   │             │   │             │           │
│  │ • Support   │   │ • Comments  │   │ • Bookings  │           │
│  │ • Warranty  │   │ • Q&A       │   │ • Licenses  │           │
│  │ • Feedback  │   │ • Reviews   │   │ • Visits    │           │
│  │ • RMA       │   │ • Forum     │   │ • Events    │           │
│  └─────────────┘   └─────────────┘   └─────────────┘           │
│                                                                 │
│  All scoped to: /collection/:cId/app/:appId                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## The JSONB Zone Model

All three object types use a three-tier access model with JSONB fields:

| Zone    | Visible to        | Writable by       | Use Case                          |
|---------|-------------------|-------------------|-----------------------------------|
| `data`  | public, owner, admin | public, owner, admin | Shared public information      |
| `owner` | owner, admin      | owner, admin      | User-specific private data        |
| `admin` | admin             | admin             | Internal notes, sensitive data    |

### How Zones Work

Zones are **automatically filtered** based on the caller's role:

```typescript
// Public endpoint caller sees:
{
  id: 'case_123',
  status: 'open',
  data: { issue: 'Screen cracked', photos: [...] },
  // owner and admin zones stripped
}

// Owner (authenticated contact) sees:
{
  id: 'case_123',
  status: 'open',
  data: { issue: 'Screen cracked', photos: [...] },
  owner: { shippingAddress: '...', preference: 'email' },
  // admin zone stripped
}

// Admin sees everything:
{
  id: 'case_123',
  status: 'open',
  data: { issue: 'Screen cracked', photos: [...] },
  owner: { shippingAddress: '...', preference: 'email' },
  admin: { internalNotes: 'Escalate to tier 2', cost: 45.00 }
}
```

**Key insight:** The server strips zones before returning objects. You don't need to worry about accidentally leaking `admin` data — it's never sent to non-admin callers.

### Zone Writing Rules

- **Non-admin callers** attempting to write to the `admin` zone are silently ignored
- **Public callers** can write to `data` and `owner` (if visibility allows)
- **Admins** can write to all three zones

---

## Visibility Levels

Each object has a `visibility` field that controls who can access it on **public endpoints**:

| Visibility | Public Endpoint Behavior                          |
|------------|--------------------------------------------------|
| `public`   | Anyone can read (even anonymous)                 |
| `owner`    | Only the owning contact can read                 |
| `admin`    | Never visible on public endpoints (404)          |

**Admin endpoints** always return all objects regardless of visibility.

### Typical Patterns

```typescript
// Public discussion thread
await app.threads.create(collectionId, appId, {
  visibility: 'public',
  title: 'How do I clean this product?',
  body: { text: 'Looking for cleaning instructions...' }
});

// Private support case
await app.cases.create(collectionId, appId, {
  visibility: 'owner',  // Only this contact can see it
  category: 'warranty',
  data: { issue: 'Defective unit' },
  owner: { serialNumber: 'ABC123' }
});

// Admin-only internal record
await app.records.create(collectionId, appId, {
  visibility: 'admin',  // Never appears on public endpoints
  recordType: 'audit_log',
  admin: { action: 'manual_refund', amount: 50.00 }
}, true); // admin = true
```

---

## Paginated List Responses

Every `.list()` call returns a **`PaginatedResponse<T>`** object. The items are in the `data` array and all page-level metadata lives in a nested `pagination` object:

```json
{
  "data": [
    {
      "id": "7ac44316-c227-4c39-bf99-a287bc08c6f5",
      "collectionId": "veho-demo",
      "appId": "knowledgeBase",
      "visibility": "public",
      "recordType": "article",
      "status": "published",
      "createdAt": "2026-02-25T22:13:14.310Z",
      "updatedAt": "2026-02-25T22:47:36.712Z",
      "data": {
        "title": "Getting Started",
        "slug": "getting-started",
        "body": "..."
      }
    }
  ],
  "pagination": {
    "total": 42,
    "limit": 10,
    "offset": 0,
    "hasMore": true
  }
}
```

### Pagination fields

| Field | Type | Description |
|---|---|---|
| `data` | `T[]` | The page of items returned |
| `pagination.total` | `number` | Total number of matching records across **all** pages |
| `pagination.limit` | `number` | The `limit` that was applied to this request (default `50`, max `500`) |
| `pagination.offset` | `number` | The `offset` that was applied to this request |
| `pagination.hasMore` | `boolean` | `true` when more pages exist — use this instead of computing `offset + limit < total` yourself |

> **Note:** The items are always in `response.data`, **not** at the top level. A common mistake is reading `response.total` — the correct path is `response.pagination.total`.

### Fetching all pages

```typescript
import { app, PaginatedResponse, AppRecord } from '@proveanything/smartlinks';

async function fetchAllRecords(collectionId: string, appId: string) {
  const results: AppRecord[] = [];
  let offset = 0;
  const limit = 100;

  while (true) {
    const page: PaginatedResponse<AppRecord> = await app.records.list(
      collectionId,
      appId,
      { limit, offset, sort: 'createdAt:desc' }
    );

    results.push(...page.data);

    if (!page.pagination.hasMore) break;  // no more pages
    offset += limit;
  }

  console.log(`Fetched ${results.length} of ${/* saved from first page */ 0} total`);
  return results;
}
```

### Reading the count and checking for more

```typescript
const page = await app.cases.list(collectionId, appId, { status: 'open', limit: 10 });

console.log(page.data);                   // array of AppCase objects
console.log(page.pagination.total);       // e.g. 142  — total open cases
console.log(page.pagination.hasMore);     // true / false
console.log(page.pagination.offset);      // current page start
console.log(page.pagination.limit);       // items per page
```

---

## Cases

**Cases** represent trackable issues, requests, or tasks that move through states and require resolution.

### When to Use Cases

- **Customer support tickets** — track issues from creation to resolution
- **Warranty claims** — manage claims with status, priority, and assignment
- **Feature requests** — collect and triage user feedback
- **RMA (Return Merchandise Authorization)** — handle product returns
- **Bug reports** — track defects from user submissions
- **Service requests** — manage appointments, repairs, installations

### Key Features

- **Status lifecycle** — `'open'` → `'in-progress'` → `'resolved'` → `'closed'` (or custom statuses)
- **Priority levels** — numerical priority for sorting/escalation
- **Categories** — group cases by type (warranty, bug, feature, etc.)
- **Assignment** — `assignedTo` field for routing to team members
- **History tracking** — append timestamped entries to `admin.history` or `owner.history`
- **Closing metrics** — track `closedAt` to measure resolution time

### Example: Warranty Claims

```typescript
import { app } from '@proveanything/smartlinks';

// Customer submits a warranty claim (public endpoint)
const claim = await app.cases.create(collectionId, appId, {
  visibility: 'owner',
  category: 'warranty',
  status: 'open',
  priority: 2,
  productId: product.id,
  proofId: proof.id,
  contactId: user.contactId,
  data: {
    issue: 'Screen flickering after 3 months',
    photos: ['https://...', 'https://...']
  },
  owner: {
    purchaseDate: '2025-11-15',
    serialNumber: 'SN-7738291',
    preferredContact: 'email'
  }
});

// Admin reviews and assigns (admin endpoint)
await app.cases.update(collectionId, appId, claim.id, {
  assignedTo: 'user_jane_support',
  priority: 3, // escalate
  admin: {
    internalNotes: 'Likely hardware defect, approve replacement'
  }
}, true); // admin = true

// Admin appends to history
await app.cases.appendHistory(collectionId, appId, claim.id, {
  entry: {
    action: 'approved_replacement',
    agent: 'Jane',
    tracking: 'UPS-123456789'
  },
  historyTarget: 'owner', // visible to customer
  status: 'resolved'
});

// Get case summary stats (admin)
const summary = await app.cases.summary(collectionId, appId, {
  period: { from: '2026-01-01', to: '2026-02-28' }
});
// Returns: { total: 142, byStatus: { open: 12, resolved: 130 }, ... }
```

### Use Case: Support Dashboard

Build a live support dashboard showing open cases by priority:

```typescript
const openCases = await app.cases.list(collectionId, appId, {
  status: 'open',
  sort: 'priority:desc',
  limit: 50
}, true);

// Aggregate by category
const stats = await app.cases.aggregate(collectionId, appId, {
  filters: { status: 'open' },
  groupBy: ['category', 'priority'],
  metrics: ['count']
}, true);

// Time series: cases created per week
const trend = await app.cases.aggregate(collectionId, appId, {
  timeSeriesField: 'created_at',
  timeSeriesInterval: 'week',
  metrics: ['count']
}, true);
```

---

## Threads

**Threads** represent discussions, comments, or any content that accumulates replies over time.

### When to Use Threads

- **Product Q&A** — questions and answers about products
- **Community forums** — discussions grouped by topic
- **Comments** — on products, proofs, or other resources
- **Review discussions** — follow-up questions on reviews
- **Feedback threads** — ongoing conversations about features
- **Support chat** — lightweight message threads

### Key Features

- **Reply tracking** — `replies` array with timestamped entries
- **Reply count** — auto-incremented `replyCount` and `lastReplyAt`
- **Slugs** — optional URL-friendly slug for pretty URLs
- **Tags** — JSONB array of tags for categorization
- **Parent linking** — `parentType` + `parentId` to attach to products, proofs, etc.
- **Author metadata** — track `authorId` and `authorType`

### Example: Product Q&A

```typescript
import { app } from '@proveanything/smartlinks';

// Customer asks a question (public endpoint)
const question = await app.threads.create(collectionId, appId, {
  visibility: 'public',
  slug: 'how-to-clean-leather',
  title: 'How do I clean leather without damaging it?',
  status: 'open',
  authorId: user.contactId,
  authorType: 'customer',
  productId: product.id,
  body: {
    text: 'I spilled coffee on my leather bag. What cleaner is safe to use?'
  },
  tags: ['cleaning', 'leather', 'care']
});

// Another customer replies
await app.threads.reply(collectionId, appId, question.id, {
  authorId: otherUser.contactId,
  authorType: 'customer',
  text: 'I use a mild soap and water solution. Works great!'
});

// Admin (brand expert) replies
await app.threads.reply(collectionId, appId, question.id, {
  authorId: 'user_expert_sarah',
  authorType: 'brand_expert',
  text: 'Our official leather care kit is perfect for this. Avoid harsh chemicals.',
  productLink: 'prod_leather_care_kit'
}, true); // admin endpoint

// Admin marks as resolved
await app.threads.update(collectionId, appId, question.id, {
  status: 'resolved'
}, true);
```

### Use Case: Forum-Style Discussions

List recent discussions with reply counts:

```typescript
// Get active threads
const activeThreads = await app.threads.list(collectionId, appId, {
  status: 'open',
  sort: 'lastReplyAt:desc',
  limit: 20
});

// Filter by tag
const cleaningThreads = await app.threads.list(collectionId, appId, {
  tag: 'cleaning'
});

// Aggregate: most active discussion topics
const topicStats = await app.threads.aggregate(collectionId, appId, {
  groupBy: ['status'],
  metrics: ['count', 'reply_count']
});
```

### Use Case: Product Comments

Attach comments to a specific product:

```typescript
// Create a comment thread for a product
await app.threads.create(collectionId, appId, {
  visibility: 'public',
  parentType: 'product',
  parentId: product.id,
  authorId: user.contactId,
  body: { text: 'Love this product! Best purchase ever.' },
  tags: ['positive']
});

// List all comments for a product
const productComments = await app.threads.list(collectionId, appId, {
  parentType: 'product',
  parentId: product.id,
  sort: 'createdAt:desc'
});
```

---

## Records

**Records** are the most flexible object type — use them for structured data with time-based lifecycles, hierarchies, or custom schemas.

### When to Use Records

- **Bookings/Reservations** — track appointments with start/end times
- **Licenses** — manage software licenses with expiration
- **Subscriptions** — track subscription status and renewal
- **Certifications** — store certifications with expiry dates
- **Events** — track event registrations and attendance
- **Usage logs** — record product usage metrics
- **Audit trails** — immutable logs of actions
- **Loyalty points** — track points earned/redeemed

### Key Features

- **Record types** — `recordType` field for categorization (required)
- **Time windows** — `startsAt` and `expiresAt` for time-based data
- **Parent linking** — attach to products, proofs, contacts, etc.
- **Author tracking** — `authorId` + `authorType`
- **Status lifecycle** — custom statuses (default `'active'`)
- **References** — optional `ref` field for external IDs

### Example: Product Registration

```typescript
import { app } from '@proveanything/smartlinks';

// Customer registers a product
const registration = await app.records.create(collectionId, appId, {
  recordType: 'product_registration',
  visibility: 'owner',
  status: 'active',
  productId: product.id,
  proofId: proof.id,
  contactId: user.contactId,
  authorId: user.contactId,
  authorType: 'customer',
  startsAt: new Date().toISOString(),
  expiresAt: new Date(Date.now() + 365*24*60*60*1000).toISOString(), // 1 year warranty
  data: {
    registrationNumber: 'REG-2026-1234',
    purchaseDate: '2026-02-15',
    retailer: 'Best Electronics'
  },
  owner: {
    serialNumber: 'SN-9922736',
    installDate: '2026-02-20',
    location: 'Home office'
  }
});

// List active registrations for a customer
const activeRegistrations = await app.records.list(collectionId, appId, {
  contactId: user.contactId,
  recordType: 'product_registration',
  status: 'active'
});

// Find expiring registrations (admin)
const expiringSoon = await app.records.list(collectionId, appId, {
  recordType: 'product_registration',
  expiresAt: `lte:${new Date(Date.now() + 30*24*60*60*1000).toISOString()}` // next 30 days
}, true);
```

### Example: Appointment Booking

```typescript
// Customer books a service appointment
const booking = await app.records.create(collectionId, appId, {
  recordType: 'service_appointment',
  visibility: 'owner',
  contactId: user.contactId,
  startsAt: '2026-03-15T10:00:00Z',
  expiresAt: '2026-03-15T11:00:00Z', // 1-hour appointment
  data: {
    serviceType: 'installation',
    location: 'Customer site',
    technician: null // assigned later
  },
  owner: {
    address: '123 Main St',
    phone: '555-1234',
    notes: 'Call before arrival'
  }
});

// Admin assigns technician
await app.records.update(collectionId, appId, booking.id, {
  data: {
    serviceType: 'installation',
    location: 'Customer site',
    technician: 'tech_john'
  },
  admin: {
    cost: 150.00,
    travelTime: 30
  }
}, true);

// List today's appointments
const today = new Date().toISOString().split('T')[0];
const todaysAppointments = await app.records.list(collectionId, appId, {
  recordType: 'service_appointment',
  startsAt: `gte:${today}T00:00:00Z`,
  sort: 'startsAt:asc'
}, true);
```

### Example: Usage Tracking

```typescript
// Log product usage (could be triggered by IoT device)
await app.records.create(collectionId, appId, {
  recordType: 'usage_log',
  visibility: 'admin',
  productId: product.id,
  proofId: proof.id,
  startsAt: new Date().toISOString(),
  data: {
    metric: 'power_on',
    duration: 3600, // seconds
    location: 'geo:37.7749,-122.4194'
  }
}, true);

// Aggregate usage metrics
const usageStats = await app.records.aggregate(collectionId, appId, {
  filters: {
    record_type: 'usage_log',
    created_at: {
      gte: '2026-02-01',
      lte: '2026-02-28'
    }
  },
  groupBy: ['product_id'],
  metrics: ['count']
}, true);
```

---

## Public Create Policies

Control who can create objects on **public endpoints** using Firestore-based policies at:  
`sites/{collectionId}/apps/{appId}.publicCreate`

### Policy Structure

```typescript
interface PublicCreatePolicy {
  cases?: {
    allow: {
      anonymous?: boolean      // allow unauthenticated users
      authenticated?: boolean  // allow authenticated contacts
    }
    enforce?: {
      anonymous?: Partial<CreateCaseInput>     // force these values for anon
      authenticated?: Partial<CreateCaseInput> // force these values for auth
    }
  }
  threads?: { /* same structure */ }
  records?: { /* same structure */ }
}
```

### Example Policies

**Support tickets from anyone:**

```json
{
  "cases": {
    "allow": {
      "anonymous": true,
      "authenticated": true
    },
    "enforce": {
      "anonymous": {
        "visibility": "owner",
        "status": "open",
        "category": "support"
      },
      "authenticated": {
        "visibility": "owner",
        "status": "open"
      }
    }
  }
}
```

**Public Q&A threads, authenticated only:**

```json
{
  "threads": {
    "allow": {
      "anonymous": false,
      "authenticated": true
    },
    "enforce": {
      "authenticated": {
        "visibility": "public",
        "status": "open"
      }
    }
  }
}
```

**No public record creation:**

```json
{
  "records": {
    "allow": {
      "anonymous": false,
      "authenticated": false
    }
  }
}
```

The `enforce` values are **merged over** the caller's request body, so you can lock down fields like `visibility`, `status`, or `category` regardless of what clients send.

---

## Aggregations and Analytics

All three object types support powerful aggregation queries for dashboards and reports.

### Aggregation Capabilities

```typescript
interface AggregateRequest {
  filters?: {
    status?: string
    category?: string          // cases only
    record_type?: string       // records only
    product_id?: string
    created_at?: { gte?: string; lte?: string }
    closed_at?: '__notnull__' | { gte?: string; lte?: string }  // cases
    expires_at?: { lte?: string }  // records
  }
  groupBy?: string[]    // dimension breakdown
  metrics?: string[]    // calculated values
  timeSeriesField?: string
  timeSeriesInterval?: 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year'
}
```

### Cases Aggregations

**Group by dimensions:**  
`status`, `priority`, `category`, `assigned_to`, `product_id`, `contact_id`

**Metrics:**  
`count`, `avg_close_time`, `p50_close_time`, `p95_close_time`

```typescript
// Average resolution time by category
const metrics = await app.cases.aggregate(collectionId, appId, {
  filters: {
    closed_at: '__notnull__'
  },
  groupBy: ['category'],
  metrics: ['count', 'avg_close_time', 'p95_close_time']
}, true);

// Result:
// {
//   groups: [
//     { category: 'warranty', count: 45, avg_close_time_seconds: 7200, p95_close_time_seconds: 14400 },
//     { category: 'support', count: 89, avg_close_time_seconds: 3600, p95_close_time_seconds: 10800 }
//   ]
// }
```

### Threads Aggregations

**Group by dimensions:**  
`status`, `author_type`, `product_id`, `visibility`, `contact_id`

**Metrics:**  
`count`, `reply_count`

```typescript
// Most active discussion authors
const authorStats = await app.threads.aggregate(collectionId, appId, {
  groupBy: ['author_type'],
  metrics: ['count', 'reply_count']
});
```

### Records Aggregations

**Group by dimensions:**  
`status`, `record_type`, `product_id`, `author_type`, `visibility`, `contact_id`

**Metrics:**  
`count`

```typescript
// Bookings by status
const bookingStats = await app.records.aggregate(collectionId, appId, {
  filters: {
    record_type: 'service_appointment'
  },
  groupBy: ['status'],
  metrics: ['count']
}, true);
```

### Time Series

Generate time-based charts:

```typescript
// Cases created per week
const casesTrend = await app.cases.aggregate(collectionId, appId, {
  timeSeriesField: 'created_at',
  timeSeriesInterval: 'week',
  metrics: ['count']
}, true);

// Result:
// {
//   timeSeries: [
//     { bucket: '2026-W07', count: 23 },
//     { bucket: '2026-W08', count: 31 },
//     { bucket: '2026-W09', count: 28 }
//   ]
// }
```

---

## Common Patterns

### Pattern: Related Data

Cases have a built-in `related()` endpoint to fetch associated threads and records:

```typescript
// Get all related content for a case
const related = await app.cases.related(collectionId, appId, caseId);
// Returns: { threads: [...], records: [...] }
```

For threads and records, use parent linking:

```typescript
// Create a thread about a case
await app.threads.create(collectionId, appId, {
  parentType: 'case',
  parentId: caseId,
  body: { text: 'Follow-up discussion about this case' }
});

// List all threads for a case
const caseThreads = await app.threads.list(collectionId, appId, {
  parentType: 'case',
  parentId: caseId
});
```

### Pattern: Hierarchical Records

Use `parentType` and `parentId` to build hierarchies:

```typescript
// Parent record: subscription
const subscription = await app.records.create(collectionId, appId, {
  recordType: 'subscription',
  data: { plan: 'premium', billingCycle: 'monthly' }
});

// Child records: invoices
await app.records.create(collectionId, appId, {
  recordType: 'invoice',
  parentType: 'subscription',
  parentId: subscription.id,
  data: { amount: 29.99, period: '2026-02' }
});

// List all invoices for a subscription
const invoices = await app.records.list(collectionId, appId, {
  recordType: 'invoice',
  parentType: 'subscription',
  parentId: subscription.id
});
```

### Pattern: Audit Trails

Use admin-only records to log changes:

```typescript
async function auditLog(action: string, details: any) {
  await app.records.create(collectionId, appId, {
    recordType: 'audit_log',
    visibility: 'admin',
    authorId: currentUser.id,
    authorType: 'admin',
    data: {
      action,
      timestamp: new Date().toISOString(),
      ...details
    }
  }, true);
}

// Usage
await auditLog('case_reassigned', {
  caseId: 'case_123',
  from: 'user_jane',
  to: 'user_bob'
});
```

### Pattern: Notifications

Combine with the realtime API to notify users of changes:

```typescript
import { app, realtime } from '@proveanything/smartlinks';

// When a case is updated
await app.cases.update(collectionId, appId, caseId, { status: 'resolved' }, true);

// Notify the contact
await realtime.publish(collectionId, `contact:${contactId}`, {
  type: 'case_resolved',
  caseId,
  message: 'Your support case has been resolved'
});
```

---

## Best Practices

### Use the Right Object Type

| Need | Use |
|------|-----|
| Track something that needs resolution | **Cases** |
| Build a discussion or comment system | **Threads** |
| Store time-sensitive or hierarchical data | **Records** |

### Zone Allocation Strategy

- **`data`** — Put information that's safe for anyone to see (even if `visibility` is `owner`)
- **`owner`** — Store user-specific preferences, addresses, contact info
- **`admin`** — Keep internal notes, costs, sensitive metadata

### Visibility Defaults

- **User-facing content** → `visibility: 'public'` (Q&A, reviews, forums)
- **Private user data** → `visibility: 'owner'` (support cases, bookings)
- **Internal data** → `visibility: 'admin'` (audit logs, analytics)

### Indexing and Performance

For high-volume queries, consider:
- Filter by `status`, `recordType`, or `category` to reduce result sets
- Use `limit` and `offset` for pagination (max 500 per page)
- Use aggregations instead of fetching all records and counting client-side
- Index commonly filtered fields in Firestore if you add custom indexes

### Status Conventions

While statuses are free-form strings, consider standard conventions:

**Cases:** `open`, `in_progress`, `waiting_customer`, `resolved`, `closed`  
**Threads:** `open`, `closed`, `locked`, `archived`  
**Records:** `active`, `inactive`, `expired`, `cancelled`

---

## Example: Complete Support System

Here's a full workflow combining all three object types:

```typescript
import { app } from '@proveanything/smartlinks';

// 1. Customer submits a warranty claim (case)
const claim = await app.cases.create(collectionId, appId, {
  visibility: 'owner',
  category: 'warranty',
  status: 'open',
  priority: 2,
  productId,
  proofId,
  contactId,
  data: { issue: 'Defective battery' },
  owner: { serialNumber: 'SN-123' }
});

// 2. Customer starts a discussion about the claim (thread)
const discussion = await app.threads.create(collectionId, appId, {
  visibility: 'owner',
  parentType: 'case',
  parentId: claim.id,
  title: 'Questions about my warranty claim',
  body: { text: 'How long will the replacement take?' }
});

// 3. Admin replies to the discussion
await app.threads.reply(collectionId, appId, discussion.id, {
  authorId: 'admin_sarah',
  authorType: 'support_agent',
  text: 'We'll ship a replacement within 2 business days'
}, true);

// 4. Admin approves and creates a shipping record
const shipment = await app.records.create(collectionId, appId, {
  recordType: 'shipment',
  parentType: 'case',
  parentId: claim.id,
  data: {
    carrier: 'UPS',
    tracking: 'UPS-123456789',
    estimatedDelivery: '2026-02-28'
  },
  owner: {
    shippingAddress: '123 Main St'
  },
  admin: {
    cost: 25.00,
    warehouse: 'CA-01'
  }
}, true);

// 5. Admin updates case with history
await app.cases.appendHistory(collectionId, appId, claim.id, {
  entry: {
    action: 'replacement_shipped',
    tracking: 'UPS-123456789'
  },
  historyTarget: 'owner',
  status: 'in_progress'
});

// 6. Customer receives item, admin closes case
await app.cases.update(collectionId, appId, claim.id, {
  status: 'resolved',
  admin: { resolvedBy: 'admin_sarah', satisfactionScore: 5 }
}, true);

// 7. Generate analytics
const monthlyReport = await app.cases.summary(collectionId, appId, {
  period: { from: '2026-02-01', to: '2026-02-28' }
});
```

---

## TypeScript Usage

Import types and functions:

```typescript
import {
  app,
  AppCase, AppThread, AppRecord,
  CreateCaseInput, CreateThreadInput, CreateRecordInput,
  PaginatedResponse, AggregateResponse
} from '@proveanything/smartlinks';

// Fully typed
const newCase: AppCase = await app.cases.create(collectionId, appId, {
  category: 'support',
  data: { issue: 'Login problem' }
});

const threadList: PaginatedResponse<AppThread> = await app.threads.list(
  collectionId,
  appId,
  { limit: 50, sort: 'createdAt:desc' }
);
```

---

## API Reference

For complete endpoint documentation, query parameters, and response schemas, see:

- [API_SUMMARY.md](./API_SUMMARY.md) — Full REST API reference
- [TypeScript source](../src/types/appObjects.ts) — Type definitions
- [API wrappers](../src/api/appObjects.ts) — Implementation

---

## Questions?

These three object types are incredibly flexible building blocks. If you're unsure which to use for your use case, ask yourself:

- Does it need tracking to closure? → **Case**
- Is it a conversation or discussion? → **Thread**
- Is it data with a lifecycle or hierarchy? → **Record**

When in doubt, start with **Records** — they're the most generic and can be shaped to fit almost anything.

# Proof Claiming Methods

SmartLinks supports multiple methods for claiming/registering product ownership. Each method serves different use cases and product types.

---

## Overview of Claiming Methods

| Method | Use Case | Requires Physical ID? | SDK Function |
|--------|----------|---------------------|--------------|
| **Tag-Based (NFC/QR)** | Physical products with tags | ✅ Yes | `proof.claim(collectionId, productId, proofId, data)` |
| **Serial Number** | Products with printed codes | ✅ Yes | `proof.claim(collectionId, productId, proofId, data)` |
| **Claimable/Virtual Proof** | Pre-allocated proofs (tickets, licenses) | ✅ Yes* | `proof.claim(collectionId, productId, proofId, data)` |
| **Auto-Generated** | Generic product registration | ❌ No | `proof.claimProduct(collectionId, productId, data)` |

*Proof ID provided via email/link rather than physical product

---

## Method 1-3: Claim with Proof ID

**Use when:** You have a proof ID from an NFC tag, QR code, serial number, or pre-allocated proof.

### API

```typescript
import { proof } from '@proveanything/smartlinks';

const claimed = await proof.claim(
  collectionId,   // e.g., 'wine-collection'
  productId,      // e.g., 'bordeaux-2020'
  proofId,        // e.g., 'abc123-XY7Z' or 'a7Bx3'
  {
    // Optional: additional data
    purchaseDate: '2026-02-17',
    notes: 'First bottle from this vintage'
  }
);

console.log('Claimed proof:', claimed.id);
console.log('Owner:', claimed.userId);
```

### Examples by ID Type

**NFC Tag ID:**
```typescript
// User scans NFC tag, app reads tag ID
const tagId = "abc123-XY7Z";

const claimed = await proof.claim(
  'wine-collection',
  'bordeaux-2020',
  tagId
);
```

**Serial Number:**
```typescript
// User types in serial from product packaging
const serial = "a7Bx3";

const claimed = await proof.claim(
  'electronics',
  'headphones-pro',
  serial,
  { warranty: true }
);
```

**Pre-allocated Proof (Ticket/License):**
```typescript
// User received proof ID via email
const ticketId = "TICKET-VIP-001";

const claimed = await proof.claim(
  'event-2026',
  'vip-ticket',
  ticketId
);
```

---

## Method 4: Auto-Generated Claims

**Use when:** Product doesn't have unique identifiers, or you want simple post-purchase registration.

### Requirements

The collection or product must have `allowAutoGenerateClaims` enabled. Apps will know if this is available based on product configuration.

### API

```typescript
import { proof } from '@proveanything/smartlinks';

// No proof ID needed - system generates one automatically
const claimed = await proof.claimProduct(
  collectionId,   // e.g., 'beauty-brand'
  productId,      // e.g., 'moisturizer-pro'
  {
    // Optional: user data
    purchaseDate: '2026-02-17',
    store: 'Target',
    notes: 'Love this product!'
  }
);

console.log('Auto-generated ID:', claimed.id);  // e.g., "a7Bx3"
console.log('You now own this product');
```

### When to Use

✅ **Good for:**
- Consumer products (cosmetics, household goods)
- Post-purchase registration
- Products without unique identifiers
- Building product collections/wishlists

❌ **Avoid for:**
- High-value items
- Limited editions
- Products requiring proof of purchase
- Authenticity verification

---

## Choosing the Right Method

Apps typically know which method to use based on product configuration:

```typescript
const product = await product.get(collectionId, productId);

if (product.admin?.allowAutoGenerateClaims) {
  // Show simple registration button
  return <RegisterButton onClick={() => 
    proof.claimProduct(collectionId, productId, userData)
  } />;
} else {
  // Show input field for proof ID
  return <ClaimForm onSubmit={(proofId) => 
    proof.claim(collectionId, productId, proofId, userData)
  } />;
}
```

### Decision Tree

```
Do you have a proof ID?
├─ YES → Use proof.claim(collectionId, productId, proofId, data)
└─ NO → Use proof.claimProduct(collectionId, productId, data)
```

---

## Complete Examples

### Beauty Product Registration (Auto-Claim)

```typescript
import { proof } from '@proveanything/smartlinks';

async function registerProduct() {
  try {
    const claimed = await proof.claimProduct(
      'beauty-brand',
      'moisturizer-pro',
      {
        purchaseDate: '2026-02-17',
        store: 'Sephora',
        skinType: 'combination'
      }
    );
    
    alert(`Product registered! Your ID is: ${claimed.id}`);
    // Navigate to product dashboard
    
  } catch (error) {
    if (error.errorCode === 'FEATURE_NOT_ENABLED') {
      alert('This product requires a code to register');
    } else {
      alert('Registration failed. Please try again.');
    }
  }
}
```

### Wine Bottle Authentication (NFC Tag)

```typescript
import { proof } from '@proveanything/smartlinks';

async function claimWineBottle(tagId: string) {
  try {
    const claimed = await proof.claim(
      'wine-collection',
      'bordeaux-2020',
      tagId,
      {
        purchaseDate: '2026-02-17',
        vendor: 'Fine Wine Shop',
        cellarLocation: 'Rack 3, Position 12'
      }
    );
    
    console.log('Bottle authenticated and claimed!');
    console.log('Proof ID:', claimed.id);
    
  } catch (error) {
    if (error.status === 404) {
      alert('Invalid tag ID');
    } else if (error.status === 409) {
      alert('This bottle is already claimed');
    }
  }
}

// User scans NFC tag
nfcReader.addEventListener('reading', ({ serialNumber }) => {
  claimWineBottle(serialNumber);
});
```

### Event Ticket Claiming

```typescript
import { proof } from '@proveanything/smartlinks';

async function claimTicket(ticketId: string) {
  const claimed = await proof.claim(
    'music-festival-2026',
    'vip-pass',
    ticketId
  );
  
  console.log('Ticket claimed!');
  console.log('Seat:', claimed.data.seatNumber);
  console.log('Access level:', claimed.data.tier);
}

// User clicks email link with ticket ID
const urlParams = new URLSearchParams(window.location.search);
const ticketId = urlParams.get('ticket');
if (ticketId) {
  claimTicket(ticketId);
}
```

---

## Error Handling

### Common Errors

```typescript
try {
  const claimed = await proof.claimProduct(collectionId, productId, data);
} catch (error) {
  switch (error.errorCode) {
    case 'FEATURE_NOT_ENABLED':
      // Auto-claim not enabled for this product
      // Fall back to proof ID input
      break;
      
    case 'NOT_AUTHORIZED':
      // User not logged in
      // Redirect to login
      break;
      
    case 'RATE_LIMIT_EXCEEDED':
      // Too many claims
      // Show retry message
      break;
      
    case 'ALREADY_CLAIMED':
      // Proof ID already claimed by another user
      break;
      
    default:
      // Generic error handling
      break;
  }
}
```

---

## API Reference

### `proof.claim(collectionId, productId, proofId, data?)`

Claim a proof using an existing proof ID (NFC tag, serial number, pre-allocated proof).

**Parameters:**
- `collectionId` (string) - Collection ID
- `productId` (string) - Product ID
- `proofId` (string) - The proof ID to claim
- `data` (object, optional) - Additional data to attach to the proof

**Returns:** `Promise<ProofResponse>`

**Endpoint:** `PUT /public/collection/:collectionId/product/:productId/proof/:proofId/claim`

---

### `proof.claimProduct(collectionId, productId, data?)`

Claim a product without a proof ID. System auto-generates a unique serial number.

**Parameters:**
- `collectionId` (string) - Collection ID
- `productId` (string) - Product ID  
- `data` (object, optional) - User data to attach to the proof

**Returns:** `Promise<ProofResponse>` with auto-generated `id` field

**Endpoint:** `PUT /public/collection/:collectionId/product/:productId/proof/claim`

**Requirements:** Collection or product must have `allowAutoGenerateClaims: true`

---

## TypeScript Definitions

### Collection

```typescript
interface Collection {
  // ... other fields
  allowAutoGenerateClaims?: boolean  // Enable auto-claim for all products
}
```

### Product

```typescript
interface Product {
  // ... other fields
  admin?: {
    allowAutoGenerateClaims?: boolean  // Override collection setting
    lastSerialId?: number              // Last generated serial (auto-incremented)
  }
}
```

---

**Last Updated:** February 17, 2026

---

## Overview of Claiming Methods

| Method | Use Case | Requires Physical ID? | Pre-Generation? | SDK Function |
|--------|----------|---------------------|----------------|--------------|
| **1. Tag-Based (NFC/QR)** | Physical products with tags | ✅ Yes | ✅ Yes | `proof.claim(proofId)` |
| **2. Serial Number** | Products with printed codes | ✅ Yes | ✅ Yes | `proof.claim(proofId)` |
| **3. Claimable Proof** | Pre-allocated virtual proofs | ❌ No* | ✅ Yes | `proof.claim(proofId)` |
| **4. Virtual Proof** | Digital-only products | ❌ No | ✅ Yes | `proof.claim(proofId)` |
| **5. Auto-Generated (NEW)** | Generic product registration | ❌ No | ❌ No | `proof.claimProduct()` |

*Claimable proofs have a proof ID but user may receive it via email/link rather than physical product

---

## Method 1: Tag-Based Claims (NFC/QR)

**Best for:** Physical products with embedded NFC chips or printed QR codes

### How It Works

1. Admin pre-generates claim sets with unique tag IDs
2. Physical tags are attached to products
3. User scans tag with phone → reads tag ID
4. User claims proof using tag ID

### Proof ID Format

```
{claimSetId}-{code}
Example: "abc123-XY7Z"
```

### Implementation

**Admin: Generate claim set**
```typescript
import { claimSet } from '@proveanything/smartlinks';

const result = await claimSet.create({
  collectionId: 'wine-collection',
  productId: 'bordeaux-2020',
  count: 1000,  // Generate 1000 unique tags
  type: 'nfc'   // or 'qr'
});

// Returns: { ids: ["abc123-0001", "abc123-0002", ...] }
```

**User: Claim via tag**
```typescript
import { proof } from '@proveanything/smartlinks';

// User scans NFC tag, app reads tag ID
const tagId = "abc123-XY7Z";

const claimed = await proof.claim(tagId, {
  collectionId: 'wine-collection',
  productId: 'bordeaux-2020'
});

console.log('Claimed:', claimed.id);
```

### Advantages
- ✅ Highly secure (physical possession required)
- ✅ Simple user experience (tap phone)
- ✅ Works offline (scan → claim later)

### Disadvantages
- ❌ Requires physical tags (cost)
- ❌ Tags can be lost/damaged
- ❌ Pre-generation needed

---

## Method 2: Serial Number Claims

**Best for:** Products with printed serial numbers

### How It Works

1. Admin generates batch of serial numbers
2. Serial numbers printed on product packaging
3. User manually enters serial number
4. System validates and claims proof

### Proof ID Format

```
Base62-encoded with HMAC validation
Example: "a7Bx3", "K9mP2"
```

### Implementation

**Admin: Generate serial numbers**
```typescript
import { serialNumber } from '@proveanything/smartlinks';

const serials = await serialNumber.generate({
  collectionId: 'electronics',
  productId: 'headphones-pro',
  count: 5000,
  startIndex: 1000  // Optional: continue from previous batch
});

// Returns: ["a7Bx3", "a8Cy4", ...]
// Print these on product packaging
```

**User: Claim via serial**
```typescript
import { proof } from '@proveanything/smartlinks';

// User types in serial from product
const serial = "a7Bx3";

const claimed = await proof.claim(serial, {
  collectionId: 'electronics',
  productId: 'headphones-pro'
});

console.log('Product registered:', claimed.id);
```

### Advantages
- ✅ Lower cost (just printing)
- ✅ Works on any product
- ✅ Cryptographically secure

### Disadvantages
- ❌ User must manually type code (typos)
- ❌ Codes can be shared/leaked
- ❌ Pre-generation needed

---

## Method 3: Claimable Proof Claims

**Best for:** Event tickets, vouchers, promotional items

### How It Works

1. Admin creates claimable proofs (virtual state)
2. Proof IDs distributed via email/link
3. User clicks claim link or enters proof ID
4. Proof transitions from virtual → claimed

### Proof ID Format

```
Custom proof ID set by admin
Example: "TICKET-2026-001", "VOUCHER-ABC"
```

### Implementation

**Admin: Create claimable proofs**
```typescript
import { proof } from '@proveanything/smartlinks';

// Create single claimable proof
const claimableProof = await proof.create({
  collectionId: 'event-2026',
  productId: 'vip-ticket',
  id: 'TICKET-VIP-001',
  admin: true,
  data: {
    claimable: true,      // Marks as unclaimed
    virtual: true,        // Not yet associated with user
    seatNumber: 'A-12',
    tier: 'VIP'
  }
});

// Send claim link to user
const claimUrl = `https://yourapp.com/claim/TICKET-VIP-001`;
sendEmail(user.email, `Your ticket: ${claimUrl}`);
```

**User: Claim proof**
```typescript
import { proof } from '@proveanything/smartlinks';

const claimed = await proof.claim('TICKET-VIP-001', {
  collectionId: 'event-2026',
  productId: 'vip-ticket'
});

// Proof now associated with user
console.log('Ticket claimed by:', claimed.userId);
```

### Advantages
- ✅ Flexible distribution (email, SMS, link)
- ✅ Can include pre-configured data
- ✅ Easy to track claim status
- ✅ Can set claim windows (time-limited)

### Disadvantages
- ❌ Requires pre-creation
- ❌ Link/ID can be shared
- ❌ More complex admin workflow

---

## Method 4: Virtual Proof Claims

**Best for:** Digital products, licenses, access codes

### How It Works

Similar to claimable proofs, but typically used for purely digital products without physical counterpart.

### Implementation

**Admin: Create virtual proof**
```typescript
import { proof } from '@proveanything/smartlinks';

const virtualProof = await proof.create({
  collectionId: 'software-licenses',
  productId: 'photo-editor-pro',
  id: 'LICENSE-2026-XYZ',
  admin: true,
  data: {
    virtual: true,
    claimable: true,
    licenseKey: 'XXXX-YYYY-ZZZZ',
    expiresAt: '2027-12-31'
  }
});
```

**User: Claim virtual proof**
```typescript
const claimed = await proof.claim('LICENSE-2026-XYZ', {
  collectionId: 'software-licenses',
  productId: 'photo-editor-pro'
});

console.log('License activated:', claimed.data.licenseKey);
```

### Advantages
- ✅ Perfect for digital goods
- ✅ No physical logistics
- ✅ Instant delivery

### Disadvantages
- ❌ Same as claimable proofs
- ❌ Codes can be easily shared

---

## Method 5: Auto-Generated Claims (NEW)

**Best for:** Generic products without unique identifiers, post-purchase registration

### How It Works

1. Admin enables auto-claim on collection/product
2. User initiates claim without proof ID
3. System generates unique serial on-the-fly
4. Proof created immediately and claimed

### Proof ID Format

```
Auto-generated Base62 serial
Example: "a7Bx3", "K9mP2"
```

### Implementation

**Admin: Enable auto-claim**
```typescript
import { collection } from '@proveanything/smartlinks';

// Enable at collection level
await collection.update('my-collection', {
  allowAutoGenerateClaims: true
});

// Or override at product level
await product.update('my-collection', 'moisturizer-pro', {
  admin: {
    allowAutoGenerateClaims: true
  }
});
```

**User: Claim without proof ID**
```typescript
import { proof } from '@proveanything/smartlinks';

// No proof ID needed!
const claimed = await proof.claimProduct({
  collectionId: 'beauty-brand',
  productId: 'moisturizer-pro',
  data: {
    purchaseDate: '2026-02-17',
    store: 'Target',
    notes: 'Love this product!'
  }
});

console.log('Your product ID:', claimed.id);  // Auto-generated: "a7Bx3"
```

### API Endpoint

```
PUT /public/collection/:collectionId/product/:productId/proof/claim
```

### Configuration Priority

1. Product `admin.allowAutoGenerateClaims: false` → ❌ Disabled
2. Product `admin.allowAutoGenerateClaims: true` → ✅ Enabled
3. Collection `allowAutoGenerateClaims: true` → ✅ Enabled
4. Default → ❌ Disabled

### Advantages
- ✅ No pre-generation required
- ✅ Zero cost (no tags/printing)
- ✅ Simple user experience
- ✅ Perfect for non-serialized products
- ✅ Atomic counter ensures uniqueness

### Disadvantages
- ❌ No proof of physical ownership
- ❌ Potential for spam/abuse (needs rate limiting)
- ❌ Users can claim products they don't own

### Security Considerations

**Rate limiting required:**
```typescript
// Limit to 10 auto-claims per hour per user
if (userClaimCount > 10) {
  throw new Error('Too many claims. Try again later.');
}
```

**Use cases where this is safe:**
- Low-value consumer products
- Products where ownership doesn't matter much
- Post-purchase registration for benefits
- Products sold through verified channels

**Avoid for:**
- High-value items
- Limited editions
- Products requiring proof of purchase
- Collectibles

---

## Choosing the Right Method

### Decision Tree

```
Does product have a unique physical identifier?
├─ YES → Do you need high security?
│  ├─ YES → NFC Tag (Method 1)
│  └─ NO → Serial Number (Method 2)
│
└─ NO → Is it a digital product?
   ├─ YES → Virtual Proof (Method 4)
   └─ NO → Do users need proof IDs in advance?
      ├─ YES → Claimable Proof (Method 3)
      └─ NO → Auto-Generated (Method 5)
```

### Use Case Examples

| Product Type | Recommended Method | Reason |
|--------------|-------------------|---------|
| Wine bottles | NFC Tag | High value, authentication important |
| Electronics | Serial Number | Already have serial numbers |
| Event tickets | Claimable Proof | Need to distribute in advance |
| Software licenses | Virtual Proof | Digital product |
| Cosmetics | Auto-Generated | Low value, post-purchase registration |
| Limited sneakers | NFC Tag | High value, prevent fraud |
| Household goods | Auto-Generated | Simple registration, low fraud risk |

---

## Combining Methods

You can use multiple methods for the same product:

```typescript
// Product supports both serial numbers AND auto-claim
const product = {
  id: 'premium-headphones',
  serialNumbersEnabled: true,        // Traditional serial claiming
  admin: {
    allowAutoGenerateClaims: true    // Also allow auto-claim
  }
};

// User path 1: Has serial from box
await proof.claim('a7Bx3', { collectionId, productId });

// User path 2: Lost box, just wants to register
await proof.claimProduct({ collectionId, productId });
```

---

## API Summary

### All Claim Methods

```typescript
import { proof } from '@proveanything/smartlinks';

// Methods 1-4: Claim with proof ID
await proof.claim(proofId, {
  collectionId: string,
  productId: string,
  data?: any  // Optional additional data
});

// Method 5: Claim without proof ID
await proof.claimProduct({
  collectionId: string,
  productId: string,
  data?: any  // Optional additional data
});
```

### Check Claim Status

```typescript
const proofData = await proof.get(proofId);

if (proofData.claimable && proofData.virtual) {
  console.log('Proof is unclaimed');
} else if (proofData.userId) {
  console.log('Proof claimed by:', proofData.userId);
}
```

### Admin: Check Product Settings

```typescript
const product = await product.get(collectionId, productId);

// Check what claiming methods are available
const methods = {
  hasSerialNumbers: product.admin?.lastSerialId > 0,
  allowsAutoClaim: product.admin?.allowAutoGenerateClaims === true,
  hasClaimSets: product.claimSets?.length > 0
};

console.log('Available claiming methods:', methods);
```

---

## Migration Guide

### Adding Auto-Claim to Existing Products

```typescript
// Enable for all cosmetics products
const products = await product.list('beauty-collection');

for (const prod of products) {
  if (prod.category === 'cosmetics') {
    await product.update('beauty-collection', prod.id, {
      admin: {
        ...prod.admin,
        allowAutoGenerateClaims: true
      }
    });
  }
}
```

### Analytics: Track Claim Method

```typescript
// When creating proof, tag with claim method
const proof = await proof.create({
  // ... other fields
  metadata: {
    claimMethod: 'auto_generated' | 'serial' | 'nfc' | 'qr' | 'claimable'
  }
});

// Query by method
const autoClaimedProofs = await firestore
  .collection('ledger')
  .where('metadata.claimMethod', '==', 'auto_generated')
  .get();
```

---

## Related Documentation

- [Claim Sets](./claim-sets.md) - Managing NFC/QR tag batches
- [Serial Numbers](./serial-numbers.md) - Cryptographic serial generation
- [Proof Ownership](./proof-ownership.md) - Managing claimed proofs
- [User App Data](./app-data-storage.md) - Storing user preferences per proof

---

**Last Updated:** February 17, 2026

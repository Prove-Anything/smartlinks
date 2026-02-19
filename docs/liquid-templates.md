# Liquid Templates in SmartLinks

Liquid is a templating language that allows you to dynamically insert data into text content. SmartLinks uses Liquid Templates in various APIs—such as email templates, notification messages, and dynamic content—to personalize communications with real-time data from your collections, products, proofs, and users.

---

## What are Liquid Templates?

Liquid is an open-source template language created by Shopify. It uses a simple syntax with two main components:

- **Output tags** `{{ }}` — Insert dynamic values
- **Logic tags** `{% %}` — Control flow (if/else, loops, etc.)

### Basic Example

```liquid
Hello {{ contact.name }},

Thank you for registering your {{ product.name }}!
Your proof ID is: {{ proof.id }}

{% if proof.claimed %}
This item was claimed on {{ proof.claimedAt | date: "%B %d, %Y" }}.
{% endif %}
```

---

## Core Data Objects

SmartLinks provides several core objects that can be accessed in Liquid Templates. The available objects depend on the context (e.g., a proof-level template has access to `proof`, `product`, and `collection`).

---

### Collection

A **Collection** represents a top-level business, brand, or organization. All products belong to a collection.

| Field | Type | Description |
|-------|------|-------------|
| `collection.id` | string | Unique identifier |
| `collection.title` | string | Display title of the collection |
| `collection.description` | string | Description text |
| `collection.shortId` | string | Short identifier for the collection |
| `collection.logoImage.url` | string | URL to the collection's logo image |
| `collection.logoImage.thumbnails.x100` | string | 100px thumbnail |
| `collection.logoImage.thumbnails.x200` | string | 200px thumbnail |
| `collection.logoImage.thumbnails.x512` | string | 512px thumbnail |
| `collection.headerImage.url` | string | URL to collection header/hero image |
| `collection.headerImage.thumbnails.*` | string | Header image thumbnails (x100, x200, x512) |
| `collection.loaderImage.url` | string | URL to collection loader image |
| `collection.primaryColor` | string | Primary theme color (hex code) |
| `collection.secondaryColor` | string | Secondary theme color (hex code) |
| `collection.dark` | boolean | Whether dark mode is enabled |
| `collection.portalUrl` | string | URL for the collection's portal |
| `collection.redirectUrl` | string | Custom domain redirect URL |
| `collection.roles` | object | User roles mapping (userId → role) |
| `collection.groupTags` | array | Array of group tag names |
| `collection.languages` | array | Array of supported language objects |
| `collection.defaultAuthKitId` | string | Default auth kit ID |
| `collection.allowAutoGenerateClaims` | boolean | Allow claiming without proof ID |

#### Example Usage

```liquid
Welcome to {{ collection.title }}!

{% if collection.portalUrl %}
Visit our portal at {{ collection.portalUrl }}
{% endif %}

{% if collection.logoImage %}
<img src="{{ collection.logoImage.url }}" alt="{{ collection.title }} logo" />
<!-- Or use a thumbnail: -->
<img src="{{ collection.logoImage.thumbnails.x200 }}" alt="{{ collection.title }} logo" />
{% endif %}

{% if collection.dark %}
<!-- Dark mode is enabled -->
{% endif %}
```

---

### Product

A **Product** represents a type or definition of a physical or digital item. Products belong to a collection and can have many proofs (instances).

| Field | Type | Description |
|-------|------|-------------|
| `product.id` | string | Unique identifier |
| `product.name` | string | Product name |
| `product.collectionId` | string | ID of the parent collection |
| `product.description` | string | Product description |
| `product.gtin` | string | Global Trade Item Number |
| `product.type` | string | Product type from standard types |
| `product.heroImage.url` | string | Primary product image URL |
| `product.heroImage.thumbnails.x100` | string | 100px thumbnail |
| `product.heroImage.thumbnails.x200` | string | 200px thumbnail |
| `product.heroImage.thumbnails.x512` | string | 512px thumbnail |
| `product.tags` | object | Tag map with boolean values |
| `product.data` | object | Flexible key-value data map |
| `product.admin` | object | Admin-only configuration |
| `product.admin.allowAutoGenerateClaims` | boolean | Allow claiming without proof ID |
| `product.admin.lastSerialId` | number | Last generated serial ID |

#### Example Usage

```liquid
Your {{ product.name }}

{{ product.description }}

{% if product.gtin %}
GTIN: {{ product.gtin }}
{% endif %}

{% if product.heroImage %}
<img src="{{ product.heroImage.url }}" alt="{{ product.name }}" />
<!-- Or use a thumbnail: -->
<img src="{{ product.heroImage.thumbnails.x512 }}" alt="{{ product.name }}" />
{% endif %}

{% if product.tags.premium %}
🌟 Premium Product
{% endif %}

{% if product.data.warranty_years %}
Warranty: {{ product.data.warranty_years }} years
{% endif %}
```

---

### Proof

A **Proof** is a specific instance of a product—think of it as a unique digital certificate for a physical item. Proofs can be claimed by users and carry ownership information.

| Field | Type | Description |
|-------|------|-------------|
| `proof.id` | string | Unique identifier |
| `proof.collectionId` | string | ID of the parent collection |
| `proof.productId` | string | ID of the associated product |
| `proof.tokenId` | string | Unique token identifier |
| `proof.userId` | string | User ID of the owner |
| `proof.claimable` | boolean | Whether the proof can be claimed |
| `proof.virtual` | boolean | Whether this is a virtual proof |
| `proof.values` | object | Arbitrary key-value pairs for proof data |
| `proof.createdAt` | datetime | When the proof was created |

**Note**: Proof `values` object can contain any custom fields. Common examples:
- `proof.values.serialNumber` - Serial number
- `proof.values.claimedAt` - Claim timestamp
- `proof.values.status` - Current status
- `proof.values.warrantyExpiry` - Warranty expiration

#### Example Usage

```liquid
Proof of Authenticity

{% if proof.values.serialNumber %}
Serial Number: {{ proof.values.serialNumber }}
{% endif %}

{% if proof.values.status %}
Status: {{ proof.values.status }}
{% endif %}

{% if proof.claimable %}
This item is available to claim.
{% else %}
This item has been claimed.
{% endif %}

{% if proof.virtual %}
🌐 Digital Product
{% endif %}

{% if proof.values.claimedAt %}
Claimed on: {{ proof.values.claimedAt | date: "%B %d, %Y at %H:%M" }}
{% endif %}

{% if proof.values.warrantyExpiry %}
Warranty expires: {{ proof.values.warrantyExpiry | date: "%B %d, %Y" }}
{% endif %}
```

---

### Contact

A **Contact** represents a customer or user in the system. Contacts are associated with a collection and can own multiple proofs.

| Field | Type | Description |
|-------|------|-------------|
| `contact.contactId` | string | Unique identifier |
| `contact.orgId` | string | Organization/collection ID |
| `contact.userId` | string | Linked user ID (if authenticated) |
| `contact.email` | string | Primary email address |
| `contact.phone` | string | Primary phone number |
| `contact.emails` | array | Array of all email addresses |
| `contact.phones` | array | Array of all phone numbers |
| `contact.firstName` | string | First name |
| `contact.lastName` | string | Last name |
| `contact.displayName` | string | Display name |
| `contact.company` | string | Company name |
| `contact.avatarUrl` | string | Profile picture URL |
| `contact.locale` | string | Preferred language/locale (e.g., "en", "de") |
| `contact.timezone` | string | Preferred timezone |
| `contact.tags` | array | Array of tag strings for segmentation |
| `contact.source` | string | How the contact was created |
| `contact.notes` | string | Admin notes |
| `contact.externalIds` | object | External system IDs |
| `contact.customFields` | object | Custom key-value data |
| `contact.createdAt` | datetime | When the contact was created |
| `contact.updatedAt` | datetime | When the contact was last updated |

#### Example Usage

```liquid
Hi {{ contact.firstName | default: contact.displayName | default: "there" }},

{% if contact.locale == "de" %}
Willkommen!
{% elsif contact.locale == "fr" %}
Bienvenue!
{% else %}
Welcome!
{% endif %}

{% if contact.phone %}
We'll send updates to {{ contact.phone }}.
{% endif %}

{% if contact.company %}
Company: {{ contact.company }}
{% endif %}

{% if contact.customFields.vip %}
🌟 VIP Customer
{% endif %}
```

---

### User (Account)

A **User** represents an authenticated account in the system. This is typically the logged-in user performing an action.

| Field | Type | Description |
|-------|------|-------------|
| `user.uid` | string | Unique identifier |
| `user.email` | string | Email address |
| `user.displayName` | string | Display name |
| `user.accountData` | object | Account-specific data and settings |

#### Example Usage

```liquid
Logged in as: {{ user.displayName }} ({{ user.email }})

{% if user.accountData.preferences.notifications %}
Notifications are enabled.
{% endif %}
```

---

### Attestation

An **Attestation** is flexible data attached to a specific proof. It's used to store additional information like warranty registrations, tasting notes, service records, etc.

| Field | Type | Description |
|-------|------|-------------|
| `attestation.id` | string | Unique identifier |
| `attestation.public` | object | Public attestation data (varies by type) |
| `attestation.private` | object | Private attestation data (varies by type) |
| `attestation.proof` | object | Associated proof reference/data |
| `attestation.createdAt` | datetime | When the attestation was created |
| `attestation.updatedAt` | datetime | When the attestation was last updated |

**Note**: The `public` and `private` objects contain custom fields based on your use case.

#### Example Usage

```liquid
{% if attestation.public.type == "warranty_registration" %}
Warranty Registration Details:
- Registered: {{ attestation.createdAt | date: "%B %d, %Y" }}
- Purchase Date: {{ attestation.public.purchaseDate }}
- Store: {{ attestation.public.storeName }}
{% endif %}

{% if attestation.public.type == "tasting_note" %}
🍷 Tasting Note:
"{{ attestation.public.notes }}"
Rating: {{ attestation.public.rating }}/5
{% endif %}

{% if attestation.private.internalNotes %}
<!-- Private data only visible to admins -->
Notes: {{ attestation.private.internalNotes }}
{% endif %}
```

---

## Liquid Filters

Liquid provides built-in filters to transform data. Common filters include:

### Text Filters

| Filter | Description | Example |
|--------|-------------|---------|
| `upcase` | Convert to uppercase | `{{ product.name \| upcase }}` |
| `downcase` | Convert to lowercase | `{{ product.name \| downcase }}` |
| `capitalize` | Capitalize first letter | `{{ contact.name \| capitalize }}` |
| `truncate` | Limit string length | `{{ product.description \| truncate: 100 }}` |
| `strip_html` | Remove HTML tags | `{{ content \| strip_html }}` |
| `escape` | HTML escape special chars | `{{ user_input \| escape }}` |
| `default` | Fallback value if empty | `{{ contact.name \| default: "Customer" }}` |

### Date Filters

| Filter | Description | Example |
|--------|-------------|---------|
| `date` | Format a date | `{{ proof.claimedAt \| date: "%B %d, %Y" }}` |

Common date formats:
- `%B %d, %Y` → January 15, 2025
- `%Y-%m-%d` → 2025-01-15
- `%d/%m/%Y` → 15/01/2025
- `%H:%M` → 14:30

### Array Filters

| Filter | Description | Example |
|--------|-------------|---------|
| `join` | Join array elements | `{{ product.tags \| join: ", " }}` |
| `first` | Get first element | `{{ product.images \| first }}` |
| `last` | Get last element | `{{ product.images \| last }}` |
| `size` | Get array length | `{{ product.tags.size }}` |
| `sort` | Sort array | `{{ items \| sort: "name" }}` |

### Number Filters

| Filter | Description | Example |
|--------|-------------|---------|
| `plus` | Add | `{{ count \| plus: 1 }}` |
| `minus` | Subtract | `{{ total \| minus: discount }}` |
| `times` | Multiply | `{{ price \| times: quantity }}` |
| `divided_by` | Divide | `{{ total \| divided_by: 2 }}` |
| `round` | Round number | `{{ average \| round: 2 }}` |

---

## Control Flow

### Conditionals

```liquid
{% if proof.claimed %}
  This item is claimed.
{% elsif proof.status == "pending" %}
  Claim pending verification.
{% else %}
  Available to claim.
{% endif %}

{% unless contact.email %}
  No email on file.
{% endunless %}
```

### Operators

| Operator | Description |
|----------|-------------|
| `==` | Equals |
| `!=` | Not equals |
| `>` | Greater than |
| `<` | Less than |
| `>=` | Greater than or equal |
| `<=` | Less than or equal |
| `or` | Logical OR |
| `and` | Logical AND |
| `contains` | String/array contains |

```liquid
{% if product.tags contains "premium" %}
  🌟 Premium Product
{% endif %}

{% if contact.email and proof.claimed %}
  Send confirmation to {{ contact.email }}
{% endif %}
```

### Loops

```liquid
{% for tag in product.tags %}
  <span class="tag">{{ tag }}</span>
{% endfor %}

{% for image in product.images limit: 3 %}
  <img src="{{ image }}" alt="{{ product.name }} image {{ forloop.index }}" />
{% endfor %}
```

Loop variables:
- `forloop.index` — Current iteration (1-indexed)
- `forloop.index0` — Current iteration (0-indexed)
- `forloop.first` — Is this the first iteration?
- `forloop.last` — Is this the last iteration?
- `forloop.length` — Total number of iterations

---

## Common Use Cases

### Email Templates

```liquid
Subject: Your {{ product.name }} has been registered!

Hi {{ contact.firstName | default: contact.displayName | default: "there" }},

Great news! Your {{ product.name }}{% if proof.values.serialNumber %} (Serial: {{ proof.values.serialNumber }}){% endif %} 
has been successfully registered to your account.

{% if product.data.warranty_years %}
Your warranty is valid for {{ product.data.warranty_years }} years 
from the date of purchase.
{% endif %}

If you have any questions, please contact {{ collection.title }} support.

Best regards,
The {{ collection.title }} Team
```

### Notification Messages

```liquid
🎉 {{ contact.firstName }}, your {{ product.name }} is now verified!
{% if proof.values.shortCode %}Proof ID: {{ proof.values.shortCode }}{% endif %}
```

### Dynamic Content Blocks

```liquid
{% if proof.values.tier == "gold" %}
  <div class="gold-benefits">
    As a Gold member, you get exclusive access to...
  </div>
{% elsif proof.values.tier == "silver" %}
  <div class="silver-benefits">
    Your Silver membership includes...
  </div>
{% endif %}
```

### Multilingual Content

```liquid
{% case contact.locale %}
  {% when "de" %}
    Vielen Dank für Ihre Registrierung!
  {% when "fr" %}
    Merci pour votre inscription!
  {% when "es" %}
    ¡Gracias por registrarte!
  {% else %}
    Thank you for registering!
{% endcase %}
```

---

## Accessing Nested Data

Use dot notation to access nested fields in data objects:

```liquid
{{ product.data.manufacturer }}
{{ attestation.public.warranty.expiryDate }}
{{ contact.customFields.vip_level }}
{{ proof.values.serialNumber }}
```

For dynamic keys, you may need to use bracket notation (if supported):

```liquid
{{ product.data["custom-field"] }}
```

---

## Best Practices

1. **Always use `default` filter** for optional fields to avoid blank output:
   ```liquid
   {{ contact.displayName | default: contact.firstName | default: "Valued Customer" }}
   ```

2. **Escape user-generated content** when outputting as HTML:
   ```liquid
   {{ attestation.public.userNotes | escape }}
   ```

3. **Check for existence** before accessing nested data:
   ```liquid
   {% if proof.values.warranty %}
     Warranty: {{ proof.values.warranty.type }}
   {% endif %}
   ```

4. **Use meaningful fallbacks** for a better user experience:
   ```liquid
   Hi {{ contact.firstName | default: contact.displayName | default: "there" }},
   ```

5. **Format dates appropriately** for the user's locale:
   ```liquid
   {{ proof.createdAt | date: "%d %B %Y" }}
   ```

---

## API Context

Different APIs provide different objects in the Liquid context:

| API / Feature | Available Objects |
|---------------|-------------------|
| Email Templates | `collection`, `product`, `proof`, `contact`, `attestation` |
| Push Notifications | `collection`, `product`, `proof`, `contact` |
| SMS Messages | `collection`, `product`, `proof`, `contact` |
| Wallet Passes | `collection`, `product`, `proof`, `contact` |
| Journey Actions | `collection`, `product`, `proof`, `contact`, `event` |
| Broadcast Campaigns | `collection`, `contact`, `segment` |

Check the specific API documentation for the exact objects available in each context.

---

## Further Resources

- [Liquid Template Language Documentation](https://shopify.github.io/liquid/)
- [Liquid for Designers](https://github.com/Shopify/liquid/wiki/Liquid-for-Designers)
- SmartLinks Template API Reference

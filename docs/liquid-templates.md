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
| `collection.name` | string | Display name of the collection |
| `collection.description` | string | Description text |
| `collection.slug` | string | URL-friendly identifier |
| `collection.logoUrl` | string | URL to the collection's logo image |
| `collection.websiteUrl` | string | Primary website URL |
| `collection.metadata` | object | Custom key-value metadata |
| `collection.createdAt` | datetime | When the collection was created |
| `collection.updatedAt` | datetime | When the collection was last updated |

#### Example Usage

```liquid
Welcome to {{ collection.name }}!

{% if collection.websiteUrl %}
Visit us at {{ collection.websiteUrl }}
{% endif %}

<img src="{{ collection.logoUrl }}" alt="{{ collection.name }} logo" />
```

---

### Product

A **Product** represents a type or definition of a physical or digital item. Products belong to a collection and can have many proofs (instances).

| Field | Type | Description |
|-------|------|-------------|
| `product.id` | string | Unique identifier |
| `product.name` | string | Product name |
| `product.description` | string | Product description |
| `product.sku` | string | Stock keeping unit |
| `product.slug` | string | URL-friendly identifier |
| `product.imageUrl` | string | Primary product image URL |
| `product.images` | array | Array of image URLs |
| `product.category` | string | Product category |
| `product.tags` | array | Array of tag strings |
| `product.metadata` | object | Custom key-value metadata |
| `product.createdAt` | datetime | When the product was created |
| `product.updatedAt` | datetime | When the product was last updated |

#### Example Usage

```liquid
Your {{ product.name }} (SKU: {{ product.sku }})

{{ product.description }}

{% if product.tags.size > 0 %}
Tags: {{ product.tags | join: ", " }}
{% endif %}

{% for image in product.images %}
<img src="{{ image }}" alt="{{ product.name }}" />
{% endfor %}
```

---

### Proof

A **Proof** is a specific instance of a product—think of it as a unique digital certificate for a physical item. Proofs can be claimed by users and carry ownership information.

| Field | Type | Description |
|-------|------|-------------|
| `proof.id` | string | Unique identifier |
| `proof.serialNumber` | string | Human-readable serial number |
| `proof.claimed` | boolean | Whether the proof has been claimed |
| `proof.claimedAt` | datetime | When the proof was claimed |
| `proof.claimedBy` | string | User ID of the claimer |
| `proof.status` | string | Current status (e.g., "active", "transferred") |
| `proof.nfcTagId` | string | Associated NFC tag ID (if applicable) |
| `proof.qrCode` | string | QR code identifier |
| `proof.shortCode` | string | Short code for easy lookup |
| `proof.metadata` | object | Custom key-value metadata |
| `proof.createdAt` | datetime | When the proof was created |
| `proof.updatedAt` | datetime | When the proof was last updated |

#### Example Usage

```liquid
Proof of Authenticity

Serial Number: {{ proof.serialNumber }}
Status: {{ proof.status }}

{% if proof.claimed %}
Claimed on: {{ proof.claimedAt | date: "%B %d, %Y at %H:%M" }}
{% else %}
This item has not been claimed yet.
{% endif %}

{% if proof.metadata.warrantyExpiry %}
Warranty expires: {{ proof.metadata.warrantyExpiry | date: "%B %d, %Y" }}
{% endif %}
```

---

### Contact

A **Contact** represents a customer or user in the system. Contacts are associated with a collection and can own multiple proofs.

| Field | Type | Description |
|-------|------|-------------|
| `contact.id` | string | Unique identifier |
| `contact.email` | string | Email address |
| `contact.name` | string | Full name |
| `contact.firstName` | string | First name |
| `contact.lastName` | string | Last name |
| `contact.phone` | string | Phone number |
| `contact.locale` | string | Preferred language/locale (e.g., "en", "de") |
| `contact.timezone` | string | Preferred timezone |
| `contact.avatarUrl` | string | Profile picture URL |
| `contact.metadata` | object | Custom key-value metadata |
| `contact.tags` | array | Array of tag strings for segmentation |
| `contact.createdAt` | datetime | When the contact was created |
| `contact.updatedAt` | datetime | When the contact was last updated |
| `contact.lastSeenAt` | datetime | Last activity timestamp |

#### Example Usage

```liquid
Hi {{ contact.firstName | default: contact.name | default: "there" }},

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
```

---

### User (Account)

A **User** represents an authenticated account in the system. This is typically the logged-in user performing an action.

| Field | Type | Description |
|-------|------|-------------|
| `user.id` | string | Unique identifier |
| `user.email` | string | Email address |
| `user.name` | string | Display name |
| `user.admin` | boolean | Whether user has admin privileges |
| `user.avatarUrl` | string | Profile picture URL |
| `user.createdAt` | datetime | Account creation date |

#### Example Usage

```liquid
Logged in as: {{ user.name }} ({{ user.email }})

{% if user.admin %}
🔐 You have administrator access.
{% endif %}
```

---

### Attestation

An **Attestation** is flexible data attached to a specific proof. It's used to store additional information like warranty registrations, tasting notes, service records, etc.

| Field | Type | Description |
|-------|------|-------------|
| `attestation.id` | string | Unique identifier |
| `attestation.type` | string | Attestation type (app-defined) |
| `attestation.data` | object | The attestation payload (varies by type) |
| `attestation.createdBy` | string | User ID who created it |
| `attestation.createdAt` | datetime | When the attestation was created |
| `attestation.updatedAt` | datetime | When the attestation was last updated |

#### Example Usage

```liquid
{% if attestation.type == "warranty_registration" %}
Warranty Registration Details:
- Registered: {{ attestation.createdAt | date: "%B %d, %Y" }}
- Purchase Date: {{ attestation.data.purchaseDate }}
- Store: {{ attestation.data.storeName }}
{% endif %}

{% if attestation.type == "tasting_note" %}
🍷 Tasting Note by {{ attestation.data.author }}:
"{{ attestation.data.notes }}"
Rating: {{ attestation.data.rating }}/5
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

Hi {{ contact.firstName | default: "there" }},

Great news! Your {{ product.name }} (Serial: {{ proof.serialNumber }}) 
has been successfully registered to your account.

{% if product.metadata.warrantyYears %}
Your warranty is valid for {{ product.metadata.warrantyYears }} years 
from the date of purchase.
{% endif %}

If you have any questions, please contact {{ collection.name }} support.

Best regards,
The {{ collection.name }} Team
```

### Notification Messages

```liquid
🎉 {{ contact.firstName }}, your {{ product.name }} is now verified!
Proof ID: {{ proof.shortCode }}
```

### Dynamic Content Blocks

```liquid
{% if proof.metadata.tier == "gold" %}
  <div class="gold-benefits">
    As a Gold member, you get exclusive access to...
  </div>
{% elsif proof.metadata.tier == "silver" %}
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

Use dot notation to access nested fields in metadata or data objects:

```liquid
{{ product.metadata.manufacturer }}
{{ attestation.data.warranty.expiryDate }}
{{ collection.metadata.social.twitter }}
```

For dynamic keys, you may need to use bracket notation (if supported):

```liquid
{{ product.metadata["custom-field"] }}
```

---

## Best Practices

1. **Always use `default` filter** for optional fields to avoid blank output:
   ```liquid
   {{ contact.name | default: "Valued Customer" }}
   ```

2. **Escape user-generated content** when outputting as HTML:
   ```liquid
   {{ attestation.data.userNotes | escape }}
   ```

3. **Check for existence** before accessing nested data:
   ```liquid
   {% if proof.metadata.warranty %}
     Warranty: {{ proof.metadata.warranty.type }}
   {% endif %}
   ```

4. **Use meaningful fallbacks** for a better user experience:
   ```liquid
   Hi {{ contact.firstName | default: contact.name | default: "there" }},
   ```

5. **Format dates appropriately** for the user's locale:
   ```liquid
   {{ proof.claimedAt | date: "%d %B %Y" }}
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

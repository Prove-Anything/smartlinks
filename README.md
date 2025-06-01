# @proveanything/smartlinks

An official JavaScript/TypeScript client SDK for the Smartlinks API. This package provides simple, namespaced functions to fetch Collection, Product, Proof, and App Configuration data in both browser and Node.js environments.

## Installation

```bash
npm install @proveanything/smartlinks
# or
yarn add @proveanything/smartlinks
```

## Quickstart

```ts
import {
  initializeApi,
  collection,
  product,
  proof,
  appConfiguration,
} from "@proveanything/smartlinks";

async function main() {
  // Initialize once (provide base URL and optional API key/bearer token)
  initializeApi({
    baseURL: "https://smartlinks.app/api/v1",
    apiKey: "YOUR_API_KEY_HERE",       // optional
    bearerToken: "YOUR_BEARER_TOKEN",  // optional
  });

  try {
    // Fetch a collection by ID
    const coll = await collection.get("abc123");
    console.log("Collection:", coll);

    // Fetch a product item by collection ID & product ID
    const prod = await product.get("abc123", "prod789");
    console.log("Product Item:", prod);

    // Fetch a proof by collection ID & proof ID
    const prf = await proof.get("abc123", "proof456");
    console.log("Proof:", prf);

    // Fetch an app configuration by collection ID & app ID
    const cfg = await appConfiguration.get("abc123", "app789");
    console.log("App Configuration:", cfg);
  } catch (err) {
    console.error("Error fetching data:", err);
  }
}

main();
```

## API Reference

### Initialization

```ts
initializeApi(options: { baseURL: string; apiKey?: string; bearerToken?: string }): void
```

- **Parameters:**
  - `baseURL` (`string`, required): The root URL of the Smartlinks API, e.g. `https://smartlinks.app/api/v1`.
  - `apiKey`  (`string`, optional): Your API key for the `X-API-Key` header.
  - `bearerToken` (`string`, optional): Your Bearer token for the `AUTHORIZATION` header.

All subsequent calls to the API functions will use these settings.

---

### Namespace: `collection`

#### `collection.get(collectionId: string): Promise<CollectionResponse>`

Fetches a single collection by its ID.

- **Parameters:**
  - `collectionId` (`string`, required): The unique identifier of the collection to fetch.
- **Returns:**  
  A `Promise` that resolves to a `CollectionResponse` object:

  ```ts
  export interface CollectionResponse {
    id: string;
    name: string;
    title: string;
    logoImage: string;
  }
  ```

- **Example:**
  ```ts
  const coll = await collection.get("abc123");
  console.log("Fetched collection:", coll.title);
  ```

---

### Namespace: `product`

#### `product.get(collectionId: string, productId: string): Promise<ProductResponse>`

Fetches a single product item within a collection.

- **Parameters:**
  - `collectionId` (`string`, required): The parent collection’s ID.
  - `productId`    (`string`, required): The product item’s ID.
- **Returns:**  
  A `Promise` that resolves to a `ProductResponse` object:

  ```ts
  export interface ProductResponse {
    id: string;
    name: string;
    description: string;
    heroImage: string;
  }
  ```

- **Example:**
  ```ts
  const prod = await product.get("abc123", "prod789");
  console.log("Fetched product:", prod.name);
  ```

---

### Namespace: `proof`

#### `proof.get(collectionId: string, proofId: string): Promise<ProofResponse>`

Fetches a single proof by collection ID and proof ID.

- **Parameters:**
  - `collectionId` (`string`, required): The parent collection’s ID.
  - `proofId`      (`string`, required): The proof’s ID.
- **Returns:**  
  A `Promise` that resolves to a `ProofResponse` object:

  ```ts
  export interface ProofResponse {
    collectionId: string;
    createdAt: string;
    id: string;
    productId: string;
    tokenId: string;
    userId: string;
    values: Record<string, any>;
  }
  ```

- **Example:**
  ```ts
  const prf = await proof.get("abc123", "proof456");
  console.log("Fetched proof:", prf.id);
  ```

---

### Namespace: `appConfiguration`

#### `appConfiguration.get(collectionId: string, appId: string): Promise<AppConfigurationResponse>`

Fetches a single app configuration by collection ID and app ID.

- **Parameters:**
  - `collectionId` (`string`, required): The parent collection’s ID.
  - `appId`        (`string`, required): The app configuration’s ID.
- **Returns:**  
  A `Promise` that resolves to an `AppConfigurationResponse` object:

  ```ts
  export interface AppConfigurationResponse {
    id: string;
    name: string;
    settings?: Record<string, any>;
  }
  ```

- **Example:**
  ```ts
  const cfg = await appConfiguration.get("abc123", "app789");
  console.log("Fetched app configuration:", cfg.name);
  ```

---

## Error Handling

All methods throw an `Error` when the server responds with a non-2xx status. The thrown error message will include the numeric error code and message from the API. Example:

```ts
import { product } from "@proveanything/smartlinks";

async function fetchProduct() {
  try {
    await product.get("abc123", "invalidProdId");
  } catch (err) {
    // err.message might be: "Error 404: Not Found"
    console.error("Request failed:", err);
  }
}

fetchProduct();
```

---

## Types

You can import any of the response interfaces directly:

```ts
import {
  CollectionResponse,
  ProductResponse,
  ProofResponse,
  AppConfigurationResponse,
} from "@proveanything/smartlinks/types";
```

---

## Changelog

### 1.0.0

- Initial release:
  - `initializeApi` function to configure baseURL and auth.
  - Namespaced modules:
    - `collection.get(collectionId)`
    - `product.get(collectionId, productId)`
    - `proof.get(collectionId, proofId)`
    - `appConfiguration.get(collectionId, appId)`
  - Full TypeScript typings and JSDoc.
  - Browser/Node fetch support via `cross-fetch`.
  - Error handling via thrown `Error` objects.

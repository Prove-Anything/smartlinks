# @proveanything/smartlinks

An official JavaScript/TypeScript client SDK for the Smartlinks API. This package provides a simple wrapper around the Smartlinks REST endpoints, allowing you to fetch Collection, Product, and App Configuration data in both browser and Node.js environments.

## Installation

```bash
npm install @proveanything/smartlinks
# or
yarn add @proveanything/smartlinks
```

## Quickstart

```ts
import { ApiClient, CollectionResponse, ProductResponse } from "@proveanything/smartlinks";

async function main() {
  // Instantiate the client (no apiKey needed for public endpoints, but shown here for reference)
  const client = new ApiClient("https://smartlinks.app/api/v1", "YOUR_API_KEY_HERE");

  try {
    // Fetch a collection by ID
    const collection: CollectionResponse = await client.getCollection("abc123");
    console.log("Collection:", collection);

    // Fetch a product item by collection ID & product ID
    const product: ProductResponse = await client.getProductItem("abc123", "prod789");
    console.log("Product Item:", product);
  } catch (err) {
    console.error("Error fetching data:", err);
  }
}

main();
```

## API Reference

### Class: `ApiClient`

```ts
constructor(baseURL: string, apiKey?: string)
```

- **Parameters:**
  - `baseURL` (`string`, required): The root URL of the Smartlinks API, e.g. `https://smartlinks.app/api/v1`.  
  - `apiKey` (`string`, optional): Your Bearer token. If omitted, requests will be sent without an `Authorization` header.

---

#### `getCollection(collectionId: string): Promise<CollectionResponse>`

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
  const client = new ApiClient("https://smartlinks.app/api/v1", "YOUR_API_KEY");
  const collection = await client.getCollection("abc123");
  console.log("Fetched collection:", collection);
  ```

---

#### `getProductItem(collectionId: string, productId: string): Promise<ProductResponse>`

Fetches a single product item within a collection.

- **Parameters:**
  - `collectionId` (`string`, required): The parent collection’s ID.
  - `productId`   (`string`, required): The product item’s ID.
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
  const client = new ApiClient("https://smartlinks.app/api/v1", "YOUR_API_KEY");
  const product = await client.getProductItem("abc123", "prod789");
  console.log("Fetched product:", product);
  ```

---

#### `getAppConfiguration(collectionId: string, appId: string): Promise<AppConfigurationResponse>`

Fetches a single app configuration within a collection.

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
  const client = new ApiClient("https://smartlinks.app/api/v1", "YOUR_API_KEY");
  const config = await client.getAppConfiguration("abc123", "app456");
  console.log("Fetched app configuration:", config);
  ```

---

## Authentication

All endpoints require a Bearer token passed in the `AUTHORIZATION` header. When instantiating `ApiClient`, optionally supply your token:

```ts
import { ApiClient } from "@proveanything/smartlinks";

const apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
const client = new ApiClient("https://smartlinks.app/api/v1", apiKey);
```

If `apiKey` is omitted, requests will be sent without an `Authorization` header, which may cause a `401 Unauthorized` for protected endpoints.

## Error Handling

All methods throw an `Error` when the server responds with a non-2xx status. The thrown error message includes the numeric error code and message from the API. Example:

```ts
import { ApiClient } from "@proveanything/smartlinks";

async function fetchData() {
  const client = new ApiClient("https://smartlinks.app/api/v1", "INVALID_KEY");

  try {
    await client.getCollection("nonexistent");
  } catch (err) {
    // err.message might be: "Error 401: Unauthorized" or "Error 404: Not Found"
    console.error("Request failed:", err);
  }
}

fetchData();
```

## Examples

See the **examples/** folder for complete, runnable samples:

- [`examples/node-demo.ts`](examples/node-demo.ts)  
- [`examples/browser-demo.html`](examples/browser-demo.html)  
- [`examples/react-demo.tsx`](examples/react-demo.tsx)  

## OpenAPI Specification

This SDK is generated and maintained according to the [Smartlinks OpenAPI 3.0 specification](openapi.yaml).  
You can find the full API contract in [`openapi.yaml`](openapi.yaml) at the root of this package.

## Changelog

### 1.0.0

- Initial release:  
  - `ApiClient` class with `getCollection`, `getProductItem`, and `getAppConfiguration` methods.  
  - Full TypeScript typings and JSDoc.  
  - Browser/Node fetch support.  
  - Error handling via thrown `Error` objects.

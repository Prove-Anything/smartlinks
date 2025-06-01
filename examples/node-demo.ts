import { ApiClient, CollectionResponse, ProductResponse } from "../src/index";

async function main() {
  // You can provide either or both of these values:
  const apiKey = "YOUR_API_KEY"; // sent as X-API-Key header (optional)
  const bearerToken = "YOUR_BEARER_TOKEN"; // sent as AUTHORIZATION: Bearer ... (optional)

  // Example: with both headers
  const client = new ApiClient("https://smartlinks.app/api/v1", apiKey, bearerToken);

  try {
    const collection: CollectionResponse = await client.getCollection("abc123");
    console.log("Collection:", collection);

    const product: ProductResponse = await client.getProductItem("abc123", "prod789");
    console.log("Product Item:", product);
  } catch (err) {
    console.error("Error fetching data:", err);
  }
}

main();

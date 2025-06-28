import { initializeApi } from "../dist/index";
import { collection } from "../dist/api/collection";
import { product } from "../dist/api/product";
import { proof } from "../dist/api/proof";
import { batch } from "../dist/api/batch";

async function main() {
  const apiKey = "YOUR_API_KEY"; // optional
  const bearerToken = "YOUR_BEARER_TOKEN"; // optional

  initializeApi({
    baseURL: "https://smartlinks.app/api/v1",
    apiKey,
    bearerToken,
  });

  try {
    const collectionData = await collection.get("abc123");
    console.log("Collection:", collectionData);

    const productData = await product.get("abc123", "prod789");
    console.log("Product Item:", productData);

    const proofData = await proof.get("abc123", "proof456");
    console.log("Proof:", proofData);

    // Batch API examples
    // Admin operations (requires admin privileges)
    const batchList = await batch.list("abc123", "prod789");
    console.log("Batch List:", batchList);

    const newBatch = await batch.create("abc123", "prod789", {
      name: "New Batch",
      description: "Example batch creation",
      status: "active",
    });
    console.log("Created Batch:", newBatch);

    const batchData = await batch.get("abc123", "prod789", newBatch.id);
    console.log("Batch:", batchData);

    // Public batch endpoint (read-only)
    const publicBatchData = await batch.getPublic("abc123", "prod789", newBatch.id);
    console.log("Public Batch:", publicBatchData);
  } catch (err) {
    console.error("Error fetching data:", err);
  }
}

main();

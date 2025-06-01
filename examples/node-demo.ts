import { initializeApi } from "../dist/index";
import { collection } from "../dist/api/collection";
import { product } from "../dist/api/product";
import { proof } from "../dist/api/proof";

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
  } catch (err) {
    console.error("Error fetching data:", err);
  }
}

main();

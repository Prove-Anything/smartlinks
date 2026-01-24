// examples/node-demo.ts
// Node.js server-side usage examples for the Smartlinks SDK

import { initializeApi } from "../src/index";
import { auth } from "../src/api/auth";
import { collection } from "../src/api/collection";
import { product } from "../src/api/product";
import { proof } from "../src/api/proof";
import { batch } from "../src/api/batch";
import { actions } from "../src/api/actions";
import { broadcasts } from "../src/api/broadcasts";
import { contact } from "../src/api/contact";

async function main() {
  // Initialize SDK with API key for server-side usage
  initializeApi({
    baseURL: 'https://smartlinks.app/api/v1',
    apiKey: process.env.SMARTLINKS_API_KEY || 'your-api-key'
  })

  try {
    // Example 1: Authentication
    console.log('=== Authentication Example ===')
    // Note: Replace with real credentials
    // const loginResult = await auth.login('user@example.com', 'password')
    // console.log('Login successful:', loginResult.bearerToken ? 'Yes' : 'No')

    // Example 2: Working with Collections (public access)
    console.log('\n=== Collections Example ===')
    try {
      const collections = await collection.list(false) // Public endpoint
      console.log(`Found ${collections.length} collections`)
      
      if (collections.length > 0) {
        const firstCollection = collections[0]
        console.log(`First collection: ${firstCollection.title}`)
        
        // Get detailed collection info
        const collectionDetails = await collection.get(firstCollection.id, false)
        console.log(`Collection description: ${collectionDetails.description}`)

        // Get public contact schema for this collection
        const schema = await contact.publicGetSchema(firstCollection.id)
        console.log(`Schema v${schema.version}: core=${schema.fields.length}, custom=${schema.customFields.length}`)
        
        // Example 3: Working with Products
        console.log('\n=== Products Example ===')
        const products = await product.list(firstCollection.id, false)
        console.log(`Found ${products.length} products in collection`)
        
        if (products.length > 0) {
          const firstProduct = products[0]
          console.log(`First product: ${firstProduct.name}`)
          
          // Get product details
          const productDetails = await product.get(firstCollection.id, firstProduct.id, false)
          console.log(`Product ID: ${productDetails.id}`)
        }
      }
    } catch (error) {
      console.log('Note: This example requires valid collection IDs')
      console.log('Error details:', error.message)
    }

    // Example 4: Error Handling
    console.log('\n=== Error Handling Example ===')
    try {
      // Try to get a non-existent collection
      await collection.get('non-existent-collection', false)
    } catch (error) {
      console.log(`Expected error caught: ${error.message}`)
    }

    // Example 5: Analytics (admin)
    console.log('\n=== Analytics Example (admin) ===')
    try {
      // Replace with real collection and IDs, and ensure auth is configured
      const collectionId = 'your-collection-id'
      const recent = await actions.byUser(collectionId, { userId: 'user_123', limit: 10 })
      console.log(`Recent actions for user_123: ${recent.length}`)

      const counts = await actions.countsByOutcome(collectionId, { actionId: 'click', dedupeLatest: true })
      console.log('Outcome counts (latest per actor):', counts)

      const recipients = await broadcasts.recipientIds(collectionId, { broadcastId: 'br_456', idField: 'userId' })
      console.log('Broadcast recipients:', recipients.length)
    } catch (error) {
      console.log('Note: Admin analytics require valid credentials & IDs')
      console.log('Error details:', (error as any).message)
    }
  } catch (error) {
    console.error('Error in example:', error)
  }
}

// Run the examples
if (require.main === module) {
  main().then(() => {
    console.log('\n=== Examples completed ===')
    console.log('Note: For admin operations, authenticate first with auth.login()')
  }).catch(error => {
    console.error('Fatal error:', error)
  })
}

main();

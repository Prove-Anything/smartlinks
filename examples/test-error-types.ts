// Test file to verify SmartlinksApiError is properly exported and works
import { SmartlinksApiError, initializeApi, collection } from '../src/index'

async function testErrorHandling() {
  initializeApi({
    baseURL: 'https://smartlinks.app/api/v1',
  })

  try {
    // This should fail with auth error or similar
    const result = await collection.list(true)
    console.log('Success:', result)
  } catch (error) {
    // Verify error is SmartlinksApiError
    if (error instanceof SmartlinksApiError) {
      console.log('✓ Error is SmartlinksApiError')
      console.log('  statusCode:', error.statusCode)
      console.log('  code:', error.code)
      console.log('  message:', error.message)
      console.log('  isAuthError:', error.isAuthError())
      console.log('  isServerError:', error.isServerError())
      console.log('  toJSON:', JSON.stringify(error.toJSON(), null, 2))
    } else {
      console.error('✗ Error is not SmartlinksApiError:', error)
    }
  }
}

// Export for potential use
export { testErrorHandling }

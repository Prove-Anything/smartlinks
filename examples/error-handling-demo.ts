// examples/error-handling-demo.ts
/**
 * Demonstrates best practices for error handling with the Smartlinks SDK.
 * 
 * The SDK now throws SmartlinksApiError for all HTTP errors, providing:
 * - HTTP status code
 * - Server error code and message
 * - Additional error details from the server
 * - Convenient helper methods for error classification
 */

import { initializeApi, collection, product, auth, SmartlinksApiError } from '@proveanything/smartlinks'

// Initialize the SDK
initializeApi({
  baseURL: 'https://smartlinks.app/api/v1',
  apiKey: process.env.SMARTLINKS_API_KEY,
})

/**
 * Example 1: Basic error handling with type checking
 */
async function basicErrorHandling() {
  try {
    const collections = await collection.list(false)
    console.log('Collections:', collections)
  } catch (error) {
    // Check if it's a SmartlinksApiError
    if (error instanceof SmartlinksApiError) {
      console.error('API Error:', {
        message: error.message,
        statusCode: error.statusCode,        // HTTP status (400, 401, 500)
        code: error.code,                    // Same as statusCode
        errorCode: error.errorCode,          // Server error code ("NOT_AUTHORIZED", etc.)
        details: error.details,              // Additional server details
        url: error.url,
      })
    } else {
      // Handle unexpected errors (network issues, etc.)
      console.error('Unexpected error:', error)
    }
    }
  }
}

/**
 * Example 2: Handling specific error types with helper methods
 */
async function handleSpecificErrors() {
  try {
    const item = await product.get('collectionId', 'productId', false)
    console.log('Product:', item)
  } catch (error) {
    if (error instanceof SmartlinksApiError) {
      // Authentication errors (401, 403)
      if (error.isAuthError()) {
        console.error('Authentication failed. Please log in again.')
        // Redirect to login page or refresh token
        return
      }

      // Not found (404)
      if (error.isNotFound()) {
        console.error('Product not found')
        // Show user-friendly message
        return
      }

      // Rate limiting (429)
      if (error.isRateLimited()) {
        console.error('Rate limit exceeded. Please try again later.')
        // Implement retry logic with backoff
        return
      }

      // Client errors (4xx)
      if (error.isClientError()) {
        console.error('Invalid request:', error.message)
        // Log for debugging, show validation errors to user
        return
      }

      // Server errors (5xx)
      if (error.isServerError()) {
        console.error('Server error. Please try again later.')
        // Retry or notify monitoring service
        return
      }
    }
  }
}

/**
 * Example 3: Extracting and handling validation errors
 */
async function handleValidationErrors() {
  try {
    await product.create('collectionId', {
      name: '', // Invalid: empty name
    })
  } catch (error) {
    if (error instanceof SmartlinksApiError) {
      // Check for 400 Bad Request with validation details
      if (error.statusCode === 400 && error.details) {
        console.error('Validation errors:')
        // Server might return field-specific errors in details
        Object.entries(error.details).forEach(([field, message]) => {
          console.error(`  ${field}: ${message}`)
        })
      } else {
        console.error('Error:', error.message)
      }
    }
  }
}

/**
 * Example 4: Retry logic for transient errors
 */
async function retryOnTransientErrors<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: Error | undefined

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error as Error

      // Only retry on server errors or rate limiting
      if (error instanceof SmartlinksApiError) {
        const shouldRetry = error.isServerError() || error.isRateLimited()
        
        if (!shouldRetry || attempt === maxRetries - 1) {
          throw error
        }

        // Exponential backoff
        const delay = delayMs * Math.pow(2, attempt)
        console.log(`Attempt ${attempt + 1} failed. Retrying in ${delay}ms...`)
        await new Promise(resolve => setTimeout(resolve, delay))
      } else {
        // Don't retry non-API errors
        throw error
      }
    }
  }

  throw lastError
}

/**
 * Example 5: Using retry logic
 */
async function fetchWithRetry() {
  try {
    const collections = await retryOnTransientErrors(
      () => collection.list(false),
      3, // max retries
      1000 // initial delay
    )
    console.log('Collections:', collections)
  } catch (error) {
    if (error instanceof SmartlinksApiError) {
      console.error('Failed after retries:', error.toJSON())
    } else {
      console.error('Unexpected error:', error)
    }
  }
}

/**
 * Example 6: Authentication error handling with auto-refresh
 */
async function handleAuthWithRefresh() {
  let bearerToken = localStorage.getItem('bearerToken')

  async function makeAuthenticatedRequest() {
    try {
      // Verify token is still valid
      const verified = await auth.verifyToken(bearerToken || undefined)
      
      if (!verified.valid) {
        // Token expired, need to re-authenticate
        throw new Error('Token expired')
      }

      // Make authenticated request
      const collections = await collection.list(true) // admin endpoint
      return collections
    } catch (error) {
      if (error instanceof SmartlinksApiError && error.isAuthError()) {
        // Clear invalid token
        localStorage.removeItem('bearerToken')
        auth.logout()
        
        // Redirect to login or show login modal
        console.error('Please log in again')
        throw error
      }
      throw error
    }
  }

  try {
    const result = await makeAuthenticatedRequest()
    console.log('Result:', result)
  } catch (error) {
    console.error('Authentication failed:', error)
  }
}

/**
 * Example 7: Logging errors for monitoring
 */
function logErrorToMonitoring(error: unknown) {
  if (error instanceof SmartlinksApiError) {
    // Send structured error data to monitoring service
    const errorData = error.toJSON()
    console.log('Logging to monitoring service:', errorData)
    
    // Example: Send to error tracking service
    // Sentry.captureException(error, { extra: errorData })
    // or
    // bugsnag.notify(error, { metaData: errorData })
  } else {
    console.error('Non-API error:', error)
  }
}

/**
 * Example 8: Handling specific error codes from the server
 */
async function handleSpecificErrorCodes() {
  try {
    await auth.login('user@example.com', 'wrongpassword')
  } catch (error) {
    if (error instanceof SmartlinksApiError) {
      // Check the server-specific error code
      switch (error.errorCode) {
        case 'NOT_AUTHORIZED':
          console.error('Invalid credentials. Please try again.')
          break
        case 'broadcasts.topic.invalid':
          console.error('The broadcast topic is invalid.')
          break
        case 'sendgrid.provision.failed':
          console.error('Email service configuration error.')
          break
        default:
          // Fall back to HTTP status code for unknown error codes
          if (error.isAuthError()) {
            console.error('Authentication failed:', error.message)
          } else {
            console.error('Error:', error.message)
          }
      }
    }
  }
}

/**
 * Example 9: User-friendly error messages
 */
function getUserFriendlyMessage(error: unknown): string {
  if (!(error instanceof SmartlinksApiError)) {
    return 'An unexpected error occurred. Please try again.'
  }

  // Check for specific error codes first
  if (error.errorCode) {
    switch (error.errorCode) {
      case 'NOT_AUTHORIZED':
        return 'Invalid credentials. Please check your email and password.'
      case 'broadcasts.topic.invalid':
        return 'The broadcast topic you selected is invalid.'
      case 'sendgrid.provision.failed':
        return 'Email service error. Please contact support.'
    }
  }

  // Fall back to HTTP status code
  switch (error.statusCode) {
    case 400:
      return 'Invalid request. Please check your input and try again.'
    case 401:
      return 'You are not logged in. Please log in to continue.'
    case 403:
      return 'You do not have permission to perform this action.'
    case 404:
      return 'The requested resource was not found.'
    case 429:
      return 'Too many requests. Please wait a moment and try again.'
    case 500:
    case 502:
    case 503:
      return 'Server error. Please try again later.'
    default:
      return error.message || 'An error occurred. Please try again.'
  }
}

// Run examples
async function main() {
  console.log('=== Error Handling Examples ===\n')

  try {
    await handleSpecificErrors()
  } catch (error) {
    const message = getUserFriendlyMessage(error)
    console.log('User message:', message)
    logErrorToMonitoring(error)
  }
}

// Uncomment to run:
// main().catch(console.error)

export {
  basicErrorHandling,
  handleSpecificErrors,
  handleValidationErrors,
  retryOnTransientErrors,
  fetchWithRetry,
  handleAuthWithRefresh,
  handleSpecificErrorCodes,
  logErrorToMonitoring,
  getUserFriendlyMessage,
}

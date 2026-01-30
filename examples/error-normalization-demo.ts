// examples/error-normalization-demo.ts
/**
 * Demonstrates how the SDK normalizes various server error response formats
 * into a consistent SmartlinksApiError structure.
 * 
 * Server error formats handled:
 * 1. { errorText: "...", errorCode: "..." }
 * 2. { error: '...', message: '...' }
 * 3. { ok: false, error: '...' }
 * 4. { error: '...' }
 * 5. { code: number, message: string } (standard format)
 * 
 * All formats are normalized to provide consistent access via SmartlinksApiError
 */

import { SmartlinksApiError } from '../src/types/error'

/**
 * Example server responses and how they're normalized
 */
const serverErrorExamples = [
  {
    name: 'Format 1: errorText + errorCode',
    serverResponse: {
      errorText: "Not Authorized",
      errorCode: "NOT_AUTHORIZED"
    },
    statusCode: 400,
    expected: {
      message: "Not Authorized",
      code: 400,
      details: {
        errorCode: "NOT_AUTHORIZED",
        errorText: "Not Authorized"
      }
    }
  },
  {
    name: 'Format 2: error + message',
    serverResponse: {
      error: 'broadcasts.topic.invalid',
      message: 'Topic must be one of COM settings topics'
    },
    statusCode: 400,
    expected: {
      message: "Topic must be one of COM settings topics",
      code: 400,
      details: {
        error: "broadcasts.topic.invalid"
      }
    }
  },
  {
    name: 'Format 3: ok + error with message',
    serverResponse: {
      ok: false,
      error: 'sendgrid.provision.failed'
    },
    statusCode: 400,
    expected: {
      message: "sendgrid.provision.failed",
      code: 400,
      details: {
        ok: false
      }
    }
  },
  {
    name: 'Format 4: Just error field',
    serverResponse: {
      error: 'broadcasts.manual.segment.missing'
    },
    statusCode: 400,
    expected: {
      message: "broadcasts.manual.segment.missing",
      code: 400,
      details: {}
    }
  },
  {
    name: 'Format 5: Standard code + message',
    serverResponse: {
      code: 404,
      message: 'Resource not found'
    },
    statusCode: 404,
    expected: {
      message: "Resource not found",
      code: 404,
      details: {}
    }
  },
  {
    name: 'Format 6: Complex error with additional fields',
    serverResponse: {
      error: 'validation.failed',
      message: 'Validation failed',
      fields: {
        email: 'Invalid email format',
        name: 'Name is required'
      },
      timestamp: '2026-01-30T12:00:00Z'
    },
    statusCode: 422,
    expected: {
      message: "Validation failed",
      code: 422,
      details: {
        error: "validation.failed",
        fields: {
          email: 'Invalid email format',
          name: 'Name is required'
        },
        timestamp: '2026-01-30T12:00:00Z'
      }
    }
  }
]

/**
 * Usage examples showing how to access normalized error data
 */
console.log('=== Error Normalization Examples ===\n')

serverErrorExamples.forEach((example, index) => {
  console.log(`Example ${index + 1}: ${example.name}`)
  console.log('Server Response:', JSON.stringify(example.serverResponse, null, 2))
  console.log('After Normalization:')
  console.log('  - message:', example.expected.message)
  console.log('  - code:', example.expected.code)
  console.log('  - details:', JSON.stringify(example.expected.details, null, 2))
  console.log()
})

/**
 * Example: Handling different error formats in application code
 */
function handleApiError(error: unknown) {
  if (error instanceof SmartlinksApiError) {
    console.log('Error Message:', error.message)
    console.log('HTTP Status:', error.statusCode)
    console.log('Error Code:', error.code)
    
    // Access additional details that may contain server-specific error codes
    if (error.details) {
      // Check for various error code formats
      const serverErrorCode = 
        error.details.errorCode ||  // Format 1
        error.details.error ||      // Formats 2, 3, 4
        null
      
      if (serverErrorCode) {
        console.log('Server Error Code:', serverErrorCode)
        
        // Handle specific error codes
        switch (serverErrorCode) {
          case 'NOT_AUTHORIZED':
            console.log('→ Action: Redirect to login')
            break
          case 'broadcasts.topic.invalid':
            console.log('→ Action: Show topic selection UI')
            break
          case 'sendgrid.provision.failed':
            console.log('→ Action: Retry with backoff or show error to admin')
            break
          case 'broadcasts.manual.segment.missing':
            console.log('→ Action: Prompt user to select a segment')
            break
          case 'validation.failed':
            // Access field-specific validation errors
            if (error.details.fields) {
              console.log('→ Action: Show field-specific errors:')
              Object.entries(error.details.fields).forEach(([field, msg]) => {
                console.log(`   ${field}: ${msg}`)
              })
            }
            break
        }
      }
      
      // Access any other details
      console.log('All Details:', JSON.stringify(error.details, null, 2))
    }
  }
}

/**
 * Example: Pattern matching on both status codes and server error codes
 */
function categorizeError(error: unknown): string {
  if (!(error instanceof SmartlinksApiError)) {
    return 'unknown'
  }

  // First check by HTTP status
  if (error.isAuthError()) {
    return 'auth'
  }
  
  if (error.isNotFound()) {
    return 'not_found'
  }

  // Then check by server error code if available
  const serverCode = error.details?.errorCode || error.details?.error
  
  if (serverCode) {
    // Map server error codes to categories
    if (serverCode.includes('authorize') || serverCode.includes('auth')) {
      return 'auth'
    }
    if (serverCode.includes('validation') || serverCode.includes('invalid')) {
      return 'validation'
    }
    if (serverCode.includes('provision') || serverCode.includes('failed')) {
      return 'service_error'
    }
    if (serverCode.includes('missing') || serverCode.includes('required')) {
      return 'missing_data'
    }
  }

  // Fall back to status code categories
  if (error.isClientError()) {
    return 'client_error'
  }
  if (error.isServerError()) {
    return 'server_error'
  }

  return 'unknown'
}

/**
 * Example: Creating user-friendly messages based on normalized errors
 */
function getUserMessage(error: unknown): string {
  if (!(error instanceof SmartlinksApiError)) {
    return 'An unexpected error occurred. Please try again.'
  }

  const category = categorizeError(error)
  const serverCode = error.details?.errorCode || error.details?.error

  // Provide specific messages for known error codes
  if (serverCode) {
    const specificMessages: Record<string, string> = {
      'NOT_AUTHORIZED': 'You are not authorized to perform this action. Please log in.',
      'broadcasts.topic.invalid': 'Invalid communication topic selected. Please choose a valid topic.',
      'sendgrid.provision.failed': 'Email service configuration failed. Please contact support.',
      'broadcasts.manual.segment.missing': 'Please select a segment before sending the broadcast.',
      'validation.failed': 'Please correct the errors in the form and try again.',
    }

    if (specificMessages[serverCode]) {
      return specificMessages[serverCode]
    }
  }

  // Fall back to generic messages by category
  switch (category) {
    case 'auth':
      return 'Authentication required. Please log in to continue.'
    case 'not_found':
      return 'The requested resource was not found.'
    case 'validation':
      return 'Please check your input and try again.'
    case 'service_error':
      return 'A service error occurred. Please try again later.'
    case 'missing_data':
      return 'Required information is missing. Please complete all required fields.'
    case 'server_error':
      return 'Server error. Please try again later.'
    default:
      return error.message || 'An error occurred. Please try again.'
  }
}

/**
 * Example: Logging errors for monitoring with normalized data
 */
function logErrorForMonitoring(error: unknown, context?: Record<string, any>) {
  if (error instanceof SmartlinksApiError) {
    const logData = {
      timestamp: new Date().toISOString(),
      error: {
        message: error.message,
        statusCode: error.statusCode,
        code: error.code,
        url: error.url,
        details: error.details,
        category: categorizeError(error),
      },
      context,
    }

    // In production, send to logging service
    console.log('[ERROR]', JSON.stringify(logData, null, 2))
    
    // Example: Send to monitoring service
    // Sentry.captureException(error, {
    //   extra: logData,
    //   tags: {
    //     statusCode: error.statusCode,
    //     category: logData.error.category,
    //     serverErrorCode: error.details?.errorCode || error.details?.error,
    //   }
    // })
  }
}

// Export functions for use
export {
  handleApiError,
  categorizeError,
  getUserMessage,
  logErrorForMonitoring,
}

// examples/conditions-demo.ts
// Demonstrates the condition validation utility

import { utils } from '../src/index'

async function runConditionExamples() {
  console.log('=== Smartlinks Condition Validation Examples ===\n')

  // Example 1: Country-based condition with regions
  console.log('1. Country condition (EU region)')
  const euCheck = await utils.validateCondition({
    condition: {
      type: 'and',
      conditions: [{
        type: 'country',
        useRegions: true,
        regions: ['eu'],
        contains: true
      }]
    },
    user: { 
      valid: true, 
      location: { country: 'DE' } // Germany is in EU
    }
  })
  console.log('   User in Germany, EU region check:', euCheck) // true
  console.log()

  // Example 2: Device/platform condition
  console.log('2. Device condition (mobile only)')
  const mobileCheck = await utils.validateCondition({
    condition: {
      type: 'and',
      conditions: [{
        type: 'device',
        displays: ['mobile', 'ios'],
        contains: true
      }]
    },
    stats: {
      mobile: true,
      platform: { ios: true }
    }
  })
  console.log('   iOS mobile device check:', mobileCheck) // true
  console.log()

  // Example 3: User authentication condition
  console.log('3. User condition (logged in users)')
  const loggedInCheck = await utils.validateCondition({
    condition: {
      type: 'and',
      conditions: [{
        type: 'user',
        userType: 'valid'
      }]
    },
    user: { valid: true, uid: 'user123' }
  })
  console.log('   User logged in check:', loggedInCheck) // true
  console.log()

  // Example 4: Date range condition
  console.log('4. Date condition (campaign period)')
  const dateCheck = await utils.validateCondition({
    condition: {
      type: 'and',
      conditions: [{
        type: 'date',
        dateTest: 'between',
        rangeDate: ['2026-01-01', '2026-12-31']
      }]
    }
  })
  console.log('   Date in 2026 campaign period:', dateCheck) // true (if run in 2026)
  console.log()

  // Example 5: Product-specific condition
  console.log('5. Product condition (specific products)')
  const productCheck = await utils.validateCondition({
    condition: {
      type: 'and',
      conditions: [{
        type: 'product',
        productIds: ['prod-123', 'prod-456'],
        contains: true
      }]
    },
    product: { id: 'prod-123' }
  })
  console.log('   Product ID in allowed list:', productCheck) // true
  console.log()

  // Example 6: Tag-based condition
  console.log('6. Tag condition (premium products)')
  const tagCheck = await utils.validateCondition({
    condition: {
      type: 'and',
      conditions: [{
        type: 'tag',
        tags: ['premium', 'featured'],
        contains: true
      }]
    },
    product: { 
      id: 'prod-123',
      tags: { premium: true, sale: false }
    }
  })
  console.log('   Product has premium tag:', tagCheck) // true
  console.log()

  // Example 7: Item status condition
  console.log('7. Item status condition (claimable proof)')
  const statusCheck = await utils.validateCondition({
    condition: {
      type: 'and',
      conditions: [{
        type: 'itemStatus',
        statusType: 'isClaimable'
      }]
    },
    proof: { 
      id: 'proof-123',
      claimable: true,
      virtual: false
    }
  })
  console.log('   Proof is claimable:', statusCheck) // true
  console.log()

  // Example 8: Combined AND conditions
  console.log('8. Combined AND conditions (mobile + logged in + EU)')
  const combinedAndCheck = await utils.validateCondition({
    condition: {
      type: 'and',
      conditions: [
        { type: 'user', userType: 'valid' },
        { type: 'device', displays: ['mobile'], contains: true },
        { type: 'country', useRegions: true, regions: ['eu'], contains: true }
      ]
    },
    user: { valid: true, uid: 'user123', location: { country: 'FR' } },
    stats: { mobile: true }
  })
  console.log('   All conditions pass:', combinedAndCheck) // true
  console.log()

  // Example 9: Combined OR conditions
  console.log('9. Combined OR conditions (admin OR premium product)')
  const combinedOrCheck = await utils.validateCondition({
    condition: {
      type: 'or',
      conditions: [
        { type: 'user', userType: 'admin' },
        { type: 'tag', tags: ['premium'], contains: true }
      ]
    },
    user: { valid: true, uid: 'user456' }, // not admin
    collection: { id: 'col1', roles: {} },
    product: { id: 'prod-789', tags: { premium: true } } // but premium product
  })
  console.log('   At least one condition passes:', combinedOrCheck) // true
  console.log()

  // Example 10: Value comparison condition
  console.log('10. Value comparison (inventory check)')
  const valueCheck = await utils.validateCondition({
    condition: {
      type: 'and',
      conditions: [{
        type: 'value',
        field: 'product.inventory.quantity',
        fieldType: 'integer',
        validationType: 'greater',
        value: 10
      }]
    },
    product: { 
      id: 'prod-123',
      inventory: { quantity: 25 }
    }
  })
  console.log('   Product inventory > 10:', valueCheck) // true
  console.log()

  // Example 11: Geofence condition
  console.log('11. Geofence condition (bounding box)')
  const geofenceCheck = await utils.validateCondition({
    condition: {
      type: 'and',
      conditions: [{
        type: 'geofence',
        top: 50.0,    // North
        bottom: 40.0, // South
        left: -10.0,  // West
        right: 5.0,   // East
        contains: true
      }]
    },
    user: { 
      valid: true,
      location: { latitude: 45.0, longitude: 0.0 } // Center of France
    }
  })
  console.log('   Location inside geofence:', geofenceCheck) // true
  console.log()

  // Example 12: Version condition (A/B testing)
  console.log('12. Version condition (A/B test)')
  const versionCheck = await utils.validateCondition({
    condition: {
      type: 'and',
      conditions: [{
        type: 'version',
        versions: ['v2', 'v3'],
        contains: true
      }]
    },
    stats: { version: 'v2' }
  })
  console.log('   User in test version group:', versionCheck) // true
  console.log()

  // Example 13: Owner-only content
  console.log('13. Owner condition (proof ownership)')
  const ownerCheck = await utils.validateCondition({
    condition: {
      type: 'and',
      conditions: [{
        type: 'user',
        userType: 'owner'
      }]
    },
    user: { valid: true, uid: 'user123' },
    proof: { id: 'proof-456', userId: 'user123' }
  })
  console.log('   User owns the proof:', ownerCheck) // true
  console.log()

  // Example 14: Failed AND condition (one fails)
  console.log('14. Failed AND condition (mobile required but desktop)')
  const failedAndCheck = await utils.validateCondition({
    condition: {
      type: 'and',
      conditions: [
        { type: 'user', userType: 'valid' }, // passes
        { type: 'device', displays: ['mobile'], contains: true } // fails
      ]
    },
    user: { valid: true, uid: 'user123' },
    stats: { mobile: false } // desktop
  })
  console.log('   All conditions pass:', failedAndCheck) // false
  console.log()

  // Example 15: Complex real-world scenario
  console.log('15. Complex scenario (premium mobile campaign in EU)')
  const complexCheck = await utils.validateCondition({
    condition: {
      type: 'and',
      conditions: [
        {
          type: 'or',
          conditions: [
            { type: 'user', userType: 'admin' },
            { 
              type: 'and',
              conditions: [
                { type: 'user', userType: 'valid' },
                { type: 'tag', tags: ['premium'], contains: true }
              ]
            }
          ]
        },
        { type: 'device', displays: ['mobile'], contains: true },
        { type: 'country', useRegions: true, regions: ['eu'], contains: true },
        { 
          type: 'date', 
          dateTest: 'between',
          rangeDate: ['2026-01-01', '2026-12-31']
        }
      ]
    },
    user: { valid: true, uid: 'user123', location: { country: 'DE' } },
    product: { id: 'prod-premium', tags: { premium: true } },
    stats: { mobile: true },
    collection: { id: 'col1', roles: {} }
  })
  console.log('   Complex campaign check passes:', complexCheck) // true
  console.log()

  console.log('=== All examples completed ===')
}

// Run if executed directly
if (require.main === module) {
  runConditionExamples().catch(console.error)
}

export { runConditionExamples }

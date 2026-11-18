import { test } from 'node:test'
import assert from 'node:assert/strict'
import { validateCondition } from '../src/utils/conditions'

// Saved conditions: a condition named by id is loaded (the caller's loader, else the public API), and a
// switched-off one passes for everyone.

const country = (countries: string[]) => ({ type: 'and' as const, conditions: [{ type: 'country' as const, countries, contains: true }] })
const where = { location: { country: 'FR' } }

test('a saved condition is loaded by id through the caller\'s loader', async () => {
  let asked = ''
  const ok = await validateCondition({
    conditionId: 'uk-only-1', collection: { id: 'c1' }, user: { valid: false, ...where },
    fetchCondition: async (cid, id) => { asked = `${cid}/${id}`; return country(['GB']) },
  } as any)
  assert.equal(asked, 'c1/uk-only-1')
  assert.equal(ok, false)
})

test('a switched-off condition passes for everyone', async () => {
  const ok = await validateCondition({ condition: { ...country(['GB']), disabled: true }, user: { valid: false, ...where } } as any)
  assert.equal(ok, true)
})

test('a saved condition that can\'t be loaded passes, as before', async () => {
  const ok = await validateCondition({ conditionId: 'missing-2', collection: { id: 'c1' }, fetchCondition: async () => null } as any)
  assert.equal(ok, true)
})

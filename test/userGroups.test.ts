import { test } from 'node:test'
import assert from 'node:assert/strict'
import { validateCondition } from '../src/utils/conditions'
import { createFunctionTestContext } from '../src/testing'

// User groups in the SDK: the `group` condition checks real membership (it used to pass anyone who had
// ANY groups), and the function test context carries the caller's user groups.

const group = (extra: Record<string, any>) => ({ type: 'and' as const, conditions: [{ type: 'user' as const, userType: 'group' as const, ...extra }] })
const check = (condition: any, user: any) => validateCondition({ condition, user } as any)

test('group condition: passes for a member of one of the named user groups (by key)', async () => {
  assert.equal(await check(group({ groupIds: ['qc-controller', 'manager'] }), { valid: true, uid: 'u1', groups: ['warehouse', 'manager'] }), true)
})

test('group condition: fails for someone in other user groups only', async () => {
  assert.equal(await check(group({ groupIds: ['qc-controller'] }), { valid: true, uid: 'u1', groups: ['warehouse'] }), false)
})

test('group condition: matches by id too, and accepts the single groupId form', async () => {
  assert.equal(await check(group({ groupIds: ['k3JdAbc'] }), { valid: true, uid: 'u1', groups: ['qc-controller', 'k3JdAbc'] }), true)
  assert.equal(await check(group({ groupId: 'qc-controller' }), { valid: true, uid: 'u1', groups: ['qc-controller'] }), true)
})

test('group condition: nobody passes when signed out, with no user groups, or when none is named', async () => {
  assert.equal(await check(group({ groupIds: ['qc-controller'] }), { valid: false, groups: ['qc-controller'] }), false)
  assert.equal(await check(group({ groupIds: ['qc-controller'] }), { valid: true, uid: 'u1' }), false)
  assert.equal(await check(group({}), { valid: true, uid: 'u1', groups: ['qc-controller'] }), false)
})

test('function test context: ctx.caller.userGroups is what the test says, and [] by default', () => {
  const def = { trigger: { type: 'http' as const }, capabilities: [] }
  const ctx = createFunctionTestContext({ def, caller: { userId: 'sam', userGroups: ['qc-controller'] } })
  assert.deepEqual([...ctx.caller.userGroups], ['qc-controller'])
  assert.throws(() => { (ctx.caller.userGroups as string[]).push('manager') })
  assert.deepEqual([...createFunctionTestContext({ def }).caller.userGroups], [])
})

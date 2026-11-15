// smartlinks-doctor warns on keyed app data (being retired: docs/admin-lists-and-pickers.md).

import { test } from 'node:test'
import assert from 'node:assert'
import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'

const importESM = new Function('u', 'return import(u)') as (u: string) => Promise<{ keyedAppDataCalls(code: string): string[] }>
const load = importESM(pathToFileURL(resolve(__dirname, '../scripts/lib/keyed-app-data.mjs')).href)

test('finds keyed app data calls in the browser SDK and in server code', async () => {
  const { keyedAppDataCalls } = await load
  assert.deepEqual(keyedAppDataCalls('await SL.appConfiguration.setDataItem({ appId, collectionId, data })'), ['setDataItem'])
  assert.deepEqual(keyedAppDataCalls('const all = await SL.appConfiguration.getData({ appId, collectionId })'), ['appConfiguration.getData'])
  assert.deepEqual(keyedAppDataCalls('await ctx.sl.appData.setData({ id, kind: "machine" }); const rows = await ctx.sl.appData.collection.getData()'), ['appData.getData', 'appData.setData'])
  assert.deepEqual(keyedAppDataCalls('ctx.sl.appData.delete({ dataId: id })'), ['appData.delete'])
})

test('the settings blob and comments are not keyed data', async () => {
  const { keyedAppDataCalls } = await load
  assert.deepEqual(keyedAppDataCalls('await SL.appConfiguration.getConfig({ appId }); await ctx.sl.appData.set({ rates }); ctx.sl.appData.delete()'), [])
  assert.deepEqual(keyedAppDataCalls('// we used to call setDataItem( here\n/* appData.setData( */ const x = 1'), [])
})

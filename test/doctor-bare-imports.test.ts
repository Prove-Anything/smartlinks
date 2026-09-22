// Regression tests for the smartlinks-doctor import scanner. The historical bug:
// text-scanning a minified bundle matched the word `from` inside library DATA (e.g.
// tailwind-merge's class map) as if it were an import. bareImportsOf now lexes real
// import statements, so data can't produce false positives.

import { test } from 'node:test'
import assert from 'node:assert'
import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'

// bare-imports.mjs is a real ESM module (top-level await); this test file compiles to
// CJS, which would down-level `import()` to `require()` (can't load ESM). Wrap it in a
// Function so TypeScript emits a genuine dynamic import.
const importESM = new Function('u', 'return import(u)') as (u: string) => Promise<{
  bareImportsOf(code: string): string[]
}>
const load = importESM(pathToFileURL(resolve(__dirname, '../scripts/lib/bare-imports.mjs')).href)

test('ignores tailwind-merge class-map data that looks like `from "x"`', async () => {
  const { bareImportsOf } = await load
  const code = 'const map={"gradient-from":[{from:"value"}],"gradient-via":[{via:"value"}],"gradient-to":[{to:"value"}]};export const x=1;'
  assert.deepEqual(bareImportsOf(code), [])
})

test('ignores a class field literally named `from`', async () => {
  const { bareImportsOf } = await load
  assert.deepEqual(bareImportsOf('export class Foo{from="bar"}'), [])
})

test('ignores object literals like ({from:"lodash"})', async () => {
  const { bareImportsOf } = await load
  assert.deepEqual(bareImportsOf('const o=({from:"lodash"});export{o}'), [])
})

test('extracts genuine static, re-export, and dynamic imports', async () => {
  const { bareImportsOf } = await load
  const code = 'import React from"react";export{y}from"clsx";const p=import("date-fns");'
  const specs = bareImportsOf(code)
  assert.deepEqual(new Set(specs), new Set(['react', 'clsx', 'date-fns']))
})

test('drops relative / URL specifiers, keeps node: for the caller to flag', async () => {
  const { bareImportsOf } = await load
  const code = 'import"./local";import"https://cdn.example/x.js";import"node:fs";'
  assert.deepEqual(bareImportsOf(code), ['node:fs'])
})

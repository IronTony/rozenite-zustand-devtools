const assert = require('node:assert/strict');
const { existsSync, readFileSync } = require('node:fs');
const path = require('node:path');
const test = require('node:test');

test('the Rozenite manifest points to the built DevTools panel', () => {
  const dist = path.resolve(__dirname, '../dist');
  const manifest = JSON.parse(readFileSync(path.join(dist, 'rozenite.json'), 'utf8'));
  assert.equal(manifest.name, 'rozenite-zustand-devtools');
  assert.ok(manifest.integrations.includes('react-native'));
  assert.equal(manifest.panels.length, 1);
  assert.ok(existsSync(path.join(dist, manifest.panels[0].source)));
});

test('both bundle formats contain the lazy React Native implementation', () => {
  for (const subdir of ['', 'cjs']) {
    const file = path.resolve(
      __dirname,
      '../dist/react-native',
      subdir,
      'src/useZustandDevToolsNative.js',
    );
    assert.ok(existsSync(file), file);
  }
});

test('public CommonJS and ESM entry points are no-ops on Node', async () => {
  const commonJS = require('rozenite-zustand-devtools');
  const esm = await import('rozenite-zustand-devtools');
  assert.equal(commonJS.useZustandDevTools([]), undefined);
  assert.equal(esm.useZustandDevTools([]), undefined);
});

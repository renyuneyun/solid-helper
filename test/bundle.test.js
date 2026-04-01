import assert from 'node:assert';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { writeFileSync, unlinkSync } from 'node:fs';
import { rollup } from 'rollup';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';

/**
 * Bundles dist/solid-helper.js together with all its node_modules dependencies
 * (no nodeExternals — simulating what a consumer Vite/Rollup app does), then
 * loads the resulting CJS bundle in Node.js.
 *
 * Fatal circular dependencies (e.g. the Comunica jsonld-streaming-parser chain)
 * throw a TypeError during module initialization and will fail this test.
 * Benign circular dependencies (which Rollup resolves correctly) pass silently.
 *
 * Run with: npm run test-bundle  (builds first, then runs this test)
 */
describe('Bundle load test', function () {
  this.timeout(120_000);

  it('bundled output loads without error (no fatal circular deps)', async function () {
    const bundle = await rollup({
      input: new URL('../dist/solid-helper.js', import.meta.url).pathname,
      plugins: [
        nodeResolve({ browser: true }),
        commonjs(),
        json(),
      ],
      onwarn(warning, defaultHandler) {
        // Suppress expected benign warnings from node-resolve plugin
        if (warning.code === 'PREFER_NAMED_EXPORTS') return;
        if (warning.code === 'CIRCULAR_DEPENDENCY') return;
        if (warning.plugin === 'node-resolve') return;
        defaultHandler(warning);
      },
    });

    const { output } = await bundle.generate({ format: 'cjs' });
    const code = output[0].code;

    // Write to a temp file and require() it.
    // Fatal circular deps will throw TypeError during loading;
    // benign ones (n3's internal cycles, readable-stream) won't.
    const tmpFile = join(tmpdir(), `solid-helper-bundle-${Date.now()}.cjs`);
    writeFileSync(tmpFile, code);
    try {
      createRequire(import.meta.url)(tmpFile);
    } catch (e) {
      assert.fail(
        `Bundle crashed during module initialization (${e.constructor.name}: ${e.message}).\n` +
        `This usually means a dependency has a fatal circular CommonJS dependency chain\n` +
        `(module A tries to use an export from module B before B has finished loading,\n` +
        `because B is waiting for A). Check recently added or updated dependencies.\n` +
        `To reproduce manually: node -e "require('./dist/solid-helper.umd.cjs')"`
      );
    } finally {
      try { unlinkSync(tmpFile); } catch (_) {}
    }
  });
});

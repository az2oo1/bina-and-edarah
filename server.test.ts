import { describe, it } from 'node:test';
import * as assert from 'node:assert';

process.env.JWT_SECRET = 'test-secret';

import { serializeMeta, getGlobalSettings, dbCache } from './server.ts';

describe('getGlobalSettings caching & performance', () => {
  it('should return cached settings directly when dbCache.settingsCached is true', async () => {
    // Populate cache manually
    const mockSettings = { id: 'global', whatsappNumber: '966500000000', email: 'test@example.com' };
    dbCache.settings = mockSettings;
    dbCache.settingsCached = true;

    // Benchmark cached access
    const start = performance.now();
    for (let i = 0; i < 1000; i++) {
      const settings = await getGlobalSettings();
      assert.strictEqual(settings, mockSettings);
    }
    const duration = performance.now() - start;

    // 1000 in-memory calls should complete in under 10ms (sub-microsecond per call)
    assert.ok(duration < 10, `1000 cached calls took ${duration.toFixed(2)}ms (expected < 10ms)`);
  });
});

describe('serializeMeta', () => {
  it('should return empty string for empty array', () => {
    assert.strictEqual(serializeMeta([]), '');
  });

  it('should return empty string for undefined/null/falsy meta (though typescript enforces array, checking runtime)', () => {
    // @ts-ignore
    assert.strictEqual(serializeMeta(null), '');
    // @ts-ignore
    assert.strictEqual(serializeMeta(undefined), '');
  });

  it('should serialize basic types', () => {
    assert.strictEqual(serializeMeta([1, 'test', true]), '1 test true');
  });

  it('should serialize an Error with stack', () => {
    const error = new Error('test error');
    error.stack = 'Error: test error\\n    at stack trace';
    assert.strictEqual(serializeMeta([error]), 'Error: test error\\n    at stack trace');
  });

  it('should serialize an Error without stack', () => {
    const error = new Error('test error');
    delete error.stack;
    assert.strictEqual(serializeMeta([error]), 'test error');
  });

  it('should serialize objects', () => {
    assert.strictEqual(serializeMeta([{ a: 1 }]), '{"a":1}');
  });

  it('should handle circular objects gracefully', () => {
    const obj: any = {};
    obj.circular = obj;
    assert.strictEqual(serializeMeta([obj]), '[Circular]');
  });
});

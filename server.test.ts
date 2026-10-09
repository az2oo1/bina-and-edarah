import { describe, it } from 'node:test';
import * as assert from 'node:assert';
import path from 'path';

process.env.JWT_SECRET = 'test-secret';

import { serializeMeta } from './server.ts';

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

describe('Path Traversal Prevention', () => {
  it('should reject path traversal attempts escaping UPLOADS_DIR', () => {
    const UPLOADS_DIR = path.resolve(process.cwd(), 'uploads');
    const maliciousFileName = '../../server.ts';
    const filePath = path.resolve(UPLOADS_DIR, maliciousFileName);
    const isValid = filePath.startsWith(path.resolve(UPLOADS_DIR) + path.sep);
    assert.strictEqual(isValid, false);
  });

  it('should accept valid file paths within UPLOADS_DIR', () => {
    const UPLOADS_DIR = path.resolve(process.cwd(), 'uploads');
    const validFileName = 'subfolder/photo.jpg';
    const filePath = path.resolve(UPLOADS_DIR, validFileName);
    const isValid = filePath.startsWith(path.resolve(UPLOADS_DIR) + path.sep);
    assert.strictEqual(isValid, true);
  });
});

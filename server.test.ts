import { describe, it, after } from 'node:test';
import * as assert from 'node:assert';

process.env.JWT_SECRET = 'test-secret';

import { serializeMeta, isSafeUploadPath } from './server.ts';
import { prisma } from './src/lib/db.js';

after(async () => {
  await prisma.$disconnect();
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

describe('isSafeUploadPath', () => {
  const baseDir = '/app/uploads';

  it('should allow valid filenames inside the base directory', () => {
    assert.strictEqual(isSafeUploadPath(baseDir, 'photo.jpg'), true);
    assert.strictEqual(isSafeUploadPath(baseDir, 'subfolder/photo.png'), true);
  });

  it('should block path traversal attempts using ../', () => {
    assert.strictEqual(isSafeUploadPath(baseDir, '../etc/passwd'), false);
    assert.strictEqual(isSafeUploadPath(baseDir, '../../secret.txt'), false);
    assert.strictEqual(isSafeUploadPath(baseDir, 'subfolder/../../secret.txt'), false);
  });

  it('should block path traversal trying to escape into sibling directories', () => {
    assert.strictEqual(isSafeUploadPath(baseDir, '../uploads-other/secret.txt'), false);
  });
});

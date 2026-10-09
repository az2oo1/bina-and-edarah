import { describe, it } from 'node:test';
import * as assert from 'node:assert';

process.env.JWT_SECRET = 'test-secret';

import { serializeMeta, getAllowedOrigins, isOriginAllowed } from './server.ts';

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

describe('CORS helper functions', () => {
  it('getAllowedOrigins includes local defaults', () => {
    const origins = getAllowedOrigins();
    assert.ok(origins.includes('http://localhost:3000'));
    assert.ok(origins.includes('http://localhost:5173'));
    assert.ok(origins.includes('http://127.0.0.1:3000'));
    assert.ok(origins.includes('http://127.0.0.1:5173'));
  });

  it('getAllowedOrigins parses ALLOWED_ORIGINS env var', () => {
    const oldAllowed = process.env.ALLOWED_ORIGINS;
    try {
      process.env.ALLOWED_ORIGINS = 'https://example.com, https://app.benaa.com';
      const origins = getAllowedOrigins();
      assert.ok(origins.includes('https://example.com'));
      assert.ok(origins.includes('https://app.benaa.com'));
    } finally {
      if (oldAllowed !== undefined) {
        process.env.ALLOWED_ORIGINS = oldAllowed;
      } else {
        delete process.env.ALLOWED_ORIGINS;
      }
    }
  });

  it('getAllowedOrigins includes APP_URL when configured', () => {
    const oldAppUrl = process.env.APP_URL;
    try {
      process.env.APP_URL = 'https://my-custom-domain.com/';
      const origins = getAllowedOrigins();
      assert.ok(origins.includes('https://my-custom-domain.com'));
    } finally {
      if (oldAppUrl !== undefined) {
        process.env.APP_URL = oldAppUrl;
      } else {
        delete process.env.APP_URL;
      }
    }
  });

  it('isOriginAllowed correctly validates origins', () => {
    const oldAllowed = process.env.ALLOWED_ORIGINS;
    try {
      process.env.ALLOWED_ORIGINS = 'https://trusted-domain.com';

      // Undefined origin (non-browser requests or same origin)
      assert.strictEqual(isOriginAllowed(undefined), true);

      // Trusted domain
      assert.strictEqual(isOriginAllowed('https://trusted-domain.com'), true);

      // Local default domain
      assert.strictEqual(isOriginAllowed('http://localhost:3000'), true);

      // Untrusted domain
      assert.strictEqual(isOriginAllowed('https://evil-attacker.com'), false);
    } finally {
      if (oldAllowed !== undefined) {
        process.env.ALLOWED_ORIGINS = oldAllowed;
      } else {
        delete process.env.ALLOWED_ORIGINS;
      }
    }
  });

  it('isOriginAllowed allows any origin if ALLOWED_ORIGINS contains *', () => {
    const oldAllowed = process.env.ALLOWED_ORIGINS;
    try {
      process.env.ALLOWED_ORIGINS = '*';
      assert.strictEqual(isOriginAllowed('https://any-domain.com'), true);
    } finally {
      if (oldAllowed !== undefined) {
        process.env.ALLOWED_ORIGINS = oldAllowed;
      } else {
        delete process.env.ALLOWED_ORIGINS;
      }
    }
  });
});

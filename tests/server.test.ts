import { test, describe, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import { getSiteUrl } from '../server.js';

describe('getSiteUrl', () => {
    let originalEnv: NodeJS.ProcessEnv;

    beforeEach(() => {
        originalEnv = { ...process.env };
        delete process.env.APP_URL;
    });

    afterEach(() => {
        process.env = originalEnv;
    });

    test('should return APP_URL if it is set and not "MY_APP_URL"', () => {
        process.env.APP_URL = 'https://example.com/';
        assert.strictEqual(getSiteUrl(), 'https://example.com');

        process.env.APP_URL = 'http://test.local';
        assert.strictEqual(getSiteUrl(), 'http://test.local');
    });

    test('should ignore APP_URL if it is "MY_APP_URL"', () => {
        process.env.APP_URL = 'MY_APP_URL';
        assert.strictEqual(getSiteUrl(), 'http://localhost:3000');
    });

    test('should use req object if APP_URL is not set', () => {
        const req = {
            get: (header: string) => header === 'host' ? 'req-host.com' : null,
            secure: true,
            headers: {}
        };
        assert.strictEqual(getSiteUrl(req), 'https://req-host.com');
    });

    test('should use req headers for protocol if not secure', () => {
        const req = {
            get: (header: string) => header === 'host' ? 'req-host.com' : null,
            secure: false,
            headers: {
                'x-forwarded-proto': 'https'
            }
        };
        assert.strictEqual(getSiteUrl(req), 'https://req-host.com');

        const reqHttp = {
            get: (header: string) => header === 'host' ? 'req-host.com' : null,
            secure: false,
            headers: {
                'x-forwarded-proto': 'http'
            }
        };
        assert.strictEqual(getSiteUrl(reqHttp), 'http://req-host.com');
    });

    test('should fallback to http if not secure and no x-forwarded-proto', () => {
        const req = {
            get: (header: string) => header === 'host' ? 'req-host.com' : null,
            secure: false,
            headers: {}
        };
        assert.strictEqual(getSiteUrl(req), 'http://req-host.com');
    });

    test('should fallback to http://localhost:3000 if no APP_URL and no req', () => {
        assert.strictEqual(getSiteUrl(), 'http://localhost:3000');
    });
});

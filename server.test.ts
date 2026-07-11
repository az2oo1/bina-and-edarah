import { describe, it, expect } from 'vitest';
import { serializeMeta } from './server.ts';

describe('serializeMeta', () => {
  it('should return empty string for empty array', () => {
    expect(serializeMeta([])).toBe('');
  });

  it('should return empty string for undefined/null/falsy meta (though typescript enforces array, checking runtime)', () => {
    // @ts-ignore
    expect(serializeMeta(null)).toBe('');
    // @ts-ignore
    expect(serializeMeta(undefined)).toBe('');
  });

  it('should serialize basic types', () => {
    expect(serializeMeta([1, 'test', true])).toBe('1 test true');
  });

  it('should serialize an Error with stack', () => {
    const error = new Error('test error');
    error.stack = 'Error: test error\\n    at stack trace';
    expect(serializeMeta([error])).toBe('Error: test error\\n    at stack trace');
  });

  it('should serialize an Error without stack', () => {
    const error = new Error('test error');
    delete error.stack;
    expect(serializeMeta([error])).toBe('test error');
  });

  it('should serialize objects', () => {
    expect(serializeMeta([{ a: 1 }])).toBe('{"a":1}');
  });

  it('should handle circular objects gracefully', () => {
    const obj: any = {};
    obj.circular = obj;
    expect(serializeMeta([obj])).toBe('[Circular]');
  });
});

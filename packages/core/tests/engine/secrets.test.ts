import { describe, it, expect } from 'vitest';
import { generateJwtSecret, generateEncryptionKey, generateSecret } from '../../src/engine/secrets.js';

describe('generateSecret', () => {
	it('produces base64 output', () => {
		const secret = generateSecret(32);
		// Base64 should only contain these characters
		expect(secret).toMatch(/^[A-Za-z0-9+/]+=*$/);
	});

	it('produces correct length for 32 bytes', () => {
		const secret = generateSecret(32);
		// 32 bytes = 44 base64 chars (with padding)
		expect(secret.length).toBe(44);
	});

	it('produces unique values', () => {
		const a = generateSecret(32);
		const b = generateSecret(32);
		expect(a).not.toBe(b);
	});
});

describe('generateJwtSecret', () => {
	it('produces a long enough secret for HMAC SHA-256', () => {
		const secret = generateJwtSecret();
		// 64 bytes = 88 base64 chars
		expect(secret.length).toBeGreaterThanOrEqual(88);
	});
});

describe('generateEncryptionKey', () => {
	it('produces a 32-byte key', () => {
		const key = generateEncryptionKey();
		// 32 bytes = 44 base64 chars
		expect(key.length).toBe(44);
	});
});

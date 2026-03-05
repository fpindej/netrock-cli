/**
 * Generates cryptographically random secrets for project configuration.
 * Uses Web Crypto API for browser compatibility (works in both Node.js and browsers).
 */

/**
 * Generates a random base64-encoded string of the specified byte length.
 *
 * @param byteLength - Number of random bytes (default: 64 for JWT secret)
 * @returns Base64-encoded random string
 */
export function generateSecret(byteLength: number = 64): string {
	const bytes = new Uint8Array(byteLength);
	crypto.getRandomValues(bytes);
	return uint8ToBase64(bytes);
}

/**
 * Generates a JWT signing secret (64+ bytes, base64-encoded).
 * Satisfies HMAC SHA-256 minimum key length requirement.
 */
export function generateJwtSecret(): string {
	return generateSecret(64);
}

/**
 * Generates an AES-256-GCM encryption key (32 bytes, base64-encoded).
 */
export function generateEncryptionKey(): string {
	return generateSecret(32);
}

/** Converts a Uint8Array to a base64 string (browser-compatible). */
function uint8ToBase64(bytes: Uint8Array): string {
	let binary = '';
	for (const byte of bytes) {
		binary += String.fromCharCode(byte);
	}
	return btoa(binary);
}

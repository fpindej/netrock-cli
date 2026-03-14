import { readFileSync, readdirSync } from 'node:fs';
import { extname, join, relative } from 'node:path';
import type { TemplateSource } from './types.js';

const BINARY_EXTENSIONS = new Set([
	'.png',
	'.ico',
	'.jpg',
	'.jpeg',
	'.gif',
	'.webp',
	'.woff',
	'.woff2',
	'.ttf',
	'.eot'
]);

/**
 * A filesystem-backed TemplateSource for Node.js environments.
 * Reads template files from a root directory on disk.
 * Text files are stored as UTF-8 strings, binary files as raw Uint8Array.
 */
export function createFsSource(rootDir: string): TemplateSource {
	const textFiles = new Map<string, string>();
	const binaryFiles = new Map<string, Uint8Array>();

	function walk(dir: string): void {
		for (const entry of readdirSync(dir, { withFileTypes: true })) {
			const fullPath = join(dir, entry.name);
			if (entry.isDirectory()) {
				walk(fullPath);
			} else {
				const relPath = relative(rootDir, fullPath);
				if (BINARY_EXTENSIONS.has(extname(fullPath))) {
					binaryFiles.set(relPath, readFileSync(fullPath));
				} else {
					textFiles.set(relPath, readFileSync(fullPath, 'utf-8'));
				}
			}
		}
	}

	walk(rootDir);

	return {
		getFile(path: string) {
			return textFiles.get(path);
		},
		getBinaryFile(path: string) {
			return binaryFiles.get(path);
		},
		listFiles() {
			return [...textFiles.keys(), ...binaryFiles.keys()];
		}
	};
}

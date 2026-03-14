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
 * Binary files are base64-encoded with a `base64:` prefix.
 *
 * Not suitable for browser use - use a bundled source instead.
 */
export function createFsSource(rootDir: string): TemplateSource {
	const files = new Map<string, string>();

	function walk(dir: string): void {
		for (const entry of readdirSync(dir, { withFileTypes: true })) {
			const fullPath = join(dir, entry.name);
			if (entry.isDirectory()) {
				walk(fullPath);
			} else {
				const relPath = relative(rootDir, fullPath);
				if (BINARY_EXTENSIONS.has(extname(fullPath))) {
					files.set(relPath, 'base64:' + readFileSync(fullPath).toString('base64'));
				} else {
					files.set(relPath, readFileSync(fullPath, 'utf-8'));
				}
			}
		}
	}

	walk(rootDir);

	return {
		getFile(path: string) {
			return files.get(path);
		},
		listFiles() {
			return [...files.keys()];
		}
	};
}

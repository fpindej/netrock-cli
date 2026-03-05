import { readFileSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import type { TemplateSource } from './types.js';

/**
 * A filesystem-backed TemplateSource for Node.js environments.
 * Reads template files from a root directory on disk.
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
				files.set(relPath, readFileSync(fullPath, 'utf-8'));
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

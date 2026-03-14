import { readFileSync, readdirSync } from 'node:fs';
import { dirname, extname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, type Plugin } from 'vite';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(resolve(__dirname, 'package.json'), 'utf-8'));

function netrockChangelog(): Plugin {
	const virtualId = 'virtual:changelog';
	const resolvedId = '\0' + virtualId;
	const changelogPath = resolve(__dirname, '../../CHANGELOG.md');

	return {
		name: 'netrock-changelog',
		resolveId(id) {
			if (id === virtualId) return resolvedId;
		},
		load(id) {
			if (id === resolvedId) {
				const content = readFileSync(changelogPath, 'utf-8');
				return `export default ${JSON.stringify(content)};`;
			}
		}
	};
}

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

function netrockTemplates(): Plugin {
	const virtualId = 'virtual:templates';
	const resolvedId = '\0' + virtualId;
	const templatesDir = resolve(__dirname, '../../templates');

	function walk(dir: string): { text: [string, string][]; binary: [string, string][] } {
		const text: [string, string][] = [];
		const binary: [string, string][] = [];
		for (const entry of readdirSync(dir, { withFileTypes: true })) {
			const full = resolve(dir, entry.name);
			if (entry.isDirectory()) {
				const sub = walk(full);
				text.push(...sub.text);
				binary.push(...sub.binary);
			} else {
				const rel = relative(templatesDir, full).replaceAll('\\', '/');
				if (BINARY_EXTENSIONS.has(extname(full))) {
					binary.push([rel, readFileSync(full).toString('base64')]);
				} else {
					text.push([rel, readFileSync(full, 'utf-8')]);
				}
			}
		}
		return { text, binary };
	}

	return {
		name: 'netrock-templates',
		resolveId(id) {
			if (id === virtualId) return resolvedId;
		},
		load(id) {
			if (id === resolvedId) {
				const { text, binary } = walk(templatesDir);
				return [
					`export const textFiles = new Map(${JSON.stringify(text)});`,
					`export const binaryFiles = new Map(${JSON.stringify(binary)});`
				].join('\n');
			}
		}
	};
}

export default defineConfig({
	define: {
		__APP_VERSION__: JSON.stringify(pkg.version)
	},
	plugins: [tailwindcss(), netrockChangelog(), netrockTemplates(), sveltekit()]
});

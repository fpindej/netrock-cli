import { readFileSync, readdirSync } from 'node:fs';
import { dirname, relative, resolve } from 'node:path';
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

function netrockTemplates(): Plugin {
	const virtualId = 'virtual:templates';
	const resolvedId = '\0' + virtualId;
	const templatesDir = resolve(__dirname, '../../templates');

	function walk(dir: string): [string, string][] {
		const entries: [string, string][] = [];
		for (const entry of readdirSync(dir, { withFileTypes: true })) {
			const full = resolve(dir, entry.name);
			if (entry.isDirectory()) {
				entries.push(...walk(full));
			} else {
				const rel = relative(templatesDir, full).replaceAll('\\', '/');
				entries.push([rel, readFileSync(full, 'utf-8')]);
			}
		}
		return entries;
	}

	return {
		name: 'netrock-templates',
		resolveId(id) {
			if (id === virtualId) return resolvedId;
		},
		load(id) {
			if (id === resolvedId) {
				const entries = walk(templatesDir);
				return `export default new Map(${JSON.stringify(entries)});`;
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

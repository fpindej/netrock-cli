import { registerManifest } from '../features/manifest.js';

/** Registers the claude feature manifest with CLAUDE.md, AGENTS.md, and FILEMAP.md. */
export function registerClaudeManifest(): void {
	registerManifest({
		featureId: 'claude',
		files: [
			{ path: 'CLAUDE.md', templated: true },
			{ path: 'AGENTS.md', templated: true },
			{ path: 'FILEMAP.md', templated: true },
			{ path: 'src/backend/AGENTS.md', templated: true }
		]
	});
}

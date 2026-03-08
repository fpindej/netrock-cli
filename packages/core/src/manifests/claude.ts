import { registerManifest } from '../features/manifest.js';

/** Registers the claude feature manifest with CLAUDE.md, FILEMAP.md, agents, and hooks. */
export function registerClaudeManifest(): void {
	registerManifest({
		featureId: 'claude',
		files: [
			{ path: 'CLAUDE.md', templated: true },
			{ path: 'FILEMAP.md', templated: true },

			// Hooks
			{ path: '.claude/hooks/session-start.mjs', templated: false },
			{ path: '.claude/hooks/validate-bash.mjs', templated: false },
			{ path: '.claude/hooks/auto-format.mjs', templated: false },
			{ path: '.claude/hooks/stop-quality-gate.mjs', templated: false },

			// Agents (backend-relevant)
			{ path: '.claude/agents/backend-engineer.md', templated: false },
			{ path: '.claude/agents/backend-reviewer.md', templated: false },
			{ path: '.claude/agents/devops-reviewer.md', templated: false },
			{ path: '.claude/agents/filemap-checker.md', templated: false },
			{ path: '.claude/agents/product-owner.md', templated: false },
			{ path: '.claude/agents/security-reviewer.md', templated: false },
			{ path: '.claude/agents/tech-writer.md', templated: false },
			{ path: '.claude/agents/test-writer.md', templated: false }
		]
	});
}

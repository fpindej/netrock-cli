import { registerManifest } from '../features/manifest.js';

/** Registers the claude-skills feature manifest with Claude Code skills, convention references, and assets. */
export function registerClaudeSkillsManifest(): void {
	registerManifest({
		featureId: 'claude-skills',
		files: [
			// Settings (hooks config + permissions)
			{ path: '.claude/settings.json', templated: false },
			{ path: '.claude/settings.local.json.example', templated: false },

			// Convention skills (auto-injected into agents, not user-invocable)
			{ path: '.claude/skills/backend-conventions/SKILL.md', templated: true },
			{ path: '.claude/skills/security-conventions/SKILL.md', templated: true },
			{ path: '.claude/skills/infra-conventions/SKILL.md', templated: true },

			// Skill assets (templates and references for agents)
			{ path: '.claude/skills/create-pr/assets/pr-body.md', templated: false },
			{ path: '.claude/skills/new-endpoint/assets/controller-action.cs.md', templated: false },
			{ path: '.claude/skills/new-endpoint/assets/validator.cs.md', templated: false },
			{ path: '.claude/skills/new-entity/assets/entity.cs.md', templated: false },
			{ path: '.claude/skills/new-entity/assets/configuration.cs.md', templated: false },
			{ path: '.claude/skills/review-pr/references/conventions-summary.md', templated: true },

			// Generic skills (always available)
			{ path: '.claude/skills/address-review/SKILL.md', templated: false },
			{ path: '.claude/skills/verify/SKILL.md', templated: true },
			{ path: '.claude/skills/add-ci-area/SKILL.md', templated: false },
			{ path: '.claude/skills/add-env-var/SKILL.md', templated: true },
			{ path: '.claude/skills/add-options-class/SKILL.md', templated: false },
			{ path: '.claude/skills/add-rate-limit/SKILL.md', templated: false },
			{ path: '.claude/skills/add-route-constraint/SKILL.md', templated: false },
			{ path: '.claude/skills/add-test/SKILL.md', templated: true },
			{ path: '.claude/skills/create-issue/SKILL.md', templated: false },
			{ path: '.claude/skills/create-pr/SKILL.md', templated: false },
			{ path: '.claude/skills/create-release/SKILL.md', templated: false },
			{ path: '.claude/skills/new-endpoint/SKILL.md', templated: true },
			{ path: '.claude/skills/new-entity/SKILL.md', templated: false },
			{ path: '.claude/skills/new-feature/SKILL.md', templated: true },
			{ path: '.claude/skills/review-dependabot/SKILL.md', templated: false },
			{ path: '.claude/skills/review-pr/SKILL.md', templated: false },

			// Feature-gated skills (entire content wrapped in @feature markers)
			{ path: '.claude/skills/add-aspire-dep/SKILL.md', templated: true },
			{ path: '.claude/skills/add-background-job/SKILL.md', templated: true },
			{ path: '.claude/skills/add-email-template/SKILL.md', templated: true },
			{ path: '.claude/skills/add-permission/SKILL.md', templated: true },
			{ path: '.claude/skills/gen-types/SKILL.md', templated: true },
			{ path: '.claude/skills/manage-file-storage/SKILL.md', templated: true },
			{ path: '.claude/skills/new-page/SKILL.md', templated: true },
			{ path: '.claude/skills/review-design/SKILL.md', templated: true }
		]
	});
}

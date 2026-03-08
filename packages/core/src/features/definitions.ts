import type { Feature } from './types.js';

/** All available generator features with their dependencies and metadata. */
export const featureDefinitions: Feature[] = [
	{
		id: 'core',
		name: 'Core',
		description: 'Clean Architecture skeleton, Identity, Result pattern, health checks, PostgreSQL',
		dependencies: [],
		required: true,
		defaultEnabled: true,
		group: 'core'
	},
	{
		id: 'auth',
		name: 'Authentication',
		description:
			'Local login, registration, token refresh, user profile, email (SMTP + templates), email verification, password reset',
		dependencies: ['core'],
		required: false,
		defaultEnabled: true,
		group: 'core'
	},
	{
		id: '2fa',
		name: 'Two-factor authentication',
		description: 'TOTP-based 2FA with recovery codes',
		dependencies: ['auth'],
		required: false,
		defaultEnabled: false,
		group: 'authentication'
	},
	{
		id: 'oauth',
		name: 'External OAuth providers',
		description: 'Google, GitHub, Microsoft, and more',
		dependencies: ['auth'],
		required: false,
		defaultEnabled: false,
		group: 'authentication'
	},
	{
		id: 'captcha',
		name: 'Captcha (Turnstile)',
		description: 'Cloudflare Turnstile on register and forgot password',
		dependencies: ['auth'],
		required: false,
		defaultEnabled: false,
		group: 'authentication'
	},
	{
		id: 'jobs',
		name: 'Background jobs',
		description: 'Hangfire job scheduling with PostgreSQL storage',
		dependencies: ['auth'],
		required: false,
		defaultEnabled: true,
		group: 'infrastructure'
	},
	{
		id: 'file-storage',
		name: 'File storage',
		description: 'S3/MinIO file storage abstraction',
		dependencies: ['core'],
		required: false,
		defaultEnabled: false,
		group: 'infrastructure'
	},
	{
		id: 'avatars',
		name: 'Avatar uploads',
		description: 'User avatar upload with image processing',
		dependencies: ['auth', 'file-storage'],
		required: false,
		defaultEnabled: false,
		group: 'authentication'
	},
	{
		id: 'audit',
		name: 'Audit trail',
		description: 'Audit event logging for security-sensitive actions',
		dependencies: ['core'],
		required: false,
		defaultEnabled: true,
		group: 'infrastructure'
	},
	{
		id: 'admin',
		name: 'Admin panel',
		description: 'User management, role management, system administration',
		dependencies: ['auth', 'audit'],
		required: false,
		defaultEnabled: true,
		group: 'core'
	},
	{
		id: 'aspire',
		name: 'Aspire orchestration',
		description: '.NET Aspire for local dev orchestration with OpenTelemetry',
		dependencies: ['core'],
		required: false,
		defaultEnabled: true,
		group: 'infrastructure'
	},
	{
		id: 'claude',
		name: 'Claude agent team',
		description:
			'CLAUDE.md, FILEMAP.md, 8 specialized agents, and 4 lifecycle hooks for AI-assisted development',
		dependencies: ['core'],
		required: false,
		defaultEnabled: true,
		group: 'tooling'
	},
	{
		id: 'claude-skills',
		name: 'Claude skills & conventions',
		description:
			'22 Claude Code skills, 3 convention references, and skill assets for code generation',
		dependencies: ['claude'],
		required: false,
		defaultEnabled: true,
		group: 'tooling'
	},
	{
		id: 'frontend',
		name: 'SvelteKit frontend',
		description: 'Full SvelteKit reference frontend with all feature UIs',
		dependencies: ['auth'],
		required: false,
		defaultEnabled: true,
		group: 'frontend'
	}
];

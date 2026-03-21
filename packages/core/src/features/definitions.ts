import type { Feature } from './types.js';

/** All available generator features with their dependencies and metadata. */
export const featureDefinitions: Feature[] = [
	{
		id: 'core',
		name: 'Core',
		description:
			'Clean Architecture skeleton, Result pattern, health checks, PostgreSQL, Aspire orchestration',
		details:
			'Sets up a .NET 10 Web API with Clean Architecture layers (Domain, Application, Infrastructure, WebApi), the Result pattern for error handling, ProblemDetails (RFC 9457), health check endpoints, PostgreSQL with EF Core, Serilog structured logging, CORS, rate limiting, security headers, and .NET Aspire for local dev orchestration with OpenTelemetry.',
		dependencies: [],
		required: true,
		defaultEnabled: true,
		group: 'core'
	},
	{
		id: 'email',
		name: 'Email (SMTP)',
		description: 'SMTP email service with Liquid template rendering',
		details:
			'Adds a generic email infrastructure with MailKit SMTP, Fluid template engine, and a safe templated sender that swallows transient failures. Includes a shared base layout template. Add this standalone for contact forms or notifications, or let it auto-resolve when Authentication is selected.',
		dependencies: ['core'],
		required: false,
		defaultEnabled: false,
		group: 'infrastructure'
	},
	{
		id: 'auth',
		name: 'Authentication',
		description:
			'Local login, registration, token refresh, user profile, email verification, password reset',
		details:
			'Adds JWT-based authentication with access/refresh token flow, user registration with email verification, password reset via email links, user profile management, auth-specific email templates, and cookie-based token storage. Without this, all API endpoints are public.',
		dependencies: ['core', 'email'],
		required: false,
		defaultEnabled: true,
		group: 'core'
	},
	{
		id: '2fa',
		name: 'Two-factor authentication',
		description: 'TOTP-based 2FA with recovery codes',
		details:
			'Adds time-based one-time password (TOTP) support compatible with Google Authenticator, Authy, and similar apps. Includes setup flow with QR code, verification challenge during login, and single-use recovery codes for account recovery.',
		dependencies: ['auth'],
		required: false,
		defaultEnabled: false,
		group: 'authentication'
	},
	{
		id: 'oauth',
		name: 'External OAuth providers',
		description: 'Google, GitHub, Microsoft, and more',
		details:
			'Adds OAuth 2.0 / OpenID Connect login with configurable providers. Users can link multiple external accounts, log in with any linked provider, and manage connections from their profile. Provider credentials are stored encrypted at rest.',
		dependencies: ['auth'],
		required: false,
		defaultEnabled: false,
		group: 'authentication',
		options: [
			{ id: 'google', name: 'Google', defaultEnabled: true },
			{ id: 'github', name: 'GitHub', defaultEnabled: true },
			{ id: 'microsoft', name: 'Microsoft', defaultEnabled: true },
			{ id: 'apple', name: 'Apple', defaultEnabled: true },
			{ id: 'discord', name: 'Discord', defaultEnabled: false },
			{ id: 'facebook', name: 'Facebook', defaultEnabled: false },
			{ id: 'gitlab', name: 'GitLab', defaultEnabled: false },
			{ id: 'linkedin', name: 'LinkedIn', defaultEnabled: false },
			{ id: 'slack', name: 'Slack', defaultEnabled: false },
			{ id: 'twitch', name: 'Twitch', defaultEnabled: false }
		]
	},
	{
		id: 'captcha',
		name: 'Captcha (Turnstile)',
		description: 'Cloudflare Turnstile on register and forgot password',
		details:
			'Adds Cloudflare Turnstile CAPTCHA verification to registration and forgot-password forms. Turnstile is privacy-friendly and typically invisible to users. Requires a free Cloudflare Turnstile site key and secret.',
		dependencies: ['auth'],
		required: false,
		defaultEnabled: false,
		group: 'authentication'
	},
	{
		id: 'jobs',
		name: 'Background jobs',
		description: 'Hangfire job scheduling with PostgreSQL storage',
		details:
			'Adds Hangfire for background job processing with PostgreSQL-backed storage. Includes fire-and-forget jobs, recurring job scheduling with cron expressions, an admin API for managing jobs (trigger, pause, resume, remove), and example recurring jobs for expired token cleanup.',
		dependencies: ['core'],
		required: false,
		defaultEnabled: true,
		group: 'infrastructure'
	},
	{
		id: 'file-storage',
		name: 'File storage',
		description: 'S3/MinIO file storage abstraction',
		details:
			'Adds an S3-compatible file storage abstraction that works with AWS S3, MinIO, or any S3-compatible provider. Includes upload, download, and delete operations with configurable bucket and path prefix. Use MinIO locally via Aspire for zero-config dev setup.',
		dependencies: ['core'],
		required: false,
		defaultEnabled: false,
		group: 'infrastructure'
	},
	{
		id: 'avatars',
		name: 'Avatar uploads',
		description: 'User avatar upload with image processing',
		details:
			'Adds profile avatar upload with server-side image processing (resize, crop to square, format conversion). Avatars are stored via the file storage abstraction (S3/MinIO). Includes upload and remove endpoints with size and format validation.',
		dependencies: ['auth', 'file-storage'],
		required: false,
		defaultEnabled: false,
		group: 'authentication'
	},
	{
		id: 'audit',
		name: 'Audit trail',
		description: 'Audit event logging for security-sensitive actions',
		details:
			'Adds an append-only audit log that records security-sensitive actions: logins, password changes, admin operations, account modifications, and more. Each event captures who performed the action, what was affected, and optional metadata. Viewable per-user in the admin panel.',
		dependencies: ['core'],
		required: false,
		defaultEnabled: true,
		group: 'infrastructure'
	},
	{
		id: 'admin',
		name: 'Admin panel',
		description: 'User management, role management, system administration',
		details:
			'Adds permission-based admin API endpoints for managing users (create, lock, unlock, delete, assign roles), roles (create, edit permissions, delete), and browsing audit logs. Includes a full admin UI in the frontend with data tables, detail views, and role permission editors.',
		dependencies: ['auth', 'audit'],
		required: false,
		defaultEnabled: true,
		group: 'core'
	},
	{
		id: 'aspire',
		name: 'Aspire orchestration',
		description: '.NET Aspire for local dev orchestration with OpenTelemetry',
		details:
			'Included in every project. Aspire orchestrates all services locally with a single command: PostgreSQL, the API, the frontend dev server, and dependencies like MinIO or MailPit. Includes OpenTelemetry for distributed tracing, metrics, and structured logging via the Aspire dashboard.',
		dependencies: ['core'],
		required: true,
		defaultEnabled: true,
		group: 'infrastructure'
	},
	{
		id: 'claude',
		name: 'Claude agent team',
		description:
			'CLAUDE.md, FILEMAP.md, 8 specialized agents, 5 rules files, and 4 lifecycle hooks for AI-assisted development',
		details:
			'Adds project-specific Claude Code configuration: CLAUDE.md with project rules, delegation model, and conventions, FILEMAP.md for change impact tracking, 8 specialized agents (backend engineer, reviewers, test writer, etc.), 5 rules files (backend API, database, infrastructure, testing, frontend), and 4 lifecycle hooks for auto-formatting and safety gates.',
		dependencies: ['core'],
		required: false,
		defaultEnabled: true,
		group: 'tooling'
	},
	{
		id: 'claude-skills',
		name: 'Claude skills & conventions',
		description:
			'24 Claude Code skills, 3 convention references, permissions config, and skill assets for code generation',
		details:
			'Adds slash-command skills for common workflows: /verify, /address-review, adding permissions, background jobs, email templates, API endpoints, and more. Includes convention reference documents that agents auto-load for consistent code style, permission allow/deny lists for safe tool usage, and a local settings example for user overrides.',
		dependencies: ['claude'],
		required: false,
		defaultEnabled: true,
		group: 'tooling'
	},
	{
		id: 'frontend',
		name: 'SvelteKit frontend',
		description: 'SvelteKit reference frontend that adapts to your selected features',
		details:
			'Adds a SvelteKit 5 frontend with Tailwind CSS, shadcn-svelte components, i18n (Paraglide), dark/light themes, and a responsive sidebar layout. Includes an API proxy, typed API client with openapi-typescript code generation, backend health monitoring, and keyboard shortcuts. Pages and components adapt to your selected features. Without auth, ships as a clean dashboard shell.',
		dependencies: ['core'],
		required: false,
		defaultEnabled: true,
		group: 'frontend'
	}
];

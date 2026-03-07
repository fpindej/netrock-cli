import type { Preset } from './types.js';

export const presets: Preset[] = [
	{
		id: 'minimal',
		name: 'Minimal',
		description: 'Core API with authentication only',
		features: ['core', 'auth']
	},
	{
		id: 'standard',
		name: 'Standard',
		description: 'Recommended setup for most projects',
		features: ['core', 'auth', 'jobs', 'audit', 'admin', 'aspire', 'frontend']
	},
	{
		id: 'full',
		name: 'Full',
		description: 'Everything enabled',
		features: [
			'core',
			'auth',
			'2fa',
			'oauth',
			'captcha',
			'jobs',
			'file-storage',
			'avatars',
			'audit',
			'admin',
			'aspire',
			'frontend'
		]
	},
	{
		id: 'api-only',
		name: 'API only',
		description: 'Full backend without the SvelteKit frontend',
		features: [
			'core',
			'auth',
			'2fa',
			'oauth',
			'captcha',
			'jobs',
			'file-storage',
			'avatars',
			'audit',
			'admin',
			'aspire'
		]
	}
];

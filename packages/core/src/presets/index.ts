import type { Preset } from './types.js';

export const presets: Preset[] = [
	{
		id: 'minimal',
		name: 'Minimal',
		description: 'Core API with authentication',
		features: ['core', 'auth']
	},
	{
		id: 'standard',
		name: 'Standard',
		description: 'Recommended setup for most projects',
		features: ['core', 'auth', 'jobs', 'audit', 'admin', 'aspire', 'claude', 'claude-skills']
	},
	{
		id: 'full',
		name: 'Full',
		description: 'Every backend feature enabled',
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
			'claude',
			'claude-skills'
		],
		featureOptions: {
			oauth: [
				'google',
				'github',
				'microsoft',
				'apple',
				'discord',
				'facebook',
				'gitlab',
				'linkedin',
				'slack',
				'twitch'
			]
		}
	}
];

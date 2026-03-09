import { describe, it, expect, beforeAll } from 'vitest';
import { resolve } from 'node:path';
import { generateProject } from '../../src/engine/generator.js';
import { registerAllManifests } from '../../src/manifests/index.js';
import { createFsSource } from '../../src/engine/fs-source.js';
import { presets } from '../../src/presets/index.js';
import type { TemplateSource } from '../../src/engine/types.js';
import type { FeatureId } from '../../src/features/types.js';

let source: TemplateSource;

beforeAll(() => {
	registerAllManifests();
	const templatesDir = resolve(__dirname, '../../../../templates');
	source = createFsSource(templatesDir);
});

/** Generates a sorted file list for snapshotting. */
function generateFileList(
	features: FeatureId[],
	featureOptions?: Map<FeatureId, Set<string>>
): string[] {
	const result = generateProject(
		{ projectName: 'snapshot-app', features: new Set<FeatureId>(features), featureOptions },
		source
	);
	return result.files.map((f) => f.path).sort();
}

/** Generates content of a specific file for a given feature set. */
function generateFileContent(
	features: FeatureId[],
	filePathSuffix: string,
	featureOptions?: Map<FeatureId, Set<string>>
): string {
	const result = generateProject(
		{ projectName: 'snapshot-app', features: new Set<FeatureId>(features), featureOptions },
		source
	);
	const file = result.files.find((f) => f.path.endsWith(filePathSuffix));
	if (!file) {
		throw new Error(`File ending with '${filePathSuffix}' not found in generated output`);
	}
	// Normalize generated secrets so snapshots are deterministic across runs
	return file.content
		.replace(/"Key":\s*"[A-Za-z0-9+/=]{40,}"/, '"Key": "<GENERATED_JWT_SECRET>"')
		.replace(
			/"EncryptionKey":\s*"[A-Za-z0-9+/=]{40,}"/,
			'"EncryptionKey": "<GENERATED_ENCRYPTION_KEY>"'
		);
}

/** Converts a preset's featureOptions record to the Map format used by the generator. */
function presetOptionsToMap(
	record?: Record<string, string[]>
): Map<FeatureId, Set<string>> | undefined {
	if (!record) return undefined;
	const map = new Map<FeatureId, Set<string>>();
	for (const [key, values] of Object.entries(record)) {
		map.set(key as FeatureId, new Set(values));
	}
	return map;
}

describe('file list snapshots', () => {
	it('core-only file list', () => {
		const files = generateFileList(['core']);
		expect(files).toMatchSnapshot();
	});

	it('minimal preset (core + auth) file list', () => {
		const preset = presets.find((p) => p.id === 'minimal')!;
		const files = generateFileList(preset.features as FeatureId[]);
		expect(files).toMatchSnapshot();
	});

	it('core + auth + 2fa + oauth file list', () => {
		const files = generateFileList(['core', 'auth', '2fa', 'oauth']);
		expect(files).toMatchSnapshot();
	});

	it('core + jobs file list', () => {
		const files = generateFileList(['core', 'jobs']);
		expect(files).toMatchSnapshot();
	});

	it('full preset file list', () => {
		const preset = presets.find((p) => p.id === 'full')!;
		const files = generateFileList(
			preset.features as FeatureId[],
			presetOptionsToMap(preset.featureOptions)
		);
		expect(files).toMatchSnapshot();
	});

	it('frontend minimal (core + auth + frontend) file list', () => {
		const files = generateFileList(['core', 'auth', 'frontend']);
		expect(files).toMatchSnapshot();
	});

	it('frontend + admin (no jobs/oauth) file list', () => {
		const files = generateFileList(['core', 'auth', 'admin', 'frontend']);
		expect(files).toMatchSnapshot();
	});

	it('frontend full file list', () => {
		const files = generateFileList([
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
			'frontend'
		]);
		expect(files).toMatchSnapshot();
	});
});

describe('convergence file snapshots', () => {
	describe('Program.cs', () => {
		it('core-only', () => {
			const content = generateFileContent(['core'], 'Program.cs');
			expect(content).toMatchSnapshot();
		});

		it('minimal (core + auth)', () => {
			const content = generateFileContent(['core', 'auth'], 'Program.cs');
			expect(content).toMatchSnapshot();
		});

		it('full preset', () => {
			const preset = presets.find((p) => p.id === 'full')!;
			const content = generateFileContent(
				preset.features as FeatureId[],
				'Program.cs',
				presetOptionsToMap(preset.featureOptions)
			);
			expect(content).toMatchSnapshot();
		});
	});

	describe('DbContext', () => {
		it('core-only', () => {
			const content = generateFileContent(['core'], 'SnapshotAppDbContext.cs');
			expect(content).toMatchSnapshot();
		});

		it('minimal (core + auth)', () => {
			const content = generateFileContent(['core', 'auth'], 'SnapshotAppDbContext.cs');
			expect(content).toMatchSnapshot();
		});

		it('full preset', () => {
			const preset = presets.find((p) => p.id === 'full')!;
			const content = generateFileContent(
				preset.features as FeatureId[],
				'SnapshotAppDbContext.cs',
				presetOptionsToMap(preset.featureOptions)
			);
			expect(content).toMatchSnapshot();
		});
	});

	describe('appsettings.json', () => {
		it('core-only', () => {
			const content = generateFileContent(['core'], 'WebApi/appsettings.json');
			expect(content).toMatchSnapshot();
		});

		it('full preset', () => {
			const preset = presets.find((p) => p.id === 'full')!;
			const content = generateFileContent(
				preset.features as FeatureId[],
				'WebApi/appsettings.json',
				presetOptionsToMap(preset.featureOptions)
			);
			expect(content).toMatchSnapshot();
		});
	});

	describe('appsettings.Testing.json', () => {
		it('core-only', () => {
			const content = generateFileContent(['core'], 'appsettings.Testing.json');
			expect(content).toMatchSnapshot();
		});

		it('minimal (core + auth)', () => {
			const content = generateFileContent(['core', 'auth'], 'appsettings.Testing.json');
			expect(content).toMatchSnapshot();
		});

		it('full preset', () => {
			const preset = presets.find((p) => p.id === 'full')!;
			const content = generateFileContent(
				preset.features as FeatureId[],
				'appsettings.Testing.json',
				presetOptionsToMap(preset.featureOptions)
			);
			expect(content).toMatchSnapshot();
		});
	});

	describe('Infrastructure.csproj', () => {
		it('core-only', () => {
			const content = generateFileContent(
				['core'],
				'SnapshotApp.Infrastructure/SnapshotApp.Infrastructure.csproj'
			);
			expect(content).toMatchSnapshot();
		});

		it('full preset', () => {
			const preset = presets.find((p) => p.id === 'full')!;
			const content = generateFileContent(
				preset.features as FeatureId[],
				'SnapshotApp.Infrastructure/SnapshotApp.Infrastructure.csproj',
				presetOptionsToMap(preset.featureOptions)
			);
			expect(content).toMatchSnapshot();
		});
	});

	describe('Solution file', () => {
		it('core-only', () => {
			const content = generateFileContent(['core'], 'SnapshotApp.slnx');
			expect(content).toMatchSnapshot();
		});

		it('minimal (core + auth)', () => {
			const content = generateFileContent(['core', 'auth'], 'SnapshotApp.slnx');
			expect(content).toMatchSnapshot();
		});

		it('full preset', () => {
			const preset = presets.find((p) => p.id === 'full')!;
			const content = generateFileContent(
				preset.features as FeatureId[],
				'SnapshotApp.slnx',
				presetOptionsToMap(preset.featureOptions)
			);
			expect(content).toMatchSnapshot();
		});
	});

	describe('ErrorMessages.cs', () => {
		it('core-only', () => {
			const content = generateFileContent(['core'], 'ErrorMessages.cs');
			expect(content).toMatchSnapshot();
		});

		it('minimal (core + auth)', () => {
			const content = generateFileContent(['core', 'auth'], 'ErrorMessages.cs');
			expect(content).toMatchSnapshot();
		});

		it('full preset', () => {
			const preset = presets.find((p) => p.id === 'full')!;
			const content = generateFileContent(
				preset.features as FeatureId[],
				'ErrorMessages.cs',
				presetOptionsToMap(preset.featureOptions)
			);
			expect(content).toMatchSnapshot();
		});
	});
});

describe('frontend feature gate content', () => {
	/** Helper to generate and return only frontend files. */
	function generateFrontend(features: FeatureId[]) {
		const result = generateProject(
			{ projectName: 'test-app', features: new Set<FeatureId>(features) },
			source
		);
		return result.files.filter((f) => f.path.startsWith('src/frontend/'));
	}

	/** Helper to find a file by path suffix. */
	function findFile(files: { path: string; content: string }[], suffix: string) {
		return files.find((f) => f.path.endsWith(suffix));
	}

	describe('minimal frontend (core + auth)', () => {
		let files: ReturnType<typeof generateFrontend>;
		beforeAll(() => {
			files = generateFrontend(['core', 'auth', 'frontend']);
		});

		it('excludes admin files', () => {
			expect(files.filter((f) => f.path.includes('/admin/'))).toHaveLength(0);
		});

		it('excludes oauth files', () => {
			expect(files.filter((f) => f.path.includes('/oauth/'))).toHaveLength(0);
		});

		it('excludes 2fa files', () => {
			expect(files.filter((f) => f.path.includes('TwoFactor'))).toHaveLength(0);
		});

		it('excludes avatar files', () => {
			expect(files.filter((f) => f.path.includes('Avatar'))).toHaveLength(0);
		});

		it('excludes captcha files', () => {
			expect(files.filter((f) => f.path.includes('Turnstile'))).toHaveLength(0);
		});

		it('excludes audit files', () => {
			expect(
				files.filter((f) => f.path.includes('ActivityLog') || f.path.includes('audit'))
			).toHaveLength(0);
		});

		it('permissions.ts has SystemRoles but not Permissions', () => {
			const file = findFile(files, 'permissions.ts');
			expect(file).toBeDefined();
			expect(file!.content).toContain('export const SystemRoles');
			expect(file!.content).not.toContain('export const Permissions');
		});

		it('LoginForm has no 2fa or oauth references', () => {
			const file = findFile(files, 'LoginForm.svelte');
			expect(file).toBeDefined();
			expect(file!.content).not.toContain('TwoFactorStep');
			expect(file!.content).not.toContain('OAuthProviderButtons');
			expect(file!.content).toContain('completeLogin');
		});

		it('settings page has only ChangePasswordForm', () => {
			const file = findFile(files, 'settings/+page.svelte');
			expect(file).toBeDefined();
			expect(file!.content).toContain('ChangePasswordForm');
			expect(file!.content).not.toContain('TwoFactorCard');
			expect(file!.content).not.toContain('ConnectedAccountsCard');
			expect(file!.content).not.toContain('ActivityLog');
		});

		it('roles.ts is excluded', () => {
			expect(findFile(files, 'roles.ts')).toBeUndefined();
		});
	});

	describe('admin without jobs/oauth', () => {
		let files: ReturnType<typeof generateFrontend>;
		beforeAll(() => {
			files = generateFrontend(['core', 'auth', 'admin', 'frontend']);
		});

		it('includes admin user/role pages but not job/oauth pages', () => {
			expect(files.some((f) => f.path.includes('admin/users/'))).toBe(true);
			expect(files.some((f) => f.path.includes('admin/roles/'))).toBe(true);
			expect(files.some((f) => f.path.includes('admin/jobs/'))).toBe(false);
			expect(files.some((f) => f.path.includes('admin/oauth-providers/'))).toBe(false);
		});

		it('Permissions has Users/Roles but not Jobs/OAuthProviders', () => {
			const file = findFile(files, 'permissions.ts');
			expect(file).toBeDefined();
			expect(file!.content).toContain('export const Permissions');
			expect(file!.content).toContain("'users.view'");
			expect(file!.content).toContain("'roles.view'");
			expect(file!.content).not.toContain("'jobs.view'");
			expect(file!.content).not.toContain("'oauth_providers.view'");
		});

		it('AppSidebar has no Clock or KeyRound icons', () => {
			const file = findFile(files, 'AppSidebar.svelte');
			expect(file).toBeDefined();
			expect(file!.content).toContain('Users');
			expect(file!.content).toContain('Shield');
			expect(file!.content).not.toContain('Clock');
			expect(file!.content).not.toContain('KeyRound');
		});
	});

	describe('sub-features without admin do not leak admin files', () => {
		it('jobs without admin excludes admin/jobs routes and components', () => {
			const files = generateFrontend(['core', 'auth', 'jobs', 'frontend']);
			expect(files.filter((f) => f.path.includes('admin/jobs/'))).toHaveLength(0);
			expect(files.filter((f) => f.path.includes('JobTable'))).toHaveLength(0);
			expect(files.filter((f) => f.path.includes('JobInfoCard'))).toHaveLength(0);
			expect(files.filter((f) => f.path.includes('JobActionsCard'))).toHaveLength(0);
			expect(files.filter((f) => f.path.includes('JobExecutionHistory'))).toHaveLength(0);
		});

		it('oauth without admin excludes admin/oauth routes and OAuthProviderCard', () => {
			const files = generateFrontend(['core', 'auth', 'oauth', 'frontend']);
			expect(files.filter((f) => f.path.includes('admin/oauth-providers/'))).toHaveLength(0);
			expect(files.filter((f) => f.path.includes('OAuthProviderCard'))).toHaveLength(0);
		});

		it('audit without admin excludes AuditTrailCard', () => {
			const files = generateFrontend(['core', 'auth', 'audit', 'frontend']);
			expect(files.filter((f) => f.path.includes('AuditTrailCard'))).toHaveLength(0);
		});

		it('all sub-features without admin excludes all admin files', () => {
			const files = generateFrontend([
				'core',
				'auth',
				'jobs',
				'oauth',
				'audit',
				'frontend'
			]);
			expect(files.filter((f) => f.path.includes('/admin/'))).toHaveLength(0);
		});

		it('admin + jobs includes job routes and components', () => {
			const files = generateFrontend(['core', 'auth', 'admin', 'jobs', 'frontend']);
			expect(files.filter((f) => f.path.includes('admin/jobs/'))).toHaveLength(4);
			expect(files.some((f) => f.path.includes('JobTable'))).toBe(true);
			expect(files.some((f) => f.path.includes('JobInfoCard'))).toBe(true);
		});

		it('admin + oauth includes oauth routes and OAuthProviderCard', () => {
			const files = generateFrontend(['core', 'auth', 'admin', 'oauth', 'frontend']);
			expect(files.filter((f) => f.path.includes('admin/oauth-providers/'))).toHaveLength(2);
			expect(files.some((f) => f.path.includes('OAuthProviderCard'))).toBe(true);
		});

		it('admin + audit includes AuditTrailCard', () => {
			const files = generateFrontend(['core', 'auth', 'admin', 'audit', 'frontend']);
			expect(files.some((f) => f.path.includes('AuditTrailCard'))).toBe(true);
		});
	});

	describe('frontend with all features', () => {
		let files: ReturnType<typeof generateFrontend>;
		beforeAll(() => {
			files = generateFrontend([
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
				'frontend'
			]);
		});

		it('includes all feature-specific files', () => {
			expect(files.some((f) => f.path.includes('/admin/'))).toBe(true);
			expect(files.some((f) => f.path.includes('/oauth/'))).toBe(true);
			expect(files.some((f) => f.path.includes('TwoFactor'))).toBe(true);
			expect(files.some((f) => f.path.includes('Avatar'))).toBe(true);
			expect(files.some((f) => f.path.includes('Turnstile'))).toBe(true);
			expect(files.some((f) => f.path.includes('ActivityLog'))).toBe(true);
		});

		it('Permissions has all sub-feature groups', () => {
			const file = findFile(files, 'permissions.ts');
			expect(file).toBeDefined();
			expect(file!.content).toContain("'jobs.view'");
			expect(file!.content).toContain("'oauth_providers.view'");
		});

		it('LoginForm has 2fa and oauth', () => {
			const file = findFile(files, 'LoginForm.svelte');
			expect(file).toBeDefined();
			expect(file!.content).toContain('TwoFactorStep');
			expect(file!.content).toContain('OAuthProviderButtons');
		});

		it('RegisterForm has captcha and oauth', () => {
			const file = findFile(files, 'RegisterForm.svelte');
			expect(file).toBeDefined();
			expect(file!.content).toContain('TurnstileWidget');
			expect(file!.content).toContain('OAuthProviderButtons');
		});

		it('ProfileHeader has avatar upload', () => {
			const file = findFile(files, 'ProfileHeader.svelte');
			expect(file).toBeDefined();
			expect(file!.content).toContain('AvatarDialog');
			expect(file!.content).toContain('Camera');
		});
	});
});

describe('no residual markers', () => {
	const fullPreset = presets.find((p) => p.id === 'full')!;
	const combinations: {
		name: string;
		features: FeatureId[];
		featureOptions?: Map<FeatureId, Set<string>>;
	}[] = [
		{ name: 'core-only', features: ['core'] },
		{ name: 'minimal', features: ['core', 'auth'] },
		{ name: 'core + auth + 2fa + oauth', features: ['core', 'auth', '2fa', 'oauth'] },
		{ name: 'core + jobs', features: ['core', 'jobs'] },
		{
			name: 'full',
			features: fullPreset.features as FeatureId[],
			featureOptions: presetOptionsToMap(fullPreset.featureOptions)
		},
		// Frontend feature combinations
		{ name: 'frontend minimal', features: ['core', 'auth', 'frontend'] },
		{
			name: 'frontend + admin (no jobs/oauth)',
			features: ['core', 'auth', 'admin', 'frontend']
		},
		{
			name: 'frontend + 2fa + oauth',
			features: ['core', 'auth', '2fa', 'oauth', 'frontend']
		},
		{
			name: 'frontend + captcha + avatars',
			features: ['core', 'auth', 'captcha', 'file-storage', 'avatars', 'frontend']
		},
		{
			name: 'frontend + admin + jobs + audit',
			features: ['core', 'auth', 'admin', 'jobs', 'audit', 'frontend']
		},
		// Sub-features without admin (edge case - must not leak admin files)
		{
			name: 'frontend + jobs (no admin)',
			features: ['core', 'auth', 'jobs', 'frontend']
		},
		{
			name: 'frontend + oauth (no admin)',
			features: ['core', 'auth', 'oauth', 'frontend']
		},
		{
			name: 'frontend + audit (no admin)',
			features: ['core', 'auth', 'audit', 'frontend']
		},
		{
			name: 'frontend full',
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
				'frontend'
			]
		}
	];

	for (const combo of combinations) {
		it(`${combo.name} has no @feature markers in output`, () => {
			const result = generateProject(
				{
					projectName: 'test',
					features: new Set<FeatureId>(combo.features),
					featureOptions: combo.featureOptions
				},
				source
			);

			for (const file of result.files) {
				expect(file.content, `Residual marker in ${file.path}`).not.toMatch(
					/^\s*\/\/\s*@feature\s/m
				);
				expect(file.content, `Residual @end in ${file.path}`).not.toMatch(/^\s*\/\/\s*@end\s*$/m);
				expect(file.content, `Residual HTML marker in ${file.path}`).not.toMatch(
					/<!--\s*@feature\s/m
				);
				expect(file.content, `Residual HTML @end in ${file.path}`).not.toMatch(
					/<!--\s*@end\s*-->/m
				);
			}
		});
	}
});

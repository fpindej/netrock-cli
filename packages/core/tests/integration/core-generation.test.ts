import { describe, it, expect, beforeAll } from 'vitest';
import { resolve } from 'node:path';
import { generateProject } from '../../src/engine/generator.js';
import { registerAllManifests } from '../../src/manifests/index.js';
import { createFsSource } from '../../src/engine/fs-source.js';
import type { TemplateSource } from '../../src/engine/types.js';
import type { FeatureId } from '../../src/features/types.js';

let source: TemplateSource;

beforeAll(() => {
	registerAllManifests();
	const templatesDir = resolve(__dirname, '../../../../templates');
	source = createFsSource(templatesDir);
});

describe('core-only generation', () => {
	it('generates files with correct namespace substitution', () => {
		const result = generateProject(
			{ projectName: 'my-app', features: new Set<FeatureId>(['core']) },
			source
		);

		// Should have files
		expect(result.files.length).toBeGreaterThan(50);

		// All paths should use MyApp, not MyProject
		const paths = result.files.map((f) => f.path);
		expect(paths.every((p) => !p.includes('MyProject'))).toBe(true);

		// Should contain key project files
		expect(paths).toContain('src/backend/MyApp.Domain/MyApp.Domain.csproj');
		expect(paths).toContain('src/backend/MyApp.Shared/Result.cs');
		expect(paths).toContain('src/backend/MyApp.WebApi/Program.cs');
		expect(paths).toContain('src/backend/MyApp.slnx');
		expect(paths).toContain('src/backend/MyApp.Infrastructure/Persistence/MyAppDbContext.cs');
	});

	it('strips auth-specific code from Program.cs', () => {
		const result = generateProject(
			{ projectName: 'test', features: new Set<FeatureId>(['core']) },
			source
		);

		const program = result.files.find((f) => f.path.endsWith('Program.cs'));
		expect(program).toBeDefined();

		// Should NOT contain auth-specific services
		expect(program!.content).not.toContain('AddIdentityServices');
		expect(program!.content).not.toContain('AddUserContext');
		expect(program!.content).not.toContain('AddCookieServices');
		expect(program!.content).not.toContain('AddAdminServices');
		expect(program!.content).not.toContain('AddAuditServices');
		expect(program!.content).not.toContain('AddEmailServices');
		expect(program!.content).not.toContain('AddJobScheduling');
		expect(program!.content).not.toContain('AddCaptchaServices');
		expect(program!.content).not.toContain('AddAvatarServices');
		expect(program!.content).not.toContain('UseAuthentication');
		expect(program!.content).not.toContain('UseAuthorization');
		expect(program!.content).not.toContain('UseJobScheduling');

		// Should contain core services
		expect(program!.content).toContain('AddPersistence');
		expect(program!.content).toContain('AddCors');
		expect(program!.content).toContain('AddHealthChecks');
		expect(program!.content).toContain('MapControllers');
		expect(program!.content).toContain('MapHealthCheckEndpoints');

		// No @feature markers should remain
		expect(program!.content).not.toContain('@feature');
		expect(program!.content).not.toContain('@end');
	});

	it('generates DbContext extending plain DbContext (not IdentityDbContext)', () => {
		const result = generateProject(
			{ projectName: 'test', features: new Set<FeatureId>(['core']) },
			source
		);

		const dbContext = result.files.find((f) => f.path.endsWith('TestDbContext.cs'));
		expect(dbContext).toBeDefined();

		// Should extend DbContext, not IdentityDbContext
		expect(dbContext!.content).toContain(': DbContext(options)');
		expect(dbContext!.content).not.toContain('IdentityDbContext');
		expect(dbContext!.content).not.toContain('ApplicationUser');
		expect(dbContext!.content).not.toContain('ApplicationRole');

		// Should NOT have auth-specific DbSets
		expect(dbContext!.content).not.toContain('RefreshTokens');
		expect(dbContext!.content).not.toContain('TwoFactorChallenges');
		expect(dbContext!.content).not.toContain('AuditEvents');
		expect(dbContext!.content).not.toContain('PausedJobs');

		// Should still have OnModelCreating
		expect(dbContext!.content).toContain('OnModelCreating');
		expect(dbContext!.content).toContain('ApplyFuzzySearch');
		expect(dbContext!.content).not.toContain('ApplyAuthSchema');
	});

	it('strips feature-specific packages from Infrastructure.csproj', () => {
		const result = generateProject(
			{ projectName: 'test', features: new Set<FeatureId>(['core']) },
			source
		);

		const csproj = result.files.find((f) =>
			f.path.endsWith('Test.Infrastructure/Test.Infrastructure.csproj')
		);
		expect(csproj).toBeDefined();

		// Should keep core packages
		expect(csproj!.content).toContain('Serilog');
		expect(csproj!.content).toContain('Npgsql.EntityFrameworkCore.PostgreSQL');

		// Should NOT have feature-specific packages
		expect(csproj!.content).not.toContain('Fluid.Core');
		expect(csproj!.content).not.toContain('MailKit');
		expect(csproj!.content).not.toContain('Hangfire');
		expect(csproj!.content).not.toContain('AWSSDK.S3');
		expect(csproj!.content).not.toContain('SkiaSharp');
		expect(csproj!.content).not.toContain('Identity.EntityFrameworkCore');
	});

	it('strips feature-specific projects from slnx', () => {
		const result = generateProject(
			{ projectName: 'test', features: new Set<FeatureId>(['core']) },
			source
		);

		const slnx = result.files.find((f) => f.path.endsWith('.slnx'));
		expect(slnx).toBeDefined();

		// Should have core projects
		expect(slnx!.content).toContain('Test.Domain');
		expect(slnx!.content).toContain('Test.WebApi');
		expect(slnx!.content).toContain('Test.Unit.Tests');
		expect(slnx!.content).toContain('Test.Architecture.Tests');

		// Should have Aspire projects (required)
		expect(slnx!.content).toContain('AppHost');
		expect(slnx!.content).toContain('HealthProbe');

		// Should NOT have feature-specific projects
		expect(slnx!.content).not.toContain('Api.Tests');
		expect(slnx!.content).not.toContain('Component.Tests');
	});

	it('does not include auth-owned files in core-only output', () => {
		const result = generateProject(
			{ projectName: 'test', features: new Set<FeatureId>(['core']) },
			source
		);

		const paths = result.files.map((f) => f.path);

		// No auth controllers or services
		expect(paths.some((p) => p.includes('Features/Authentication'))).toBe(false);
		expect(paths.some((p) => p.includes('Features/Admin'))).toBe(false);
		expect(paths.some((p) => p.includes('Features/Audit'))).toBe(false);
		expect(paths.some((p) => p.includes('Features/Email'))).toBe(false);
		expect(paths.some((p) => p.includes('Features/Jobs'))).toBe(false);
		expect(paths.some((p) => p.includes('Identity/'))).toBe(false);
		expect(paths.some((p) => p.includes('Authorization/'))).toBe(false);
		expect(paths.some((p) => p.includes('Interceptors/'))).toBe(false);
	});

	it('generates secrets', () => {
		const result = generateProject(
			{ projectName: 'test', features: new Set<FeatureId>(['core']) },
			source
		);

		expect(result.secrets.jwtSecret.length).toBeGreaterThan(0);
		expect(result.secrets.encryptionKey.length).toBeGreaterThan(0);
	});

	it('populates summary correctly', () => {
		const result = generateProject(
			{ projectName: 'test', features: new Set<FeatureId>(['core']) },
			source
		);

		expect(result.summary.enabledFeatures).toEqual(['core']);
		expect(result.summary.totalFiles).toBeGreaterThan(50);
	});

	it('derives names correctly', () => {
		const result = generateProject(
			{ projectName: 'cool-project', features: new Set<FeatureId>(['core']) },
			source
		);

		expect(result.names.pascalCase).toBe('CoolProject');
		expect(result.names.kebabCase).toBe('cool-project');
	});
});

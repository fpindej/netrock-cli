import { describe, it, expect, beforeEach } from 'vitest';
import { generateProject } from '../../src/engine/generator.js';
import { registerManifest } from '../../src/features/manifest.js';
import type { TemplateSource } from '../../src/engine/types.js';

/** In-memory template source for testing. */
function createTestSource(files: Record<string, string>): TemplateSource {
	return {
		getFile(path: string) {
			return files[path];
		},
		listFiles() {
			return Object.keys(files);
		}
	};
}

beforeEach(() => {
	// Register test manifests
	registerManifest({
		featureId: 'core',
		files: [
			{ path: 'src/MyProject.Domain/MyProject.Domain.csproj', templated: false },
			{ path: 'src/MyProject.WebApi/Program.cs', templated: true }
		]
	});

	registerManifest({
		featureId: 'auth',
		files: [
			{ path: 'src/MyProject.WebApi/Features/Auth/AuthController.cs', templated: false }
		]
	});

	registerManifest({
		featureId: 'audit',
		files: [
			{ path: 'src/MyProject.Infrastructure/Features/Audit/AuditService.cs', templated: false }
		]
	});
});

describe('generateProject', () => {
	it('includes files from enabled features only', () => {
		const source = createTestSource({
			'src/MyProject.Domain/MyProject.Domain.csproj': '<Project />',
			'src/MyProject.WebApi/Program.cs': 'var builder = WebApplication.CreateBuilder();',
			'src/MyProject.WebApi/Features/Auth/AuthController.cs': 'public class AuthController {}',
			'src/MyProject.Infrastructure/Features/Audit/AuditService.cs': 'public class AuditService {}'
		});

		const result = generateProject(
			{ projectName: 'cool-app', features: new Set(['core', 'auth']) },
			source
		);

		const paths = result.files.map((f) => f.path);
		expect(paths).toContain('src/CoolApp.Domain/CoolApp.Domain.csproj');
		expect(paths).toContain('src/CoolApp.WebApi/Features/Auth/AuthController.cs');
		expect(paths).not.toContain(expect.stringContaining('Audit'));
	});

	it('substitutes namespace in file content', () => {
		const source = createTestSource({
			'src/MyProject.Domain/MyProject.Domain.csproj': '<RootNamespace>MyProject.Domain</RootNamespace>',
			'src/MyProject.WebApi/Program.cs': 'using MyProject.Domain;',
			'src/MyProject.WebApi/Features/Auth/AuthController.cs':
				'namespace MyProject.WebApi.Features.Auth;'
		});

		const result = generateProject(
			{ projectName: 'cool-app', features: new Set(['core', 'auth']) },
			source
		);

		const csproj = result.files.find((f) => f.path.endsWith('.csproj'));
		expect(csproj?.content).toContain('CoolApp.Domain');
		expect(csproj?.content).not.toContain('MyProject');

		const controller = result.files.find((f) => f.path.endsWith('AuthController.cs'));
		expect(controller?.content).toContain('CoolApp.WebApi');
	});

	it('substitutes namespace in file paths', () => {
		const source = createTestSource({
			'src/MyProject.Domain/MyProject.Domain.csproj': '<Project />',
			'src/MyProject.WebApi/Program.cs': 'app.Run();',
			'src/MyProject.WebApi/Features/Auth/AuthController.cs': 'class AuthController {}'
		});

		const result = generateProject(
			{ projectName: 'cool-app', features: new Set(['core', 'auth']) },
			source
		);

		const paths = result.files.map((f) => f.path);
		expect(paths.every((p) => !p.includes('MyProject'))).toBe(true);
		expect(paths.some((p) => p.includes('CoolApp'))).toBe(true);
	});

	it('processes @feature markers in templated files', () => {
		const source = createTestSource({
			'src/MyProject.Domain/MyProject.Domain.csproj': '<Project />',
			'src/MyProject.WebApi/Program.cs': [
				'var builder = WebApplication.CreateBuilder();',
				'// @feature audit',
				'builder.Services.AddAuditTrail();',
				'// @end',
				'app.Run();'
			].join('\n'),
			'src/MyProject.WebApi/Features/Auth/AuthController.cs': 'class AuthController {}'
		});

		// Without audit feature
		const result = generateProject(
			{ projectName: 'test', features: new Set(['core', 'auth']) },
			source
		);

		const program = result.files.find((f) => f.path.endsWith('Program.cs'));
		expect(program?.content).not.toContain('AddAuditTrail');
		expect(program?.content).toContain('app.Run();');
	});

	it('replaces secret placeholders', () => {
		const source = createTestSource({
			'src/MyProject.Domain/MyProject.Domain.csproj': '<Project />',
			'src/MyProject.WebApi/Program.cs': 'app.Run();',
			'src/MyProject.WebApi/appsettings.json':
				'{ "Jwt": { "Secret": "{INIT_JWT_SECRET}" }, "Encryption": { "Key": "{INIT_ENCRYPTION_KEY}" } }'
		});

		registerManifest({
			featureId: 'core',
			files: [
				{ path: 'src/MyProject.Domain/MyProject.Domain.csproj', templated: false },
				{ path: 'src/MyProject.WebApi/Program.cs', templated: true },
				{ path: 'src/MyProject.WebApi/appsettings.json', templated: true }
			]
		});

		const result = generateProject(
			{ projectName: 'test', features: new Set(['core', 'auth']) },
			source
		);

		const appsettings = result.files.find((f) => f.path.endsWith('appsettings.json'));
		expect(appsettings?.content).not.toContain('{INIT_JWT_SECRET}');
		expect(appsettings?.content).not.toContain('{INIT_ENCRYPTION_KEY}');
		expect(result.secrets.jwtSecret.length).toBeGreaterThan(0);
		expect(result.secrets.encryptionKey.length).toBeGreaterThan(0);
	});

	it('populates summary correctly', () => {
		const source = createTestSource({
			'src/MyProject.Domain/MyProject.Domain.csproj': '<Project />',
			'src/MyProject.WebApi/Program.cs': 'app.Run();',
			'src/MyProject.WebApi/Features/Auth/AuthController.cs': 'class AuthController {}'
		});

		const result = generateProject(
			{ projectName: 'test', features: new Set(['core', 'auth']) },
			source
		);

		expect(result.summary.totalFiles).toBe(3);
		expect(result.summary.enabledFeatures).toContain('core');
		expect(result.summary.enabledFeatures).toContain('auth');
	});

	it('derives project names correctly', () => {
		const source = createTestSource({
			'src/MyProject.Domain/MyProject.Domain.csproj': '<Project />',
			'src/MyProject.WebApi/Program.cs': 'app.Run();'
		});

		const result = generateProject(
			{ projectName: 'my-cool-app', features: new Set(['core']) },
			source
		);

		expect(result.names.pascalCase).toBe('MyCoolApp');
		expect(result.names.kebabCase).toBe('my-cool-app');
		expect(result.names.camelCase).toBe('myCoolApp');
		expect(result.names.lowercase).toBe('mycoolapp');
	});
});

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { resolve, join, dirname } from 'node:path';
import { mkdtempSync, writeFileSync, mkdirSync, rmSync, realpathSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { generateProject } from '../../src/engine/generator.js';
import { registerAllManifests } from '../../src/manifests/index.js';
import { createFsSource } from '../../src/engine/fs-source.js';
import type { FeatureId } from '../../src/features/types.js';

let outputDir: string;

beforeAll(() => {
	registerAllManifests();
	const templatesDir = resolve(__dirname, '../../../../templates');
	const source = createFsSource(templatesDir);

	const result = generateProject(
		{ projectName: 'test-app', features: new Set<FeatureId>(['core', 'aspire']) },
		source
	);

	// Resolve symlinks so MSBuild sees a single canonical path
	// (macOS: /tmp -> /private/tmp causes StaticWebAssets race conditions)
	outputDir = realpathSync(mkdtempSync('/tmp/netrock-e2e-'));

	for (const file of result.files) {
		const fullPath = join(outputDir, file.path);
		mkdirSync(dirname(fullPath), { recursive: true });
		writeFileSync(fullPath, file.content, 'utf-8');
	}
	for (const file of result.binaryFiles) {
		const fullPath = join(outputDir, file.path);
		mkdirSync(dirname(fullPath), { recursive: true });
		writeFileSync(fullPath, file.data);
	}
}, 30_000);

afterAll(() => {
	if (outputDir) {
		rmSync(outputDir, { recursive: true, force: true });
	}
});

describe('core-only dotnet build', () => {
	it('dotnet restore succeeds', () => {
		const slnPath = join(outputDir, 'src/backend/TestApp.slnx');
		const result = execSync(`dotnet restore "${slnPath}" --nologo`, {
			encoding: 'utf-8',
			timeout: 120_000,
			stdio: ['pipe', 'pipe', 'pipe']
		});

		expect(result).toBeDefined();
	}, 120_000);

	it('dotnet build succeeds', () => {
		const slnPath = join(outputDir, 'src/backend/TestApp.slnx');
		const result = execSync(`dotnet build "${slnPath}" --nologo --no-restore`, {
			encoding: 'utf-8',
			timeout: 120_000,
			stdio: ['pipe', 'pipe', 'pipe']
		});

		expect(result).toContain('Build succeeded');
	}, 120_000);

	it('dotnet test succeeds', () => {
		const slnPath = join(outputDir, 'src/backend/TestApp.slnx');
		const result = execSync(`dotnet test "${slnPath}" --nologo --no-build`, {
			encoding: 'utf-8',
			timeout: 120_000,
			stdio: ['pipe', 'pipe', 'pipe']
		});

		expect(result).toContain('Passed!');
	}, 120_000);
});

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { resolve, join, dirname } from 'node:path';
import { mkdtempSync, writeFileSync, mkdirSync, rmSync, realpathSync } from 'node:fs';
import { execSync } from 'node:child_process';
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

interface Combination {
	name: string;
	features: FeatureId[];
}

const combinations: Combination[] = [
	{
		name: 'minimal (core + auth)',
		features: ['core', 'auth']
	},
	{
		name: 'core + auth + 2fa',
		features: ['core', 'auth', '2fa']
	},
	{
		name: 'core + auth + oauth',
		features: ['core', 'auth', 'oauth']
	},
	{
		name: 'core + auth + jobs',
		features: ['core', 'auth', 'jobs']
	},
	{
		name: 'core + auth + audit + admin',
		features: ['core', 'auth', 'audit', 'admin']
	},
	{
		name: 'core + auth + file-storage + avatars',
		features: ['core', 'auth', 'file-storage', 'avatars']
	},
	{
		name: 'core + audit',
		features: ['core', 'audit']
	},
	{
		name: 'core + auth + captcha',
		features: ['core', 'auth', 'captcha']
	},
	{
		name: 'api-only (all except frontend)',
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

/** Writes generated project to disk and returns the output directory. */
function writeProject(combo: Combination): string {
	const result = generateProject(
		{ projectName: 'matrix-test', features: new Set<FeatureId>(combo.features) },
		source
	);

	const outputDir = realpathSync(mkdtempSync('/tmp/netrock-matrix-'));

	for (const file of result.files) {
		const fullPath = join(outputDir, file.path);
		mkdirSync(dirname(fullPath), { recursive: true });
		writeFileSync(fullPath, file.content, 'utf-8');
	}

	return outputDir;
}

describe.each(combinations)('$name', (combo) => {
	let outputDir: string;

	beforeAll(() => {
		outputDir = writeProject(combo);
	}, 30_000);

	afterAll(() => {
		if (outputDir) {
			rmSync(outputDir, { recursive: true, force: true });
		}
	});

	it('dotnet build succeeds', () => {
		const slnPath = join(outputDir, 'src/backend/MatrixTest.slnx');
		const result = execSync(`dotnet build "${slnPath}" --nologo`, {
			encoding: 'utf-8',
			timeout: 180_000,
			stdio: ['pipe', 'pipe', 'pipe']
		});

		expect(result).toContain('Build succeeded');
	}, 180_000);

	it('dotnet test succeeds', () => {
		const slnPath = join(outputDir, 'src/backend/MatrixTest.slnx');
		const result = execSync(`dotnet test "${slnPath}" -c Release --nologo`, {
			encoding: 'utf-8',
			timeout: 300_000,
			stdio: ['pipe', 'pipe', 'pipe']
		});

		expect(result).toContain('Passed!');
	}, 300_000);
});

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

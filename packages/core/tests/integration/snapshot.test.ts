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
function generateFileList(features: FeatureId[]): string[] {
	const result = generateProject(
		{ projectName: 'snapshot-app', features: new Set<FeatureId>(features) },
		source
	);
	return result.files.map((f) => f.path).sort();
}

/** Generates content of a specific file for a given feature set. */
function generateFileContent(features: FeatureId[], filePathSuffix: string): string {
	const result = generateProject(
		{ projectName: 'snapshot-app', features: new Set<FeatureId>(features) },
		source
	);
	const file = result.files.find((f) => f.path.endsWith(filePathSuffix));
	if (!file) {
		throw new Error(`File ending with '${filePathSuffix}' not found in generated output`);
	}
	return file.content;
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

	it('api-only preset file list', () => {
		const preset = presets.find((p) => p.id === 'api-only')!;
		const files = generateFileList(preset.features as FeatureId[]);
		expect(files).toMatchSnapshot();
	});

	it('full preset file list', () => {
		const preset = presets.find((p) => p.id === 'full')!;
		const files = generateFileList(preset.features as FeatureId[]);
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
			const content = generateFileContent(preset.features as FeatureId[], 'Program.cs');
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
				'SnapshotAppDbContext.cs'
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
				'WebApi/appsettings.json'
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
				'appsettings.Testing.json'
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
				'SnapshotApp.Infrastructure/SnapshotApp.Infrastructure.csproj'
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
				'SnapshotApp.slnx'
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
				'ErrorMessages.cs'
			);
			expect(content).toMatchSnapshot();
		});
	});
});

describe('no residual markers', () => {
	const combinations: { name: string; features: FeatureId[] }[] = [
		{ name: 'core-only', features: ['core'] },
		{ name: 'minimal', features: ['core', 'auth'] },
		{ name: 'core + auth + 2fa + oauth', features: ['core', 'auth', '2fa', 'oauth'] },
		{ name: 'core + jobs', features: ['core', 'jobs'] },
		{
			name: 'full',
			features: presets.find((p) => p.id === 'full')!.features as FeatureId[]
		}
	];

	for (const combo of combinations) {
		it(`${combo.name} has no @feature markers in output`, () => {
			const result = generateProject(
				{ projectName: 'test', features: new Set<FeatureId>(combo.features) },
				source
			);

			for (const file of result.files) {
				expect(file.content, `Residual marker in ${file.path}`).not.toMatch(
					/^\s*\/\/\s*@feature\s/m
				);
				expect(file.content, `Residual @end in ${file.path}`).not.toMatch(
					/^\s*\/\/\s*@end\s*$/m
				);
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

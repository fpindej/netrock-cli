#!/usr/bin/env tsx
import { input, select, checkbox, confirm } from '@inquirer/prompts';
import { resolve, join, dirname } from 'node:path';
import { writeFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs';
import {
	generateProject,
	registerAllManifests,
	createFsSource,
	resolveFeatures,
	featureDefinitions,
	presets,
	getManifests
} from '@netrock/core';
import type { FeatureId, FeatureGroup } from '@netrock/core';

const groupLabels: Record<FeatureGroup, string> = {
	core: 'Core',
	authentication: 'Authentication',
	infrastructure: 'Infrastructure',
	frontend: 'Frontend'
};

const groupOrder: FeatureGroup[] = ['core', 'authentication', 'infrastructure', 'frontend'];

async function main(): Promise<void> {
	console.log('\nNetrock Project Generator\n');

	// 1. Project name
	const projectName = await input({
		message: 'Project name (kebab-case)',
		default: 'my-app',
		validate: (value) => {
			if (!/^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(value)) {
				return 'Must be kebab-case (e.g. my-app, cool-project)';
			}
			return true;
		}
	});

	// 2. Preset or custom
	const mode = await select({
		message: 'Configuration',
		choices: [
			...presets.map((p) => ({
				name: `${p.name} - ${p.description}`,
				value: p.id
			})),
			{ name: 'Custom - pick features individually', value: 'custom' }
		]
	});

	let selectedFeatures: Set<FeatureId>;

	if (mode === 'custom') {
		// Group features for the picker
		const choices = groupOrder.flatMap((group) => {
			const groupFeatures = featureDefinitions.filter((f) => f.group === group);
			if (groupFeatures.length === 0) return [];

			return [
				{ name: groupLabels[group], value: '' as FeatureId, disabled: '---' as const },
				...groupFeatures.map((f) => ({
					name: `${f.name} - ${f.description}`,
					value: f.id,
					checked: f.defaultEnabled,
					disabled: f.required ? '(required)' as const : false as const
				}))
			];
		});

		const picked = await checkbox({
			message: 'Features (space to toggle, enter to confirm)',
			choices
		});

		selectedFeatures = resolveFeatures(new Set(picked));
	} else {
		const preset = presets.find((p) => p.id === mode);
		selectedFeatures = resolveFeatures(new Set(preset!.features));
	}

	// 3. Output directory
	const defaultDir = resolve(projectName);
	const outputDir = await input({
		message: 'Output directory',
		default: defaultDir
	});
	const resolvedOutput = resolve(outputDir);

	// 4. Check if directory exists and has files
	if (existsSync(resolvedOutput) && readdirSync(resolvedOutput).length > 0) {
		const overwrite = await confirm({
			message: `${resolvedOutput} is not empty. Overwrite?`,
			default: false
		});
		if (!overwrite) {
			console.log('Aborted.');
			process.exit(0);
		}
	}

	// 5. Generate
	console.log('\nGenerating...\n');

	registerAllManifests();
	const templatesDir = resolve(import.meta.dirname!, '..', 'templates');
	const source = createFsSource(templatesDir);

	const result = generateProject(
		{ projectName, features: selectedFeatures },
		source
	);

	for (const file of result.files) {
		const fullPath = join(resolvedOutput, file.path);
		mkdirSync(dirname(fullPath), { recursive: true });
		writeFileSync(fullPath, file.content, 'utf-8');
	}

	// 6. Summary
	const effectiveSet = new Set(result.summary.enabledFeatures);
	const skipped = [...selectedFeatures].filter((f) => !effectiveSet.has(f));
	const featureNames = featureDefinitions
		.filter((f) => effectiveSet.has(f.id))
		.map((f) => f.name);

	console.log(`Project:    ${result.names.pascalCase}`);
	console.log(`Output:     ${resolvedOutput}`);
	console.log(`Files:      ${result.summary.totalFiles}`);
	console.log(`Features:   ${featureNames.join(', ')}`);

	if (skipped.length > 0) {
		const skippedNames = featureDefinitions
			.filter((f) => skipped.includes(f.id))
			.map((f) => f.name);
		console.log(`\nSkipped (not yet implemented): ${skippedNames.join(', ')}`);
	}
	console.log();

	console.log('Next steps:\n');
	console.log(`  cd ${outputDir}`);
	if (effectiveSet.has('aspire')) {
		console.log('  dotnet run --project src/backend/*.AppHost');
	} else {
		console.log(`  dotnet build src/backend/${result.names.pascalCase}.slnx`);
		console.log(`  dotnet run --project src/backend/${result.names.pascalCase}.WebApi`);
	}
	if (effectiveSet.has('frontend')) {
		console.log('  cd src/frontend && pnpm install && pnpm dev');
	}
	console.log();
}

main().catch((error: unknown) => {
	if (error instanceof Error && error.message === 'User force closed the prompt with 0 null') {
		console.log('\nAborted.');
		process.exit(0);
	}
	console.error(error);
	process.exit(1);
});

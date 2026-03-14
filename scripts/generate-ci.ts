#!/usr/bin/env tsx
import { resolve, join, dirname } from 'node:path';
import { writeFileSync, mkdirSync } from 'node:fs';
import { parseArgs } from 'node:util';
import { generateProject, registerAllManifests, resolveFeatures } from '@netrock/core';
import { createFsSource } from '@netrock/core/node';
import type { FeatureId } from '@netrock/core';

const { values } = parseArgs({
	options: {
		name: { type: 'string' },
		features: { type: 'string' },
		output: { type: 'string' }
	}
});

if (!values.name || !values.features || !values.output) {
	console.error(
		'Usage: generate-ci.ts --name <project-name> --features <comma-separated> --output <dir>'
	);
	process.exit(1);
}

const features = values.features.split(',').map((f) => f.trim()) as FeatureId[];
const selectedFeatures = resolveFeatures(new Set(features));

registerAllManifests();
const templatesDir = resolve(import.meta.dirname!, '..', 'templates');
const source = createFsSource(templatesDir);

const result = generateProject({ projectName: values.name, features: selectedFeatures }, source);

const outputDir = resolve(values.output);

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

console.log(`Generated ${result.summary.totalFiles} files to ${outputDir}`);
console.log(`Features: ${result.summary.enabledFeatures.join(', ')}`);

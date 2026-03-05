import type { GeneratorConfig, GeneratedProject, GeneratedFile, TemplateSource } from './types.js';
import type { FeatureId } from '../features/types.js';
import { getManifests } from '../features/manifest.js';
import { processTemplate } from './processor.js';
import { deriveNames, substituteNamespace, substitutePathNamespace } from './naming.js';
import { generateJwtSecret, generateEncryptionKey } from './secrets.js';

/**
 * Generates a complete project from templates and configuration.
 *
 * This is the main entry point for project generation. It:
 * 1. Derives all name formats from the project name
 * 2. Collects template files for enabled features
 * 3. Processes conditional `@feature` markers in templated files
 * 4. Substitutes the project namespace in content and paths
 * 5. Replaces secret placeholders with generated values
 * 6. Returns the complete set of generated files
 *
 * @param config - The generator configuration (project name + features)
 * @param source - The template source providing raw file contents
 * @returns The complete generated project
 */
export function generateProject(config: GeneratorConfig, source: TemplateSource): GeneratedProject {
	const names = deriveNames(config.projectName);
	const secrets = {
		jwtSecret: generateJwtSecret(),
		encryptionKey: generateEncryptionKey()
	};

	// Collect all file paths to include from feature manifests
	const filesToInclude = collectFiles(config.features);

	// Process each file
	const files: GeneratedFile[] = [];

	for (const { path, templated } of filesToInclude) {
		const rawContent = source.getFile(path);
		if (rawContent === undefined) continue;

		// Process conditional markers if this is a templated file
		let content = templated ? processTemplate(rawContent, config.features) : rawContent;

		// Substitute namespace placeholders
		content = substituteNamespace(content, names);

		// Substitute secret placeholders
		content = content
			.replaceAll('{INIT_JWT_SECRET}', secrets.jwtSecret)
			.replaceAll('{INIT_ENCRYPTION_KEY}', secrets.encryptionKey);

		// Substitute path namespace
		const outputPath = substitutePathNamespace(path, names);

		files.push({ path: outputPath, content });
	}

	return {
		files,
		names,
		secrets,
		summary: {
			totalFiles: files.length,
			enabledFeatures: [...config.features]
		}
	};
}

/**
 * Collects all files to include based on enabled features.
 * Deduplicates shared/templated files that appear in multiple manifests.
 */
function collectFiles(
	features: Set<FeatureId>
): { path: string; templated: boolean }[] {
	const manifests = getManifests();
	const fileMap = new Map<string, boolean>();

	for (const featureId of features) {
		const manifest = manifests.get(featureId);
		if (!manifest) continue;

		for (const entry of manifest.files) {
			// If a file is already included, upgrade to templated if needed
			const existing = fileMap.get(entry.path);
			if (existing === undefined) {
				fileMap.set(entry.path, entry.templated);
			} else if (entry.templated && !existing) {
				fileMap.set(entry.path, true);
			}
		}
	}

	return [...fileMap.entries()].map(([path, templated]) => ({ path, templated }));
}

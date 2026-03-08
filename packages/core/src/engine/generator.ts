import type { GeneratorConfig, GeneratedProject, GeneratedFile, TemplateSource } from './types.js';
import type { FeatureId } from '../features/types.js';
import { getManifests } from '../features/manifest.js';
import { featureDefinitions } from '../features/definitions.js';
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

	// Only treat features as enabled if they have a registered manifest.
	// This prevents template markers from referencing unimplemented features
	// (e.g. @feature auth keeping lines when auth files don't exist).
	const manifests = getManifests();
	const effectiveFeatures = new Set([...config.features].filter((f) => manifests.has(f)));

	// Build the set of selected options per feature, using defaults for unspecified features
	const selectedOptions = resolveOptions(effectiveFeatures, config.featureOptions);

	// Build the complete tag set for template processing:
	// plain feature IDs + colon-qualified option tags (e.g., "oauth:google")
	const enabledTags = new Set<string>(effectiveFeatures);
	for (const [featureId, options] of selectedOptions) {
		for (const option of options) {
			enabledTags.add(`${featureId}:${option}`);
		}
	}

	// Collect all file paths to include from feature manifests
	const filesToInclude = collectFiles(effectiveFeatures, selectedOptions);

	// Process each file
	const files: GeneratedFile[] = [];

	for (const { path, templated } of filesToInclude) {
		const rawContent = source.getFile(path);
		if (rawContent === undefined) continue;

		// Process conditional markers if this is a templated file
		let content = templated ? processTemplate(rawContent, enabledTags) : rawContent;

		// Substitute namespace placeholders
		content = substituteNamespace(content, names);

		// Substitute secret and config placeholders
		content = content
			.replaceAll('{INIT_JWT_SECRET}', secrets.jwtSecret)
			.replaceAll('{INIT_ENCRYPTION_KEY}', secrets.encryptionKey)
			.replaceAll('{INIT_PROJECT_SLUG}', names.kebabCase)
			.replaceAll('{INIT_FRONTEND_PORT}', '5173')
			.replaceAll('{INIT_API_PORT}', '5175');

		// Skip files that become empty after template processing
		if (templated && content.trim() === '') continue;

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
			enabledFeatures: [...effectiveFeatures]
		}
	};
}

/**
 * Resolves selected options for each feature that defines them.
 * Uses explicit selections from config when provided, otherwise falls back
 * to the default-enabled options from the feature definition.
 */
function resolveOptions(
	features: Set<FeatureId>,
	configOptions?: Map<FeatureId, Set<string>>
): Map<FeatureId, Set<string>> {
	const result = new Map<FeatureId, Set<string>>();

	for (const featureId of features) {
		const definition = featureDefinitions.find((f) => f.id === featureId);
		if (!definition?.options) continue;

		const explicit = configOptions?.get(featureId);
		if (explicit) {
			result.set(featureId, explicit);
		} else {
			// Use defaults from the feature definition
			const defaults = new Set(definition.options.filter((o) => o.defaultEnabled).map((o) => o.id));
			result.set(featureId, defaults);
		}
	}

	return result;
}

/**
 * Collects all files to include based on enabled features and selected options.
 * Files with an `option` field are only included if that option is selected.
 * Deduplicates shared/templated files that appear in multiple manifests.
 */
function collectFiles(
	features: Set<FeatureId>,
	selectedOptions: Map<FeatureId, Set<string>>
): { path: string; templated: boolean }[] {
	const manifests = getManifests();
	const fileMap = new Map<string, boolean>();

	for (const featureId of features) {
		const manifest = manifests.get(featureId);
		if (!manifest) continue;

		const featureOptions = selectedOptions.get(featureId);

		for (const entry of manifest.files) {
			// Skip files gated to an unselected option
			if (entry.option && !featureOptions?.has(entry.option)) continue;

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

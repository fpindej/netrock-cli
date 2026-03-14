import type {
	GeneratorConfig,
	GeneratedProject,
	GeneratedFile,
	BinaryFile,
	TemplateSource
} from './types.js';
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
 * 2. Collects template files for enabled features (text and binary separately)
 * 3. Processes conditional `@feature` markers in templated text files
 * 4. Substitutes the project namespace in content and paths
 * 5. Replaces secret placeholders with generated values
 * 6. Passes binary files through with path substitution only
 * 7. Returns the complete set of generated files
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
	const manifests = getManifests();
	const effectiveFeatures = new Set([...config.features].filter((f) => manifests.has(f)));

	// Build the set of selected options per feature, using defaults for unspecified features
	const selectedOptions = resolveOptions(effectiveFeatures, config.featureOptions);

	// Build the complete tag set for template processing
	const enabledTags = new Set<string>(effectiveFeatures);
	for (const [featureId, options] of selectedOptions) {
		for (const option of options) {
			enabledTags.add(`${featureId}:${option}`);
		}
	}

	// Collect files separated by type
	const { textFiles, binaryPaths } = collectFiles(effectiveFeatures, selectedOptions);

	// Process text files
	const files: GeneratedFile[] = [];

	for (const { path, templated } of textFiles) {
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

		const outputPath = substitutePathNamespace(path, names);
		files.push({ path: outputPath, content });
	}

	// Collect binary files (path substitution only, no content processing)
	const binaryFiles: BinaryFile[] = [];

	for (const path of binaryPaths) {
		const data = source.getBinaryFile(path);
		if (data === undefined) continue;

		const outputPath = substitutePathNamespace(path, names);
		binaryFiles.push({ path: outputPath, data });
	}

	return {
		files,
		binaryFiles,
		names,
		secrets,
		summary: {
			totalFiles: files.length + binaryFiles.length,
			enabledFeatures: [...effectiveFeatures]
		}
	};
}

/**
 * Resolves selected options for each feature that defines them.
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
			const defaults = new Set(definition.options.filter((o) => o.defaultEnabled).map((o) => o.id));
			result.set(featureId, defaults);
		}
	}

	return result;
}

/**
 * Collects all files to include based on enabled features and selected options.
 * Separates text files from binary files based on the manifest entry's `binary` flag.
 */
function collectFiles(
	features: Set<FeatureId>,
	selectedOptions: Map<FeatureId, Set<string>>
): { textFiles: { path: string; templated: boolean }[]; binaryPaths: string[] } {
	const manifests = getManifests();
	const textMap = new Map<string, boolean>();
	const binarySet = new Set<string>();

	for (const featureId of features) {
		const manifest = manifests.get(featureId);
		if (!manifest) continue;

		const featureOptions = selectedOptions.get(featureId);

		for (const entry of manifest.files) {
			// Skip files gated to an unselected option
			if (entry.option && !featureOptions?.has(entry.option)) continue;

			// Skip frontend files from non-frontend manifests when frontend is disabled
			if (entry.path.startsWith('src/frontend/') && !features.has('frontend')) continue;

			if (entry.binary) {
				binarySet.add(entry.path);
			} else {
				// If a file is already included, upgrade to templated if needed
				const existing = textMap.get(entry.path);
				if (existing === undefined) {
					textMap.set(entry.path, entry.templated);
				} else if (entry.templated && !existing) {
					textMap.set(entry.path, true);
				}
			}
		}
	}

	return {
		textFiles: [...textMap.entries()].map(([path, templated]) => ({ path, templated })),
		binaryPaths: [...binarySet]
	};
}

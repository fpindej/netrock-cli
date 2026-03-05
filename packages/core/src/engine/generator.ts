import type { GeneratorConfig, GeneratedFile } from './types.js';

/**
 * Generates a complete project from templates and configuration.
 *
 * This is the main entry point for project generation. It:
 * 1. Collects template files for enabled features
 * 2. Processes conditional markers in each file
 * 3. Substitutes the project namespace
 * 4. Returns the complete set of generated files
 *
 * @param config - The generator configuration (project name + features)
 * @returns Array of generated files ready for output
 */
export function generateProject(_config: GeneratorConfig): GeneratedFile[] {
	// TODO: Implement in #24 (scaffolding engine)
	// 1. Load template manifest for each enabled feature
	// 2. Collect all template files (deduplicating shared files)
	// 3. Process each file through processTemplate()
	// 4. Apply namespace substitution (MyProject -> config.projectName)
	// 5. Return GeneratedFile[]
	return [];
}

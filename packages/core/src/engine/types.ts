import type { FeatureId } from '../features/types.js';

/** Configuration for project generation. */
export interface GeneratorConfig {
	/** The project name (replaces MyProject in templates). */
	projectName: string;

	/** The set of features to include. */
	features: Set<FeatureId>;
}

/** A single generated file ready for output. */
export interface GeneratedFile {
	/** Relative path from the project root (with namespace already substituted). */
	path: string;

	/** File content (with namespace substituted and feature markers processed). */
	content: string;
}

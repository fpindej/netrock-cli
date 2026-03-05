import type { FeatureId } from '../features/types.js';
import type { ProjectNames } from './naming.js';

/** Configuration for project generation. */
export interface GeneratorConfig {
	/** The project name as entered by the user (any format). */
	projectName: string;

	/** The set of features to include (should be pre-resolved via resolveFeatures). */
	features: Set<FeatureId>;
}

/** A single generated file ready for output. */
export interface GeneratedFile {
	/** Relative path from the project root (with namespace already substituted). */
	path: string;

	/** File content (with namespace substituted and feature markers processed). */
	content: string;
}

/** The complete result of project generation. */
export interface GeneratedProject {
	/** All generated files. */
	files: GeneratedFile[];

	/** The derived project name formats. */
	names: ProjectNames;

	/** Generated secrets for the project. */
	secrets: {
		jwtSecret: string;
		encryptionKey: string;
	};

	/** Summary statistics. */
	summary: {
		totalFiles: number;
		enabledFeatures: FeatureId[];
	};
}

/**
 * A template source provides the raw content of template files.
 *
 * This abstraction allows different template loading strategies:
 * - Bundled templates (web: imported at build time)
 * - Filesystem templates (CLI: read from disk)
 */
export interface TemplateSource {
	/** Returns the raw content of a template file, or undefined if not found. */
	getFile(path: string): string | undefined;

	/** Returns all available template file paths. */
	listFiles(): string[];
}

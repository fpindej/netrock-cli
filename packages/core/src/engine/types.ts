import type { FeatureId } from '../features/types.js';
import type { ProjectNames } from './naming.js';

/** Configuration for project generation. */
export interface GeneratorConfig {
	/** The project name as entered by the user (any format). */
	projectName: string;

	/** The set of features to include (should be pre-resolved via resolveFeatures). */
	features: Set<FeatureId>;

	/**
	 * Selected sub-options per feature (e.g., which OAuth providers to include).
	 * Keys are feature IDs, values are sets of selected option IDs.
	 * Omitted features use all default-enabled options from their definition.
	 */
	featureOptions?: Map<FeatureId, Set<string>>;
}

/** A single generated text file ready for output. */
export interface GeneratedFile {
	/** Relative path from the project root (with namespace already substituted). */
	path: string;

	/** File content (with namespace substituted and feature markers processed). */
	content: string;
}

/** A binary file to include in the output as-is (no text processing). */
export interface BinaryFile {
	/** Relative path from the project root (with namespace already substituted). */
	path: string;

	/** Raw binary content. */
	data: Uint8Array;
}

/** The complete result of project generation. */
export interface GeneratedProject {
	/** Generated text files (namespace-substituted, feature-gated). */
	files: GeneratedFile[];

	/** Binary files passed through without processing. */
	binaryFiles: BinaryFile[];

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
	/** Returns the raw content of a text template file, or undefined if not found. */
	getFile(path: string): string | undefined;

	/** Returns the raw binary content of a file, or undefined if not found. */
	getBinaryFile(path: string): Uint8Array | undefined;

	/** Returns all available template file paths. */
	listFiles(): string[];
}

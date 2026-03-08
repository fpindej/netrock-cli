import type { FeatureId } from './types.js';

/**
 * A template file entry in a feature manifest.
 *
 * Each entry describes a single file that belongs to a feature.
 * Files can be either static (included as-is) or templated (processed
 * through the `@feature` marker processor).
 */
export interface TemplateEntry {
	/** Relative path from template root (uses MyProject as placeholder). */
	path: string;

	/**
	 * Whether this file contains `@feature` conditional markers.
	 * Static files are copied as-is. Templated files are processed
	 * to strip/keep conditional blocks.
	 */
	templated: boolean;

	/**
	 * If set, this file is only included when the specified option is selected
	 * for its parent feature (e.g., `option: 'google'` on an oauth manifest file).
	 */
	option?: string;
}

/**
 * A feature module manifest declaring what files the feature contributes.
 */
export interface FeatureManifest {
	/** The feature this manifest belongs to. */
	featureId: FeatureId;

	/** Files owned exclusively by this feature (included when feature is selected). */
	files: TemplateEntry[];

	/**
	 * Shared files that this feature adds conditional sections to.
	 * These files are always included (owned by core or another feature)
	 * but contain `@feature` markers for this feature's sections.
	 *
	 * Listed here for documentation - the actual conditional stripping
	 * is handled by the template processor based on the enabled feature set.
	 */
	sharedFiles?: string[];
}

/**
 * Registry of all feature manifests.
 *
 * Populated by Phase 3 feature module implementations.
 * Each feature module registers its manifest here.
 */
const manifests = new Map<FeatureId, FeatureManifest>();

/** Registers a feature manifest. */
export function registerManifest(manifest: FeatureManifest): void {
	manifests.set(manifest.featureId, manifest);
}

/** Gets all registered manifests. */
export function getManifests(): Map<FeatureId, FeatureManifest> {
	return manifests;
}

/** Gets a specific feature's manifest. */
export function getManifest(featureId: FeatureId): FeatureManifest | undefined {
	return manifests.get(featureId);
}

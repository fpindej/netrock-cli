import type { FeatureId } from '../features/types.js';

/** A named preset configuration for quick project setup. */
export interface Preset {
	/** Unique preset identifier. */
	id: string;

	/** Human-readable name. */
	name: string;

	/** Short description of what this preset includes. */
	description: string;

	/** The features enabled by this preset. */
	features: FeatureId[];
}

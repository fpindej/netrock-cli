/** Unique identifier for a generator feature. */
export type FeatureId =
	| 'core'
	| 'auth'
	| 'email'
	| 'email-verification'
	| 'password-reset'
	| '2fa'
	| 'oauth'
	| 'captcha'
	| 'jobs'
	| 'file-storage'
	| 'avatars'
	| 'audit'
	| 'admin'
	| 'aspire'
	| 'frontend';

/** Definition of a single generator feature. */
export interface Feature {
	/** Unique feature identifier. */
	id: FeatureId;

	/** Human-readable name shown in the UI. */
	name: string;

	/** Short description of what this feature adds. */
	description: string;

	/** Features that must be enabled when this feature is enabled. */
	dependencies: FeatureId[];

	/** Whether this feature is always included and cannot be deselected. */
	required: boolean;

	/** Whether this feature is enabled by default. */
	defaultEnabled: boolean;

	/** Group for UI display. */
	group: FeatureGroup;
}

/** Grouping for features in the picker UI. */
export type FeatureGroup =
	| 'core'
	| 'authentication'
	| 'infrastructure'
	| 'frontend';

/** The complete feature dependency graph. */
export interface FeatureGraph {
	features: Map<FeatureId, Feature>;
}

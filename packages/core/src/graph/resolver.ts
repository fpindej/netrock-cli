import type { FeatureId, Feature } from '../features/types.js';
import { featureDefinitions } from '../features/definitions.js';

/**
 * Resolves the full set of features to include, given a set of user-selected feature IDs.
 * Automatically adds required dependencies and always-required features.
 *
 * @param selected - The feature IDs explicitly selected by the user
 * @returns The complete set of feature IDs to include (selected + dependencies + required)
 */
export function resolveFeatures(selected: Set<FeatureId>): Set<FeatureId> {
	const featureMap = new Map<FeatureId, Feature>(
		featureDefinitions.map((f) => [f.id, f])
	);

	const resolved = new Set<FeatureId>();

	// Always include required features
	for (const feature of featureDefinitions) {
		if (feature.required) {
			resolved.add(feature.id);
		}
	}

	// Add user selections and resolve dependencies
	for (const id of selected) {
		addWithDependencies(id, featureMap, resolved);
	}

	return resolved;
}

/**
 * Returns feature IDs that should be deselected when the given feature is removed.
 * A feature must be deselected if any of its dependencies are no longer satisfied.
 *
 * @param removing - The feature being deselected
 * @param currentSelection - The current set of selected features (before removal)
 * @returns Feature IDs that must also be deselected
 */
export function getCascadeRemovals(
	removing: FeatureId,
	currentSelection: Set<FeatureId>
): Set<FeatureId> {
	const remaining = new Set(currentSelection);
	remaining.delete(removing);

	const removals = new Set<FeatureId>();

	// Iteratively find features whose dependencies are no longer met
	let changed = true;
	while (changed) {
		changed = false;
		for (const feature of featureDefinitions) {
			if (remaining.has(feature.id) && !feature.required) {
				const depsMet = feature.dependencies.every((dep) => remaining.has(dep));
				if (!depsMet) {
					remaining.delete(feature.id);
					removals.add(feature.id);
					changed = true;
				}
			}
		}
	}

	return removals;
}

function addWithDependencies(
	id: FeatureId,
	featureMap: Map<FeatureId, Feature>,
	resolved: Set<FeatureId>
): void {
	if (resolved.has(id)) return;

	const feature = featureMap.get(id);
	if (!feature) return;

	resolved.add(id);
	for (const dep of feature.dependencies) {
		addWithDependencies(dep, featureMap, resolved);
	}
}

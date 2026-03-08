import {
	featureDefinitions,
	resolveFeatures,
	getCascadeRemovals,
	generateProject,
	registerAllManifests,
	presets,
	type FeatureId,
	type GeneratedProject,
	type TemplateSource,
	type Feature
} from '@netrock/core';
import templateMap from 'virtual:templates';

registerAllManifests();

const source: TemplateSource = {
	getFile: (path: string) => templateMap.get(path),
	listFiles: () => [...templateMap.keys()]
};

const GROUP_LABELS: Record<string, string> = {
	core: 'Foundation',
	authentication: 'Auth add-ons',
	infrastructure: 'Infrastructure',
	tooling: 'Tooling'
};

/** Features hidden from the UI (no templates yet). */
const HIDDEN_FEATURES: Set<FeatureId> = new Set(['frontend']);

interface FeatureNote {
	title: string;
	message: string;
}

function computeNotes(features: Set<FeatureId>): FeatureNote[] {
	const notes: FeatureNote[] = [];

	if (!features.has('auth')) {
		notes.push({
			title: 'No authentication',
			message:
				'All API endpoints will be public. Add Authentication for JWT-based auth, email services, and user management.'
		});
	}

	if (features.has('auth') && !features.has('jobs')) {
		notes.push({
			title: 'No background processing',
			message:
				'Expired token cleanup and email retries run inline. Add Background Jobs for Hangfire-based async processing.'
		});
	}

	if (features.has('audit') && !features.has('admin')) {
		notes.push({
			title: 'Audit without admin UI',
			message:
				'Audit events are stored in the database but have no management interface. Add Admin Panel to browse audit logs.'
		});
	}

	if (features.has('file-storage') && !features.has('avatars')) {
		notes.push({
			title: 'Storage without avatars',
			message:
				'S3/MinIO file storage is available for custom use. Add Avatar Uploads for built-in profile image handling.'
		});
	}

	if (features.has('auth') && !features.has('aspire')) {
		notes.push({
			title: 'Manual infrastructure setup',
			message:
				"Without Aspire, you'll set up PostgreSQL and other services manually or via Docker Compose. Add Aspire for one-command local dev."
		});
	}

	return notes;
}

function groupFeatures(): { group: string; label: string; features: Feature[] }[] {
	const groups = new Map<string, Feature[]>();
	for (const f of featureDefinitions) {
		if (HIDDEN_FEATURES.has(f.id)) continue;
		const existing = groups.get(f.group) ?? [];
		existing.push(f);
		groups.set(f.group, existing);
	}

	const order = ['core', 'authentication', 'infrastructure', 'tooling'];
	return order
		.filter((g) => groups.has(g))
		.map((g) => ({
			group: g,
			label: GROUP_LABELS[g] ?? g,
			features: groups.get(g)!
		}));
}

/** Returns the default-enabled options for a feature definition. */
function getDefaultOptions(feature: Feature): Set<string> {
	if (!feature.options) return new Set();
	return new Set(feature.options.filter((o) => o.defaultEnabled).map((o) => o.id));
}

/** Returns all option IDs for a feature definition. */
function getAllOptions(feature: Feature): Set<string> {
	if (!feature.options) return new Set();
	return new Set(feature.options.map((o) => o.id));
}

class GeneratorState {
	projectName = $state('my-app');
	selectedIds = $state<FeatureId[]>([]);
	activePresetId = $state<string | null>('standard');
	featureOptions = $state<Map<FeatureId, Set<string>>>(new Map());

	resolvedFeatures = $derived(resolveFeatures(new Set(this.selectedIds)));

	isValidName = $derived(
		this.projectName.trim().length > 0 && /^[a-zA-Z][a-zA-Z0-9-]*$/.test(this.projectName.trim())
	);

	project = $derived.by((): GeneratedProject | null => {
		if (!this.isValidName) return null;
		return generateProject(
			{
				projectName: this.projectName.trim(),
				features: this.resolvedFeatures,
				featureOptions: this.featureOptions.size > 0 ? this.featureOptions : undefined
			},
			source
		);
	});

	filePaths = $derived.by((): string[] => {
		return this.project?.files.map((f) => f.path).sort() ?? [];
	});

	notes = $derived.by((): FeatureNote[] => {
		return computeNotes(this.resolvedFeatures);
	});

	featureCount = $derived(this.resolvedFeatures.size);
	fileCount = $derived(this.project?.summary.totalFiles ?? 0);

	groups = groupFeatures();
	presets = presets;
	definitions = featureDefinitions;

	constructor() {
		this.applyPreset('standard');
	}

	isEnabled(id: FeatureId): boolean {
		return this.selectedIds.includes(id);
	}

	isAutoEnabled(id: FeatureId): boolean {
		return this.resolvedFeatures.has(id) && !this.selectedIds.includes(id);
	}

	/** Returns selected options for a feature, or undefined if it has no options. */
	getSelectedOptions(featureId: FeatureId): Set<string> | undefined {
		const feature = featureDefinitions.find((f) => f.id === featureId);
		if (!feature?.options) return undefined;
		return this.featureOptions.get(featureId) ?? getDefaultOptions(feature);
	}

	/** Toggles a single option within a feature. */
	toggleOption(featureId: FeatureId, optionId: string) {
		const feature = featureDefinitions.find((f) => f.id === featureId);
		if (!feature?.options) return;

		const current = this.featureOptions.get(featureId) ?? getDefaultOptions(feature);
		const updated = new Set(current);
		if (updated.has(optionId)) {
			updated.delete(optionId);
		} else {
			updated.add(optionId);
		}

		const next = new Map(this.featureOptions);
		next.set(featureId, updated);
		this.featureOptions = next;
		this.activePresetId = this.findMatchingPreset();
	}

	/** Selects or deselects all options for a feature. */
	setAllOptions(featureId: FeatureId, selectAll: boolean) {
		const feature = featureDefinitions.find((f) => f.id === featureId);
		if (!feature?.options) return;

		const next = new Map(this.featureOptions);
		next.set(featureId, selectAll ? getAllOptions(feature) : new Set());
		this.featureOptions = next;
		this.activePresetId = this.findMatchingPreset();
	}

	toggle(id: FeatureId) {
		const feature = featureDefinitions.find((f) => f.id === id);
		if (!feature || feature.required) return;

		const isEnabled = this.selectedIds.includes(id);
		if (isEnabled) {
			const cascaded = getCascadeRemovals(id, new Set(this.selectedIds));
			this.selectedIds = this.selectedIds.filter((f) => f !== id && !cascaded.has(f));
			// Clean up options for removed features
			const next = new Map(this.featureOptions);
			next.delete(id);
			for (const removed of cascaded) next.delete(removed);
			this.featureOptions = next;
		} else {
			const withDeps = resolveFeatures(new Set([...this.selectedIds, id]));
			this.selectedIds = [...withDeps];
			// Initialize default options for features that have them
			if (feature.options) {
				const next = new Map(this.featureOptions);
				next.set(id, getDefaultOptions(feature));
				this.featureOptions = next;
			}
		}
		this.activePresetId = this.findMatchingPreset();
	}

	applyPreset(presetId: string) {
		const preset = presets.find((p) => p.id === presetId);
		if (!preset) return;
		this.selectedIds = [...resolveFeatures(new Set(preset.features as FeatureId[]))];
		this.activePresetId = presetId;

		// Apply preset's feature options, defaulting features without explicit options
		const next = new Map<FeatureId, Set<string>>();
		for (const featureId of this.selectedIds) {
			const feature = featureDefinitions.find((f) => f.id === featureId);
			if (!feature?.options) continue;

			const presetOpts = preset.featureOptions?.[featureId];
			if (presetOpts) {
				next.set(featureId, new Set(presetOpts));
			} else {
				next.set(featureId, getDefaultOptions(feature));
			}
		}
		this.featureOptions = next;
	}

	private findMatchingPreset(): string | null {
		const current = new Set(this.selectedIds);
		for (const preset of presets) {
			const resolved = resolveFeatures(new Set(preset.features as FeatureId[]));
			if (resolved.size !== current.size || ![...resolved].every((f) => current.has(f))) {
				continue;
			}

			// Also check feature options match
			let optionsMatch = true;
			for (const featureId of resolved) {
				const feature = featureDefinitions.find((f) => f.id === featureId);
				if (!feature?.options) continue;

				const currentOpts = this.featureOptions.get(featureId) ?? getDefaultOptions(feature);
				const presetOpts = preset.featureOptions?.[featureId];
				const expectedOpts = presetOpts ? new Set(presetOpts) : getDefaultOptions(feature);

				if (
					currentOpts.size !== expectedOpts.size ||
					![...currentOpts].every((o) => expectedOpts.has(o))
				) {
					optionsMatch = false;
					break;
				}
			}

			if (optionsMatch) return preset.id;
		}
		return null;
	}
}

export const generator = new GeneratorState();
export { GROUP_LABELS };
export type { FeatureNote };

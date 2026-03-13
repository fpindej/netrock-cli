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

/** Features that have their own dedicated UI section (not in the feature card grid). */
const CUSTOM_SECTION_FEATURES: Set<FeatureId> = new Set(['frontend']);

interface FeatureNote {
	title: string;
	message: string;
}

function computeNotes(features: Set<FeatureId>): FeatureNote[] {
	const notes: FeatureNote[] = [];

	if (!features.has('auth')) {
		notes.push({
			title: 'No authentication',
			message: features.has('frontend')
				? 'All API endpoints will be public. The frontend ships as a dashboard shell without login, register, profile, or settings pages. Add Authentication for JWT-based auth and user management.'
				: 'All API endpoints will be public. Add Authentication for JWT-based auth and user management.'
		});
	}

	if (features.has('auth') && !features.has('jobs')) {
		notes.push({
			title: 'No background processing',
			message:
				'Expired token cleanup and email retries run inline. Add Background Jobs for Hangfire-based async processing.'
		});
	}

	if (features.has('audit') && !features.has('auth')) {
		notes.push({
			title: 'Audit without authentication',
			message:
				'The audit infrastructure is included but built-in events (login, password change, etc.) require Authentication. You can use AuditService.LogAsync() for your own custom events, but user identity tracking will not be available.'
		});
	}

	if (features.has('audit') && features.has('auth') && !features.has('admin')) {
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

	if (!features.has('aspire') && features.has('frontend')) {
		notes.push({
			title: 'Full stack without orchestration',
			message:
				"Without Aspire, you'll run the SvelteKit dev server and .NET API as separate processes, and configure PostgreSQL and other services manually. Add Aspire for single-command local dev with automatic service wiring."
		});
	} else if (features.has('auth') && !features.has('aspire')) {
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
		if (CUSTOM_SECTION_FEATURES.has(f.id)) continue;
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

/** All valid feature IDs for URL param validation. */
const VALID_FEATURE_IDS = new Set<string>(featureDefinitions.map((f) => f.id));

class GeneratorState {
	projectName = $state('my-app');
	selectedIds = $state<FeatureId[]>([]);
	activePresetId = $state<string | null>('standard');
	featureOptions = $state<Map<FeatureId, Set<string>>>(new Map());

	/** Frontend is independent of backend selection - survives preset changes and feature toggles. */
	frontendEnabled = $state(false);

	/** Whether the initial state was loaded from URL params. */
	private initializedFromUrl = false;

	/** All features including frontend (if enabled) with dependencies auto-resolved. */
	resolvedFeatures = $derived(
		resolveFeatures(
			new Set([...this.selectedIds, ...(this.frontendEnabled ? (['frontend'] as FeatureId[]) : [])])
		)
	);

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
	isFrontendEnabled = $derived(this.frontendEnabled);

	groups = groupFeatures();
	presets = presets;
	definitions = featureDefinitions;

	constructor() {
		if (typeof window !== 'undefined' && !this.loadFromUrl()) {
			this.applyPreset('standard');
		}
	}

	/** Serializes current state to URL search params. */
	toUrlParams(): string {
		const params = new URLSearchParams();
		if (this.projectName !== 'my-app') {
			params.set('name', this.projectName);
		}
		if (this.frontendEnabled) {
			params.set('frontend', '1');
		}
		// Only encode features if they differ from a preset
		if (this.activePresetId) {
			params.set('preset', this.activePresetId);
		} else {
			const features = this.selectedIds.filter((f) => f !== 'core');
			if (features.length > 0) {
				params.set('features', features.join(','));
			}
		}
		// Encode non-default feature options
		for (const [featureId, options] of this.featureOptions) {
			const feature = featureDefinitions.find((f) => f.id === featureId);
			if (!feature?.options) continue;
			const defaults = getDefaultOptions(feature);
			if (options.size !== defaults.size || ![...options].every((o) => defaults.has(o))) {
				params.set(`opts.${featureId}`, [...options].join(','));
			}
		}
		return params.toString();
	}

	/** Restores state from current URL search params. Returns true if params were found. */
	private loadFromUrl(): boolean {
		const params = new URLSearchParams(window.location.search);
		if (params.size === 0) return false;

		const hasFeatures = params.has('features');
		const hasPreset = params.has('preset');
		if (!hasFeatures && !hasPreset && !params.has('name') && !params.has('frontend')) return false;

		// Restore preset or custom features
		if (hasPreset) {
			const presetId = params.get('preset')!;
			if (presets.some((p) => p.id === presetId)) {
				this.applyPreset(presetId);
			} else {
				this.applyPreset('standard');
			}
		} else if (hasFeatures) {
			const ids = params
				.get('features')!
				.split(',')
				.filter((id) => VALID_FEATURE_IDS.has(id)) as FeatureId[];
			const resolved = resolveFeatures(new Set(ids));
			this.selectedIds = [...resolved].filter((f) => !CUSTOM_SECTION_FEATURES.has(f));
			this.activePresetId = this.findMatchingPreset();
			// Initialize default options for features that have them
			const next = new Map<FeatureId, Set<string>>();
			for (const featureId of this.selectedIds) {
				const feature = featureDefinitions.find((f) => f.id === featureId);
				if (!feature?.options) continue;
				next.set(featureId, getDefaultOptions(feature));
			}
			this.featureOptions = next;
		} else {
			this.applyPreset('standard');
		}

		// Restore feature options overrides
		for (const [key, value] of params) {
			if (!key.startsWith('opts.')) continue;
			const featureId = key.slice(5) as FeatureId;
			if (!VALID_FEATURE_IDS.has(featureId)) continue;
			const feature = featureDefinitions.find((f) => f.id === featureId);
			if (!feature?.options) continue;
			const validOptionIds = new Set(feature.options.map((o) => o.id));
			const options = new Set(value.split(',').filter((o) => validOptionIds.has(o)));
			const next = new Map(this.featureOptions);
			next.set(featureId, options);
			this.featureOptions = next;
		}
		if (params.has('features') || [...params.keys()].some((k) => k.startsWith('opts.'))) {
			this.activePresetId = this.findMatchingPreset();
		}

		// Restore frontend
		if (params.get('frontend') === '1') {
			this.frontendEnabled = true;
		}

		// Restore name
		const name = params.get('name');
		if (name && /^[a-zA-Z][a-zA-Z0-9-]*$/.test(name)) {
			this.projectName = name;
		}

		this.initializedFromUrl = true;
		return true;
	}

	/** Syncs current state to the URL. Call from a $effect in a component. */
	syncToUrl() {
		const qs = this.toUrlParams();
		const url = qs ? `${window.location.pathname}?${qs}` : window.location.pathname;
		if (url !== `${window.location.pathname}${window.location.search}`) {
			history.replaceState(null, '', url);
		}
	}

	isEnabled(id: FeatureId): boolean {
		return this.selectedIds.includes(id);
	}

	isAutoEnabled(id: FeatureId): boolean {
		return this.resolvedFeatures.has(id) && !this.selectedIds.includes(id);
	}

	/** Toggles the frontend independently of backend feature selection. */
	toggleFrontend() {
		this.frontendEnabled = !this.frontendEnabled;
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
		if (CUSTOM_SECTION_FEATURES.has(id)) return;

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
			this.selectedIds = [...withDeps].filter((f) => !CUSTOM_SECTION_FEATURES.has(f));
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

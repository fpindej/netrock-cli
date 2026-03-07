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
	infrastructure: 'Infrastructure'
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

	const order = ['core', 'authentication', 'infrastructure'];
	return order
		.filter((g) => groups.has(g))
		.map((g) => ({
			group: g,
			label: GROUP_LABELS[g] ?? g,
			features: groups.get(g)!
		}));
}

class GeneratorState {
	projectName = $state('my-app');
	selectedIds = $state<FeatureId[]>([]);
	activePresetId = $state<string | null>('standard');

	resolvedFeatures = $derived(resolveFeatures(new Set(this.selectedIds)));

	isValidName = $derived(
		this.projectName.trim().length > 0 && /^[a-zA-Z][a-zA-Z0-9-]*$/.test(this.projectName.trim())
	);

	project = $derived.by((): GeneratedProject | null => {
		if (!this.isValidName) return null;
		return generateProject(
			{ projectName: this.projectName.trim(), features: this.resolvedFeatures },
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

	toggle(id: FeatureId) {
		const feature = featureDefinitions.find((f) => f.id === id);
		if (!feature || feature.required) return;

		const isEnabled = this.selectedIds.includes(id);
		if (isEnabled) {
			const cascaded = getCascadeRemovals(id, new Set(this.selectedIds));
			this.selectedIds = this.selectedIds.filter((f) => f !== id && !cascaded.has(f));
		} else {
			const withDeps = resolveFeatures(new Set([...this.selectedIds, id]));
			this.selectedIds = [...withDeps];
		}
		this.activePresetId = this.findMatchingPreset();
	}

	applyPreset(presetId: string) {
		const preset = presets.find((p) => p.id === presetId);
		if (!preset) return;
		this.selectedIds = [...resolveFeatures(new Set(preset.features as FeatureId[]))];
		this.activePresetId = presetId;
	}

	private findMatchingPreset(): string | null {
		const current = new Set(this.selectedIds);
		for (const preset of presets) {
			const resolved = resolveFeatures(new Set(preset.features as FeatureId[]));
			if (resolved.size === current.size && [...resolved].every((f) => current.has(f))) {
				return preset.id;
			}
		}
		return null;
	}
}

export const generator = new GeneratorState();
export { GROUP_LABELS };
export type { FeatureNote };

import { registerManifest } from '../features/manifest.js';

/** Registers the frontend feature manifest - SvelteKit frontend. No templates yet; placeholder for future use. */
export function registerFrontendManifest(): void {
	registerManifest({
		featureId: 'frontend',
		// No frontend templates in the repo yet - will be populated when SvelteKit templates are added
		files: []
	});
}

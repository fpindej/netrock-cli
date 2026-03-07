import { registerCoreManifest } from './core.js';

/** Registers all feature manifests. Call once before generating a project. */
export function registerAllManifests(): void {
	registerCoreManifest();
	// Phase 3: auth, email, jobs, audit, admin, etc.
}

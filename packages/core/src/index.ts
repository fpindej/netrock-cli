export { resolveFeatures, getCascadeRemovals } from './graph/resolver.js';
export { processTemplate } from './engine/processor.js';
export { generateProject } from './engine/generator.js';
export { deriveNames, substituteNamespace, substitutePathNamespace } from './engine/naming.js';
export { generateJwtSecret, generateEncryptionKey } from './engine/secrets.js';
export { presets } from './presets/index.js';
export { registerManifest, getManifests, getManifest } from './features/manifest.js';
export { registerAllManifests } from './manifests/index.js';
export { featureDefinitions } from './features/definitions.js';
export { createFsSource } from './engine/fs-source.js';

export type { Feature, FeatureId, FeatureGraph, FeatureGroup } from './features/types.js';
export type { FeatureManifest, TemplateEntry } from './features/manifest.js';
export type {
	GeneratorConfig,
	GeneratedFile,
	GeneratedProject,
	TemplateSource
} from './engine/types.js';
export type { Preset } from './presets/types.js';
export type { ProjectNames } from './engine/naming.js';

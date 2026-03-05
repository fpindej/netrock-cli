export { resolveFeatures } from './graph/resolver.js';
export { processTemplate } from './engine/processor.js';
export { generateProject } from './engine/generator.js';
export { presets } from './presets/index.js';

export type { Feature, FeatureId, FeatureGraph } from './features/types.js';
export type { GeneratorConfig, GeneratedFile } from './engine/types.js';
export type { Preset } from './presets/types.js';

import { describe, it, expect } from 'vitest';
import { resolveFeatures, getCascadeRemovals } from '../../src/graph/resolver.js';

describe('resolveFeatures', () => {
	it('always includes required features', () => {
		const result = resolveFeatures(new Set());
		expect(result.has('core')).toBe(true);
	});

	it('resolves dependencies automatically', () => {
		const result = resolveFeatures(new Set(['avatars']));
		expect(result.has('avatars')).toBe(true);
		expect(result.has('file-storage')).toBe(true);
		expect(result.has('auth')).toBe(true);
		expect(result.has('core')).toBe(true);
	});

	it('does not include unrelated features', () => {
		const result = resolveFeatures(new Set(['jobs']));
		expect(result.has('jobs')).toBe(true);
		expect(result.has('file-storage')).toBe(false);
		expect(result.has('frontend')).toBe(false);
	});

	it('handles empty selection (only required features)', () => {
		const result = resolveFeatures(new Set());
		expect(result.size).toBe(2); // core + aspire (both required)
	});

	it('ignores unknown feature IDs', () => {
		// @ts-expect-error Testing invalid input
		const result = resolveFeatures(new Set(['nonexistent']));
		expect(result.has('core')).toBe(true);
	});
});

describe('getCascadeRemovals', () => {
	it('cascades removal of dependent features', () => {
		const current = new Set(resolveFeatures(new Set(['admin'])));
		const removals = getCascadeRemovals('audit', current);
		expect(removals.has('admin')).toBe(true);
	});

	it('does not cascade to features with satisfied dependencies', () => {
		const current = new Set(resolveFeatures(new Set(['jobs', '2fa'])));
		const removals = getCascadeRemovals('jobs', current);
		expect(removals.has('2fa')).toBe(false);
	});

	it('cascades through multiple levels', () => {
		const current = new Set(resolveFeatures(new Set(['avatars'])));
		const removals = getCascadeRemovals('file-storage', current);
		expect(removals.has('avatars')).toBe(true);
	});

	it('never removes required features', () => {
		const current = new Set(resolveFeatures(new Set(['auth'])));
		const removals = getCascadeRemovals('auth', current);
		expect(removals.has('core')).toBe(false);
	});
});

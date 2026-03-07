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

	it('resolves email-verification dependencies', () => {
		const result = resolveFeatures(new Set(['email-verification']));
		expect(result.has('email-verification')).toBe(true);
		expect(result.has('email')).toBe(true);
		expect(result.has('auth')).toBe(true);
	});

	it('resolves password-reset dependencies', () => {
		const result = resolveFeatures(new Set(['password-reset']));
		expect(result.has('password-reset')).toBe(true);
		expect(result.has('email')).toBe(true);
		expect(result.has('auth')).toBe(true);
	});

	it('does not include unrelated features', () => {
		const result = resolveFeatures(new Set(['jobs']));
		expect(result.has('jobs')).toBe(true);
		expect(result.has('file-storage')).toBe(false);
		expect(result.has('frontend')).toBe(false);
	});

	it('handles empty selection (only required features)', () => {
		const result = resolveFeatures(new Set());
		expect(result.size).toBe(1); // core only
	});

	it('ignores unknown feature IDs', () => {
		// @ts-expect-error Testing invalid input
		const result = resolveFeatures(new Set(['nonexistent']));
		expect(result.has('core')).toBe(true);
	});
});

describe('getCascadeRemovals', () => {
	it('cascades removal of dependent features', () => {
		const current = new Set(resolveFeatures(new Set(['email-verification', 'password-reset'])));
		const removals = getCascadeRemovals('email', current);
		expect(removals.has('email-verification')).toBe(true);
		expect(removals.has('password-reset')).toBe(true);
	});

	it('does not cascade to features with satisfied dependencies', () => {
		const current = new Set(
			resolveFeatures(new Set(['email-verification', 'jobs']))
		);
		const removals = getCascadeRemovals('jobs', current);
		expect(removals.has('email-verification')).toBe(false);
	});

	it('cascades through multiple levels', () => {
		const current = new Set(resolveFeatures(new Set(['avatars'])));
		const removals = getCascadeRemovals('file-storage', current);
		expect(removals.has('avatars')).toBe(true);
	});

	it('never removes required features', () => {
		const current = new Set(resolveFeatures(new Set(['email'])));
		const removals = getCascadeRemovals('email', current);
		expect(removals.has('core')).toBe(false);
		expect(removals.has('auth')).toBe(false);
	});
});

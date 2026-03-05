import { describe, it, expect } from 'vitest';
import { processTemplate } from '../../src/engine/processor.js';
import type { FeatureId } from '../../src/features/types.js';

const enabled = new Set<FeatureId>(['core', 'auth', 'audit']);

describe('processTemplate', () => {
	it('keeps content for enabled features (C-style comments)', () => {
		const input = [
			'services.AddAuth();',
			'// @feature audit',
			'services.AddAuditTrail();',
			'// @end',
			'services.AddHealthChecks();'
		].join('\n');

		const result = processTemplate(input, enabled);
		expect(result).toBe(
			['services.AddAuth();', 'services.AddAuditTrail();', 'services.AddHealthChecks();'].join(
				'\n'
			)
		);
	});

	it('strips content for disabled features', () => {
		const input = [
			'services.AddAuth();',
			'// @feature jobs',
			'services.AddHangfire();',
			'// @end',
			'services.AddHealthChecks();'
		].join('\n');

		const result = processTemplate(input, enabled);
		expect(result).toBe(['services.AddAuth();', 'services.AddHealthChecks();'].join('\n'));
	});

	it('handles HTML/Svelte markers', () => {
		const input = [
			'<div>Always here</div>',
			'<!-- @feature audit -->',
			'<AuditLog />',
			'<!-- @end -->',
			'<div>Also always here</div>'
		].join('\n');

		const result = processTemplate(input, enabled);
		expect(result).toBe(
			['<div>Always here</div>', '<AuditLog />', '<div>Also always here</div>'].join('\n')
		);
	});

	it('handles YAML/shell markers', () => {
		const input = ['port: 8080', '# @feature jobs', 'hangfire: true', '# @end'].join('\n');

		const result = processTemplate(input, enabled);
		expect(result).toBe('port: 8080');
	});

	it('handles nested markers (outer disabled)', () => {
		const input = [
			'base config',
			'// @feature jobs',
			'jobs config',
			'// @feature audit',
			'audit in jobs',
			'// @end',
			'more jobs',
			'// @end',
			'end config'
		].join('\n');

		const result = processTemplate(input, enabled);
		expect(result).toBe(['base config', 'end config'].join('\n'));
	});

	it('handles nested markers (outer enabled, inner disabled)', () => {
		const input = [
			'base config',
			'// @feature audit',
			'audit config',
			'// @feature jobs',
			'jobs in audit',
			'// @end',
			'more audit',
			'// @end',
			'end config'
		].join('\n');

		const result = processTemplate(input, enabled);
		expect(result).toBe(
			['base config', 'audit config', 'more audit', 'end config'].join('\n')
		);
	});

	it('passes through files with no markers unchanged', () => {
		const input = 'public class Foo\n{\n    public int Bar { get; set; }\n}';
		const result = processTemplate(input, enabled);
		expect(result).toBe(input);
	});

	it('includes negated block when feature is disabled', () => {
		const input = [
			'// @feature !auth',
			'class Foo : DbContext {}',
			'// @end',
			'// @feature auth',
			'class Foo : IdentityDbContext {}',
			'// @end'
		].join('\n');

		const coreOnly = new Set<FeatureId>(['core']);
		const result = processTemplate(input, coreOnly);
		expect(result).toBe('class Foo : DbContext {}');
	});

	it('excludes negated block when feature is enabled', () => {
		const input = [
			'// @feature !auth',
			'class Foo : DbContext {}',
			'// @end',
			'// @feature auth',
			'class Foo : IdentityDbContext {}',
			'// @end'
		].join('\n');

		const result = processTemplate(input, enabled);
		expect(result).toBe('class Foo : IdentityDbContext {}');
	});

	it('handles multiple feature blocks in the same file', () => {
		const input = [
			'// @feature audit',
			'AddAudit();',
			'// @end',
			'AlwaysHere();',
			'// @feature jobs',
			'AddJobs();',
			'// @end'
		].join('\n');

		const result = processTemplate(input, enabled);
		expect(result).toBe(['AddAudit();', 'AlwaysHere();'].join('\n'));
	});
});

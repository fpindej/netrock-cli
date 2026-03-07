#!/usr/bin/env tsx
/**
 * Mega audit: generate projects for all feature combinations and verify they build/test.
 * Usage: cd netrock-cli && pnpm tsx scripts/audit.ts
 */
import { resolve, join, dirname } from 'node:path';
import { writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import {
	generateProject,
	registerAllManifests,
	resolveFeatures
} from '@netrock/core';
import { createFsSource } from '@netrock/core/node';
import type { FeatureId } from '@netrock/core';

interface Combo {
	name: string;
	features: FeatureId[];
}

const combos: Combo[] = [
	// P0 - Core paths
	{ name: 'p0-minimal', features: ['core', 'auth'] },
	{ name: 'p0-minimal-aspire', features: ['core', 'auth', 'aspire'] },
	{ name: 'p0-core-aspire', features: ['core', 'aspire'] },
	{ name: 'p0-standard', features: ['core', 'auth', 'jobs', 'audit', 'admin', 'aspire'] },

	// P1 - Auth feature matrix
	{ name: 'p1-auth-2fa', features: ['core', 'auth', '2fa'] },
	{ name: 'p1-auth-oauth', features: ['core', 'auth', 'oauth'] },
	{ name: 'p1-auth-2fa-oauth', features: ['core', 'auth', '2fa', 'oauth'] },
	{ name: 'p1-auth-captcha', features: ['core', 'auth', 'captcha'] },
	{ name: 'p1-auth-avatars', features: ['core', 'auth', 'file-storage', 'avatars'] },
	{ name: 'p1-auth-audit', features: ['core', 'auth', 'audit'] },
	{ name: 'p1-auth-admin', features: ['core', 'auth', 'admin'] },
	{ name: 'p1-auth-admin-2fa-oauth', features: ['core', 'auth', 'admin', '2fa', 'oauth'] },

	// P2 - Infrastructure combos
	{ name: 'p2-file-storage', features: ['core', 'file-storage'] },
	{ name: 'p2-auth-jobs', features: ['core', 'auth', 'jobs'] },
	{ name: 'p2-auth-2fa-jobs-aspire', features: ['core', 'auth', '2fa', 'jobs', 'aspire'] },
	{ name: 'p2-auth-oauth-jobs-aspire', features: ['core', 'auth', 'oauth', 'jobs', 'aspire'] },
	{ name: 'p2-auth-captcha-audit-aspire', features: ['core', 'auth', 'captcha', 'audit', 'aspire'] },
	{ name: 'p2-auth-avatars-aspire', features: ['core', 'auth', 'file-storage', 'avatars', 'aspire'] },

	// P3 - Edge cases
	{ name: 'p3-full-no-aspire', features: ['core', 'auth', '2fa', 'oauth', 'captcha', 'jobs', 'file-storage', 'avatars', 'audit', 'admin'] },
	{ name: 'p3-full', features: ['core', 'auth', '2fa', 'oauth', 'captcha', 'jobs', 'file-storage', 'avatars', 'audit', 'admin', 'aspire'] },
];

interface Result {
	name: string;
	features: string;
	generate: 'pass' | 'fail';
	build: 'pass' | 'fail' | 'skip';
	test: 'pass' | 'fail' | 'skip';
	warnings: string[];
	error?: string;
}

function run(cmd: string, cwd: string, timeoutMs = 120_000): { stdout: string; ok: boolean } {
	try {
		const stdout = execSync(cmd, { cwd, timeout: timeoutMs, encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] });
		return { stdout, ok: true };
	} catch (err: unknown) {
		const e = err as { stdout?: string; stderr?: string; message?: string };
		return { stdout: (e.stdout ?? '') + '\n' + (e.stderr ?? '') + '\n' + (e.message ?? ''), ok: false };
	}
}

function main(): void {
	registerAllManifests();

	const templatesDir = resolve(import.meta.dirname!, '..', 'templates');
	const source = createFsSource(templatesDir);
	const outputBase = resolve(import.meta.dirname!, '..', 'output', '_audit');

	// Clean previous audit output
	if (existsSync(outputBase)) {
		rmSync(outputBase, { recursive: true, force: true });
	}

	const results: Result[] = [];

	for (let i = 0; i < combos.length; i++) {
		const combo = combos[i];
		const label = `[${i + 1}/${combos.length}] ${combo.name}`;
		console.log(`\n${'='.repeat(60)}`);
		console.log(`${label}: ${combo.features.join(', ')}`);
		console.log('='.repeat(60));

		const result: Result = {
			name: combo.name,
			features: combo.features.join(', '),
			generate: 'fail',
			build: 'skip',
			test: 'skip',
			warnings: []
		};

		// 1. Generate
		const outputDir = join(outputBase, combo.name);
		try {
			const resolved = resolveFeatures(new Set(combo.features));
			const project = generateProject(
				{ projectName: 'audit-app', features: resolved },
				source
			);

			for (const file of project.files) {
				const fullPath = join(outputDir, file.path);
				mkdirSync(dirname(fullPath), { recursive: true });
				writeFileSync(fullPath, file.content, 'utf-8');
			}

			const effectiveFeatures = project.summary.enabledFeatures;
			console.log(`  Generated ${project.summary.totalFiles} files [${effectiveFeatures.join(', ')}]`);
			result.generate = 'pass';
		} catch (err: unknown) {
			const msg = err instanceof Error ? err.message : String(err);
			console.log(`  GENERATE FAILED: ${msg}`);
			result.error = msg;
			results.push(result);
			continue;
		}

		// 2. Build
		const slnxPath = 'src/backend/AuditApp.slnx';
		console.log('  Building...');
		const buildResult = run(`dotnet build ${slnxPath} -v quiet`, outputDir, 180_000);
		if (buildResult.ok) {
			console.log('  Build: PASS');
			result.build = 'pass';

			// Check for CS9113 warnings (unused constructor params - broken feature gating)
			if (buildResult.stdout.includes('CS9113')) {
				result.warnings.push('CS9113: unused constructor parameter(s)');
				console.log('  WARNING: CS9113 unused constructor parameter(s)');
			}
		} else {
			console.log('  Build: FAIL');
			result.build = 'fail';
			// Extract first few error lines
			const errors = buildResult.stdout.split('\n').filter(l => l.includes('error ')).slice(0, 10);
			result.error = errors.join('\n');
			console.log(errors.map(e => `    ${e}`).join('\n'));
			results.push(result);
			continue;
		}

		// 3. Test
		console.log('  Testing...');
		const testResult = run(`dotnet test ${slnxPath} -c Release -v quiet --no-build`, outputDir, 180_000);
		if (!testResult.ok) {
			// Retry with build (sometimes no-build fails on first run)
			const retryResult = run(`dotnet test ${slnxPath} -c Release -v quiet`, outputDir, 180_000);
			if (retryResult.ok) {
				console.log('  Test: PASS (retry with build)');
				result.test = 'pass';
			} else {
				console.log('  Test: FAIL');
				result.test = 'fail';
				const errors = retryResult.stdout.split('\n').filter(l => l.includes('Failed') || l.includes('error ')).slice(0, 10);
				result.error = errors.join('\n');
				console.log(errors.map(e => `    ${e}`).join('\n'));
			}
		} else {
			console.log('  Test: PASS');
			result.test = 'pass';
		}

		results.push(result);
	}

	// Summary
	console.log(`\n${'='.repeat(60)}`);
	console.log('AUDIT SUMMARY');
	console.log('='.repeat(60));

	const passed = results.filter(r => r.generate === 'pass' && r.build === 'pass' && r.test === 'pass' && r.warnings.length === 0);
	const warned = results.filter(r => r.generate === 'pass' && r.build === 'pass' && r.test === 'pass' && r.warnings.length > 0);
	const failed = results.filter(r => r.generate === 'fail' || r.build === 'fail' || r.test === 'fail');

	console.log(`\nPassed: ${passed.length}/${combos.length}`);
	if (warned.length > 0) console.log(`Warnings: ${warned.length}`);
	if (failed.length > 0) console.log(`Failed: ${failed.length}`);

	for (const r of results) {
		const status = r.generate === 'fail' || r.build === 'fail' || r.test === 'fail'
			? 'FAIL'
			: r.warnings.length > 0 ? 'WARN' : 'PASS';
		const icon = status === 'PASS' ? '+' : status === 'WARN' ? '~' : 'X';
		console.log(`  [${icon}] ${r.name.padEnd(30)} gen=${r.generate} build=${r.build} test=${r.test}${r.warnings.length > 0 ? ` (${r.warnings.join(', ')})` : ''}`);
	}

	if (failed.length > 0) {
		console.log('\nFailed details:');
		for (const r of failed) {
			console.log(`\n  ${r.name} [${r.features}]:`);
			console.log(`    ${r.error ?? 'unknown error'}`);
		}
	}

	// Write results to JSON for downstream use
	const resultsPath = join(outputBase, 'audit-results.json');
	mkdirSync(outputBase, { recursive: true });
	writeFileSync(resultsPath, JSON.stringify(results, null, 2));
	console.log(`\nResults written to ${resultsPath}`);

	process.exit(failed.length > 0 ? 1 : 0);
}

main();

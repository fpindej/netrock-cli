#!/usr/bin/env tsx
/**
 * Mega audit: generate projects for all feature combinations and verify they build/test.
 * Validates both backend (.NET build + test) and frontend (pnpm install + build + check + test).
 * Usage: cd netrock-cli && pnpm tsx scripts/audit.ts
 */
import { resolve, join, dirname } from 'node:path';
import { writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { generateProject, registerAllManifests, resolveFeatures } from '@netrock/core';
import { createFsSource } from '@netrock/core/node';
import type { FeatureId } from '@netrock/core';

interface Combo {
	name: string;
	features: FeatureId[];
}

const combos: Combo[] = [
	// P0 - Core paths (no auth)
	{ name: 'p0-core-only', features: ['core'] },
	{ name: 'p0-core-aspire', features: ['core', 'aspire'] },
	{ name: 'p0-core-frontend', features: ['core', 'frontend'] },
	{ name: 'p0-core-frontend-aspire', features: ['core', 'frontend', 'aspire'] },

	// P0 - Core paths (with auth)
	{ name: 'p0-auth', features: ['core', 'auth'] },
	{ name: 'p0-auth-aspire', features: ['core', 'auth', 'aspire'] },
	{ name: 'p0-auth-frontend', features: ['core', 'auth', 'frontend'] },
	{ name: 'p0-standard', features: ['core', 'auth', 'jobs', 'audit', 'admin', 'aspire'] },
	{
		name: 'p0-standard-frontend',
		features: ['core', 'auth', 'jobs', 'audit', 'admin', 'aspire', 'frontend']
	},

	// P1 - Auth feature matrix
	{ name: 'p1-auth-2fa', features: ['core', 'auth', '2fa'] },
	{ name: 'p1-auth-oauth', features: ['core', 'auth', 'oauth'] },
	{ name: 'p1-auth-2fa-oauth', features: ['core', 'auth', '2fa', 'oauth'] },
	{ name: 'p1-auth-captcha', features: ['core', 'auth', 'captcha'] },
	{ name: 'p1-auth-avatars', features: ['core', 'auth', 'file-storage', 'avatars'] },
	{ name: 'p1-auth-audit', features: ['core', 'auth', 'audit'] },
	{ name: 'p1-auth-admin', features: ['core', 'auth', 'admin'] },
	{ name: 'p1-auth-admin-2fa-oauth', features: ['core', 'auth', 'admin', '2fa', 'oauth'] },

	// P1 - Auth + frontend combos
	{ name: 'p1-auth-2fa-frontend', features: ['core', 'auth', '2fa', 'frontend'] },
	{ name: 'p1-auth-oauth-frontend', features: ['core', 'auth', 'oauth', 'frontend'] },
	{ name: 'p1-auth-captcha-frontend', features: ['core', 'auth', 'captcha', 'frontend'] },
	{
		name: 'p1-auth-avatars-frontend',
		features: ['core', 'auth', 'file-storage', 'avatars', 'frontend']
	},
	{ name: 'p1-auth-admin-frontend', features: ['core', 'auth', 'admin', 'frontend'] },

	// P2 - Infrastructure combos (no auth)
	{ name: 'p2-jobs', features: ['core', 'jobs'] },
	{ name: 'p2-jobs-frontend', features: ['core', 'jobs', 'frontend'] },
	{ name: 'p2-file-storage', features: ['core', 'file-storage'] },
	{ name: 'p2-audit', features: ['core', 'audit'] },
	{ name: 'p2-jobs-audit-aspire', features: ['core', 'jobs', 'audit', 'aspire'] },

	// P2 - Infrastructure combos (with auth)
	{ name: 'p2-auth-jobs', features: ['core', 'auth', 'jobs'] },
	{ name: 'p2-auth-2fa-jobs-aspire', features: ['core', 'auth', '2fa', 'jobs', 'aspire'] },
	{ name: 'p2-auth-oauth-jobs-aspire', features: ['core', 'auth', 'oauth', 'jobs', 'aspire'] },
	{
		name: 'p2-auth-captcha-audit-aspire',
		features: ['core', 'auth', 'captcha', 'audit', 'aspire']
	},
	{
		name: 'p2-auth-avatars-aspire',
		features: ['core', 'auth', 'file-storage', 'avatars', 'aspire']
	},

	// P3 - Edge cases
	{
		name: 'p3-full-no-aspire',
		features: [
			'core',
			'auth',
			'2fa',
			'oauth',
			'captcha',
			'jobs',
			'file-storage',
			'avatars',
			'audit',
			'admin'
		]
	},
	{
		name: 'p3-full-no-aspire-frontend',
		features: [
			'core',
			'auth',
			'2fa',
			'oauth',
			'captcha',
			'jobs',
			'file-storage',
			'avatars',
			'audit',
			'admin',
			'frontend'
		]
	},
	{
		name: 'p3-full',
		features: [
			'core',
			'auth',
			'2fa',
			'oauth',
			'captcha',
			'jobs',
			'file-storage',
			'avatars',
			'audit',
			'admin',
			'aspire'
		]
	},
	{
		name: 'p3-full-frontend',
		features: [
			'core',
			'auth',
			'2fa',
			'oauth',
			'captcha',
			'jobs',
			'file-storage',
			'avatars',
			'audit',
			'admin',
			'aspire',
			'frontend'
		]
	}
];

interface Result {
	name: string;
	features: string;
	generate: 'pass' | 'fail';
	build: 'pass' | 'fail' | 'skip';
	test: 'pass' | 'fail' | 'skip';
	frontendBuild: 'pass' | 'fail' | 'skip';
	frontendCheck: 'pass' | 'fail' | 'skip';
	frontendTest: 'pass' | 'fail' | 'skip';
	warnings: string[];
	error?: string;
}

function run(cmd: string, cwd: string, timeoutMs = 120_000): { stdout: string; ok: boolean } {
	try {
		const stdout = execSync(cmd, {
			cwd,
			timeout: timeoutMs,
			encoding: 'utf-8',
			stdio: ['pipe', 'pipe', 'pipe']
		});
		return { stdout, ok: true };
	} catch (err: unknown) {
		const e = err as { stdout?: string; stderr?: string; message?: string };
		return {
			stdout: (e.stdout ?? '') + '\n' + (e.stderr ?? '') + '\n' + (e.message ?? ''),
			ok: false
		};
	}
}

function main(): void {
	registerAllManifests();

	const templatesDir = resolve(import.meta.dirname!, '..', 'templates');
	const source = createFsSource(templatesDir);
	// Output OUTSIDE the pnpm workspace so frontend pnpm install uses local lockfiles
	const outputBase = resolve('/tmp', 'netrock-audit');

	// Clean previous audit output
	if (existsSync(outputBase)) {
		rmSync(outputBase, { recursive: true, force: true });
	}

	const results: Result[] = [];

	for (let i = 0; i < combos.length; i++) {
		const combo = combos[i];
		const hasFrontend = combo.features.includes('frontend');
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
			frontendBuild: 'skip',
			frontendCheck: 'skip',
			frontendTest: 'skip',
			warnings: []
		};

		// 1. Generate
		const outputDir = join(outputBase, combo.name);
		try {
			const resolved = resolveFeatures(new Set(combo.features));
			const project = generateProject({ projectName: 'audit-app', features: resolved }, source);

			for (const file of project.files) {
				const fullPath = join(outputDir, file.path);
				mkdirSync(dirname(fullPath), { recursive: true });
				writeFileSync(fullPath, file.content, 'utf-8');
			}

			const effectiveFeatures = project.summary.enabledFeatures;
			console.log(
				`  Generated ${project.summary.totalFiles} files [${effectiveFeatures.join(', ')}]`
			);
			result.generate = 'pass';
		} catch (err: unknown) {
			const msg = err instanceof Error ? err.message : String(err);
			console.log(`  GENERATE FAILED: ${msg}`);
			result.error = msg;
			results.push(result);
			continue;
		}

		// 2. Backend build
		const slnxPath = 'src/backend/AuditApp.slnx';
		console.log('  Backend build...');
		const buildResult = run(`dotnet build ${slnxPath} -v quiet`, outputDir, 180_000);
		if (buildResult.ok) {
			console.log('  Backend build: PASS');
			result.build = 'pass';

			// Check for CS9113 warnings (unused constructor params - broken feature gating)
			if (buildResult.stdout.includes('CS9113')) {
				result.warnings.push('CS9113: unused constructor parameter(s)');
				console.log('  WARNING: CS9113 unused constructor parameter(s)');
			}
		} else {
			console.log('  Backend build: FAIL');
			result.build = 'fail';
			const errors = buildResult.stdout
				.split('\n')
				.filter((l) => l.includes('error '))
				.slice(0, 10);
			result.error = errors.join('\n');
			console.log(errors.map((e) => `    ${e}`).join('\n'));
			results.push(result);
			continue;
		}

		// 3. Backend test
		console.log('  Backend test...');
		const testResult = run(
			`dotnet test ${slnxPath} -c Release -v quiet --no-build`,
			outputDir,
			180_000
		);
		if (!testResult.ok) {
			// Retry with build (sometimes no-build fails on first run)
			const retryResult = run(`dotnet test ${slnxPath} -c Release -v quiet`, outputDir, 180_000);
			if (retryResult.ok) {
				console.log('  Backend test: PASS (retry with build)');
				result.test = 'pass';
			} else {
				console.log('  Backend test: FAIL');
				result.test = 'fail';
				const errors = retryResult.stdout
					.split('\n')
					.filter((l) => l.includes('Failed') || l.includes('error '))
					.slice(0, 10);
				result.error = errors.join('\n');
				console.log(errors.map((e) => `    ${e}`).join('\n'));
			}
		} else {
			console.log('  Backend test: PASS');
			result.test = 'pass';
		}

		// 4. Frontend validation (if frontend feature is included)
		if (hasFrontend) {
			const frontendDir = join(outputDir, 'src', 'frontend');

			// 4a. Install
			console.log('  Frontend install...');
			const installResult = run('pnpm install --frozen-lockfile', frontendDir, 120_000);
			if (!installResult.ok) {
				console.log('  Frontend install: FAIL');
				result.frontendBuild = 'fail';
				result.error = (result.error ? result.error + '\n' : '') + 'pnpm install failed';
				console.log(`    ${installResult.stdout.split('\n').slice(-5).join('\n    ')}`);
				results.push(result);
				continue;
			}

			// 4b. Compile paraglide (generates $lib/paraglide types)
			run('pnpm exec paraglide-js compile --project ./project.inlang', frontendDir, 30_000);

			// 4c. Build (runs Vite + SvelteKit adapter)
			console.log('  Frontend build...');
			const feBuildResult = run('pnpm exec vite build', frontendDir, 180_000);
			if (feBuildResult.ok) {
				console.log('  Frontend build: PASS');
				result.frontendBuild = 'pass';
			} else {
				console.log('  Frontend build: FAIL');
				result.frontendBuild = 'fail';
				const lines = feBuildResult.stdout
					.split('\n')
					.filter((l) => l.includes('Error') || l.includes('error'))
					.slice(0, 10);
				result.error = (result.error ? result.error + '\n' : '') + lines.join('\n');
				console.log(lines.map((e) => `    ${e}`).join('\n'));
				results.push(result);
				continue;
			}

			// 4d. Type check (svelte-check)
			console.log('  Frontend check...');
			const checkResult = run(
				'pnpm exec svelte-kit sync && pnpm exec svelte-check --tsconfig ./tsconfig.json',
				frontendDir,
				120_000
			);
			if (checkResult.ok && !checkResult.stdout.includes('ERRORS')) {
				console.log('  Frontend check: PASS');
				result.frontendCheck = 'pass';
			} else if (checkResult.stdout.includes('0 ERRORS')) {
				console.log('  Frontend check: PASS');
				result.frontendCheck = 'pass';
			} else {
				console.log('  Frontend check: FAIL');
				result.frontendCheck = 'fail';
				const lines = checkResult.stdout
					.split('\n')
					.filter((l) => l.includes('ERROR'))
					.slice(0, 10);
				result.error = (result.error ? result.error + '\n' : '') + lines.join('\n');
				console.log(lines.map((e) => `    ${e}`).join('\n'));
			}

			// 4e. Frontend tests
			console.log('  Frontend test...');
			const feTestResult = run('pnpm exec vitest run', frontendDir, 60_000);
			if (feTestResult.ok) {
				console.log('  Frontend test: PASS');
				result.frontendTest = 'pass';
			} else {
				console.log('  Frontend test: FAIL');
				result.frontendTest = 'fail';
				const lines = feTestResult.stdout
					.split('\n')
					.filter((l) => l.includes('FAIL') || l.includes('Error'))
					.slice(0, 10);
				result.error = (result.error ? result.error + '\n' : '') + lines.join('\n');
				console.log(lines.map((e) => `    ${e}`).join('\n'));
			}
		}

		results.push(result);
	}

	// Summary
	console.log(`\n${'='.repeat(60)}`);
	console.log('AUDIT SUMMARY');
	console.log('='.repeat(60));

	const allOk = (r: Result) =>
		r.generate === 'pass' &&
		r.build === 'pass' &&
		r.test === 'pass' &&
		(r.frontendBuild === 'pass' || r.frontendBuild === 'skip') &&
		(r.frontendCheck === 'pass' || r.frontendCheck === 'skip') &&
		(r.frontendTest === 'pass' || r.frontendTest === 'skip');

	const passed = results.filter((r) => allOk(r) && r.warnings.length === 0);
	const warned = results.filter((r) => allOk(r) && r.warnings.length > 0);
	const failed = results.filter((r) => !allOk(r));

	console.log(`\nPassed: ${passed.length}/${combos.length}`);
	if (warned.length > 0) console.log(`Warnings: ${warned.length}`);
	if (failed.length > 0) console.log(`Failed: ${failed.length}`);

	for (const r of results) {
		const ok = allOk(r);
		const status = !ok ? 'FAIL' : r.warnings.length > 0 ? 'WARN' : 'PASS';
		const icon = status === 'PASS' ? '+' : status === 'WARN' ? '~' : 'X';
		const fe =
			r.frontendBuild !== 'skip'
				? ` fe-build=${r.frontendBuild} fe-check=${r.frontendCheck} fe-test=${r.frontendTest}`
				: '';
		console.log(
			`  [${icon}] ${r.name.padEnd(35)} gen=${r.generate} build=${r.build} test=${r.test}${fe}${r.warnings.length > 0 ? ` (${r.warnings.join(', ')})` : ''}`
		);
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

#!/usr/bin/env node
// Stop hook: warns about uncommitted changes, wrong branch, and version mismatches

import { execSync } from 'child_process';

const git = (cmd) => execSync(cmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });

let warnings = '';

try {
	// Check if on main branch
	const branch = git('git rev-parse --abbrev-ref HEAD').trim();
	if (branch === 'main' || branch === 'master') {
		warnings += `On ${branch} branch! Create a feature branch before committing. `;
	}

	// Check for uncommitted changes
	let hasChanges = false;
	try {
		git('git diff --quiet');
	} catch {
		hasChanges = true;
	}
	try {
		git('git diff --cached --quiet');
	} catch {
		hasChanges = true;
	}
	if (hasChanges) {
		warnings += 'Uncommitted changes detected. ';
	}

	// Check for version mismatch between core and web
	const coreVersion = git('node -p "require(\'./packages/core/package.json\').version"').trim();
	const webVersion = git('node -p "require(\'./packages/web/package.json\').version"').trim();
	if (coreVersion !== webVersion) {
		warnings += `Version mismatch: core=${coreVersion} web=${webVersion}. `;
	}
} catch {
	// Best effort
}

if (warnings) {
	console.log(
		JSON.stringify({
			systemMessage: `Quality gate: ${warnings}`
		})
	);
}

process.exit(0);

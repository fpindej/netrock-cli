#!/usr/bin/env node
// PostToolUse hook: auto-formats files after Write|Edit operations via prettier

import { readFileSync, existsSync } from 'fs';
import { execSync } from 'child_process';
import { extname } from 'path';

let input;
try {
  input = JSON.parse(readFileSync(0, 'utf8'));
} catch {
  process.exit(0);
}

const filePath = input?.tool_input?.file_path;
if (!filePath || !existsSync(filePath)) process.exit(0);

const projectDir = process.env.CLAUDE_PROJECT_DIR;
if (!projectDir) process.exit(0);

const formattable = new Set(['.ts', '.js', '.mjs', '.svelte', '.json', '.css', '.html', '.md']);
const ext = extname(filePath);

try {
  if (formattable.has(ext)) {
    execSync(`pnpm prettier --write "${filePath}"`, {
      cwd: projectDir,
      stdio: 'ignore',
    });
  }
} catch {
  // Formatting is best-effort
}

process.exit(0);

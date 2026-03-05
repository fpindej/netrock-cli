import type { FeatureId } from '../features/types.js';

/**
 * Comment marker patterns for conditional feature blocks.
 *
 * Supports C#, TypeScript, JSON (with comments), YAML, HTML/Svelte, and XML.
 * Each pattern matches a start marker, captures the feature ID, and has a
 * corresponding end marker.
 */
const MARKER_PATTERNS: { start: RegExp; end: RegExp }[] = [
	// C-style single line: // @feature <id>  ...  // @end
	{ start: /^\s*\/\/\s*@feature\s+(\S+)\s*$/, end: /^\s*\/\/\s*@end\s*$/ },
	// Hash comments (YAML, shell): # @feature <id>  ...  # @end
	{ start: /^\s*#\s*@feature\s+(\S+)\s*$/, end: /^\s*#\s*@end\s*$/ },
	// HTML/Svelte: <!-- @feature <id> -->  ...  <!-- @end -->
	{ start: /^\s*<!--\s*@feature\s+(\S+)\s*-->\s*$/, end: /^\s*<!--\s*@end\s*-->\s*$/ }
];

/**
 * Processes template content by evaluating `@feature` conditional markers.
 *
 * Lines between `@feature <id>` and `@end` markers are included only if the
 * feature is in the enabled set. The marker lines themselves are always removed.
 *
 * @param content - The raw template file content
 * @param enabledFeatures - The set of enabled feature IDs
 * @returns The processed content with markers resolved
 */
export function processTemplate(content: string, enabledFeatures: Set<FeatureId>): string {
	const lines = content.split('\n');
	const output: string[] = [];
	let skipDepth = 0;

	for (const line of lines) {
		const startMatch = matchStart(line);
		if (startMatch) {
			const negated = startMatch.startsWith('!');
			const featureId = (negated ? startMatch.slice(1) : startMatch) as FeatureId;
			const isEnabled = enabledFeatures.has(featureId);
			const shouldInclude = negated ? !isEnabled : isEnabled;

			if (skipDepth > 0 || !shouldInclude) {
				skipDepth++;
			}
			// Always strip the marker line
			continue;
		}

		const isEnd = matchEnd(line);
		if (isEnd) {
			if (skipDepth > 0) {
				skipDepth--;
			}
			// Always strip the marker line
			continue;
		}

		if (skipDepth === 0) {
			output.push(line);
		}
	}

	return output.join('\n');
}

function matchStart(line: string): string | null {
	for (const pattern of MARKER_PATTERNS) {
		const match = pattern.start.exec(line);
		if (match?.[1]) return match[1];
	}
	return null;
}

function matchEnd(line: string): boolean {
	return MARKER_PATTERNS.some((pattern) => pattern.end.test(line));
}

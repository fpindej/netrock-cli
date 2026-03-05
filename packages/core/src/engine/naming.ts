/**
 * Derives all name formats needed during project generation from a single input.
 *
 * The input can be any reasonable project name format (kebab-case, PascalCase,
 * camelCase, space-separated, dot-separated). The output provides every
 * format used across the template files.
 */
export interface ProjectNames {
	/** PascalCase for C# namespaces and project names: `MyApp` */
	pascalCase: string;

	/** kebab-case for Docker, URLs, directory names: `my-app` */
	kebabCase: string;

	/** camelCase for JSON keys and JS variables: `myApp` */
	camelCase: string;

	/** lowercase for Docker image names and DB names: `myapp` */
	lowercase: string;
}

/**
 * Parses an input string into constituent words by splitting on common
 * delimiters (hyphens, dots, underscores, spaces) and PascalCase boundaries.
 */
function toWords(input: string): string[] {
	return input
		.replace(/([a-z])([A-Z])/g, '$1 $2') // split camelCase/PascalCase
		.split(/[-._\s]+/) // split on delimiters
		.filter((w) => w.length > 0)
		.map((w) => w.toLowerCase());
}

/** Capitalizes the first letter of a string. */
function capitalize(word: string): string {
	return word.charAt(0).toUpperCase() + word.slice(1);
}

/**
 * Derives all project name formats from a user-provided project name.
 *
 * @param input - The project name in any format (e.g. "my-app", "MyApp", "my app")
 * @returns All derived name formats
 */
export function deriveNames(input: string): ProjectNames {
	const words = toWords(input.trim());

	if (words.length === 0) {
		throw new Error('Project name cannot be empty');
	}

	return {
		pascalCase: words.map(capitalize).join(''),
		kebabCase: words.join('-'),
		camelCase: words[0] + words.slice(1).map(capitalize).join(''),
		lowercase: words.join('')
	};
}

/**
 * Replaces all occurrences of the template placeholder namespace with the
 * user's project name in a file's content.
 *
 * Handles all name format variations:
 * - `MyProject` (PascalCase) - C# namespaces, class names, csproj names
 * - `my-project` (kebab-case) - Docker service names, URLs
 * - `myProject` (camelCase) - JSON config keys
 * - `myproject` (lowercase) - DB names, Docker image names
 *
 * @param content - The template file content
 * @param names - The derived project name formats
 * @returns Content with all placeholders replaced
 */
export function substituteNamespace(content: string, names: ProjectNames): string {
	return content
		.replaceAll('MyProject', names.pascalCase)
		.replaceAll('my-project', names.kebabCase)
		.replaceAll('myProject', names.camelCase)
		.replaceAll('myproject', names.lowercase);
}

/**
 * Replaces placeholder namespace in a file path.
 *
 * @param filePath - The template file path
 * @param names - The derived project name formats
 * @returns Path with placeholders replaced
 */
export function substitutePathNamespace(filePath: string, names: ProjectNames): string {
	return filePath.replaceAll('MyProject', names.pascalCase).replaceAll('my-project', names.kebabCase);
}

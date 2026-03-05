import { describe, it, expect } from 'vitest';
import {
	deriveNames,
	substituteNamespace,
	substitutePathNamespace
} from '../../src/engine/naming.js';

describe('deriveNames', () => {
	it('converts kebab-case input', () => {
		const names = deriveNames('my-cool-app');
		expect(names.pascalCase).toBe('MyCoolApp');
		expect(names.kebabCase).toBe('my-cool-app');
		expect(names.camelCase).toBe('myCoolApp');
		expect(names.lowercase).toBe('mycoolapp');
	});

	it('converts PascalCase input', () => {
		const names = deriveNames('MyCoolApp');
		expect(names.pascalCase).toBe('MyCoolApp');
		expect(names.kebabCase).toBe('my-cool-app');
		expect(names.camelCase).toBe('myCoolApp');
		expect(names.lowercase).toBe('mycoolapp');
	});

	it('converts space-separated input', () => {
		const names = deriveNames('my cool app');
		expect(names.pascalCase).toBe('MyCoolApp');
		expect(names.kebabCase).toBe('my-cool-app');
	});

	it('converts dot-separated input', () => {
		const names = deriveNames('my.cool.app');
		expect(names.pascalCase).toBe('MyCoolApp');
		expect(names.kebabCase).toBe('my-cool-app');
	});

	it('converts single word', () => {
		const names = deriveNames('netrock');
		expect(names.pascalCase).toBe('Netrock');
		expect(names.kebabCase).toBe('netrock');
		expect(names.camelCase).toBe('netrock');
		expect(names.lowercase).toBe('netrock');
	});

	it('handles underscore-separated input', () => {
		const names = deriveNames('my_cool_app');
		expect(names.pascalCase).toBe('MyCoolApp');
		expect(names.kebabCase).toBe('my-cool-app');
	});

	it('trims whitespace', () => {
		const names = deriveNames('  my-app  ');
		expect(names.pascalCase).toBe('MyApp');
	});

	it('throws on empty input', () => {
		expect(() => deriveNames('')).toThrow('Project name cannot be empty');
		expect(() => deriveNames('   ')).toThrow('Project name cannot be empty');
	});
});

describe('substituteNamespace', () => {
	it('replaces all namespace formats in content', () => {
		const content = [
			'namespace MyProject.WebApi;',
			'image: myproject-api',
			'service: my-project-api',
			'"apiUrl": "myProject"'
		].join('\n');

		const names = deriveNames('cool-app');
		const result = substituteNamespace(content, names);

		expect(result).toContain('namespace CoolApp.WebApi;');
		expect(result).toContain('image: coolapp-api');
		expect(result).toContain('service: cool-app-api');
		expect(result).toContain('"apiUrl": "coolApp"');
	});
});

describe('substitutePathNamespace', () => {
	it('replaces PascalCase in file paths', () => {
		const names = deriveNames('cool-app');
		const result = substitutePathNamespace(
			'src/backend/MyProject.WebApi/Program.cs',
			names
		);
		expect(result).toBe('src/backend/CoolApp.WebApi/Program.cs');
	});

	it('replaces kebab-case in file paths', () => {
		const names = deriveNames('cool-app');
		const result = substitutePathNamespace('deploy/my-project/docker-compose.yml', names);
		expect(result).toBe('deploy/cool-app/docker-compose.yml');
	});
});

import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		include: ['tests/integration/dotnet-matrix.test.ts'],
		testTimeout: 300_000,
		hookTimeout: 60_000
	}
});

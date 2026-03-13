<script lang="ts">
	import { generator } from '$lib/stores/generator.svelte';
	import { deriveNames } from '@netrock/core';

	let names = $derived(
		generator.isValidName ? deriveNames(generator.projectName.trim()) : null
	);
</script>

<section class="mx-auto w-full max-w-2xl px-4">
	<div class="mb-3 font-mono text-xs tracking-widest text-text-muted uppercase">
		Project name
	</div>

	<div class="group relative">
		<input
			type="text"
			bind:value={generator.projectName}
			placeholder="my-app"
			spellcheck="false"
			autocomplete="off"
			class="w-full rounded-xl border border-border-subtle bg-surface px-5 py-4 font-mono text-xl text-text-primary outline-none transition-all placeholder:text-text-muted focus:border-accent focus:ring-1 focus:ring-accent/30"
		/>
		{#if generator.projectName && !generator.isValidName}
			<p class="mt-2 text-sm text-red-400">
				Start with a letter, then letters, numbers, or hyphens only.
			</p>
		{/if}
	</div>

	{#if names}
		<div class="mt-4 flex flex-wrap gap-3">
			<div class="rounded-lg bg-surface px-3 py-1.5">
				<span class="text-xs text-text-muted">namespace</span>
				<span class="ms-2 font-mono text-sm text-accent-light">{names.pascalCase}</span>
			</div>
			<div class="rounded-lg bg-surface px-3 py-1.5">
				<span class="text-xs text-text-muted">slug</span>
				<span class="ms-2 font-mono text-sm text-text-secondary">{names.kebabCase}</span>
			</div>
		</div>
	{/if}
</section>

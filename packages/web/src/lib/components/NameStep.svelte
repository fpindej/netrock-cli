<script lang="ts">
	import { generator } from '$lib/stores/generator.svelte';
	import { deriveNames } from '@netrock/core';

	let names = $derived(
		generator.isValidName ? deriveNames(generator.projectName.trim()) : null
	);
</script>

<section class="w-full max-w-xl">
	<label for="project-name" class="label mb-2 block">Project name</label>

	<input
		id="project-name"
		type="text"
		bind:value={generator.projectName}
		placeholder="my-app"
		spellcheck="false"
		autocomplete="off"
		class="w-full border-b-2 border-border-active bg-transparent py-2 font-mono text-2xl text-text-primary outline-none transition-colors placeholder:text-text-muted focus:border-accent sm:text-3xl"
	/>
	{#if generator.projectName && !generator.isValidName}
		<p class="mt-2 text-sm text-amber">
			Start with a letter, then letters, numbers, or hyphens only.
		</p>
	{/if}

	{#if names}
		<dl class="mt-3 flex flex-wrap gap-x-6 gap-y-1 font-mono text-xs">
			<div class="flex items-baseline gap-2">
				<dt class="text-text-muted">namespace</dt>
				<dd class="text-text-primary">{names.pascalCase}</dd>
			</div>
			<div class="flex items-baseline gap-2">
				<dt class="text-text-muted">slug</dt>
				<dd class="text-text-secondary">{names.kebabCase}</dd>
			</div>
		</dl>
	{/if}
</section>

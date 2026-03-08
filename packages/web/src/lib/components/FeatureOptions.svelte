<script lang="ts">
	import { generator } from '$lib/stores/generator.svelte';
	import type { Feature } from '@netrock/core';

	interface Props {
		feature: Feature;
	}

	let { feature }: Props = $props();

	let selectedOptions = $derived(generator.getSelectedOptions(feature.id));
	let allSelected = $derived(selectedOptions?.size === feature.options!.length);
	let noneSelected = $derived(selectedOptions?.size === 0);
</script>

<div class="mt-2 rounded-xl border border-accent/30 bg-accent-dim px-4 pb-3.5 pt-3">
	<div class="mb-2.5 flex items-center justify-between">
		<span class="font-mono text-[10px] uppercase tracking-wider text-text-muted">
			Providers
		</span>
		<button
			type="button"
			onclick={() => generator.setAllOptions(feature.id, !allSelected)}
			class="min-h-7 font-mono text-[10px] text-accent transition-colors hover:text-accent-light"
		>
			{allSelected ? 'Deselect all' : 'Select all'}
		</button>
	</div>
	<div class="flex flex-wrap gap-2">
		{#each feature.options! as option}
			{@const isSelected = selectedOptions?.has(option.id) ?? false}
			<button
				type="button"
				onclick={() => generator.toggleOption(feature.id, option.id)}
				class="inline-flex min-h-9 items-center gap-1.5 rounded-lg px-3 font-mono text-xs transition-all
					{isSelected
					? 'bg-accent/15 text-accent-light'
					: 'bg-surface/60 text-text-muted hover:bg-surface hover:text-text-secondary'}"
			>
				<div
					class="flex size-3.5 items-center justify-center rounded border transition-all
						{isSelected
						? 'border-accent bg-accent text-bg'
						: 'border-border-active bg-transparent'}"
				>
					{#if isSelected}
						<svg
							class="size-2"
							viewBox="0 0 12 12"
							fill="none"
							stroke="currentColor"
							stroke-width="2.5"
						>
							<path d="M2 6l3 3 5-5" />
						</svg>
					{/if}
				</div>
				{option.name}
			</button>
		{/each}
	</div>
	{#if noneSelected}
		<p class="mt-2.5 text-[10px] text-amber">
			No providers selected - OAuth infrastructure is included but no providers will be registered.
		</p>
	{/if}
</div>

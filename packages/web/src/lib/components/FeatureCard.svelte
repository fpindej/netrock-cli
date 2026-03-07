<script lang="ts">
	import { generator } from '$lib/stores/generator.svelte';
	import type { Feature } from '@netrock/core';

	interface Props {
		feature: Feature;
	}

	let { feature }: Props = $props();

	let isOn = $derived(generator.resolvedFeatures.has(feature.id));
	let isRequired = $derived(feature.required);
	let isAutoEnabled = $derived(generator.isAutoEnabled(feature.id));
	let isExplicit = $derived(generator.isEnabled(feature.id));
</script>

<button
	type="button"
	onclick={() => generator.toggle(feature.id)}
	disabled={isRequired}
	class="group relative flex w-full items-start gap-4 rounded-xl border px-4 py-3.5 text-start transition-all
		{isOn
		? 'border-accent/30 bg-accent-dim'
		: 'border-border-subtle bg-surface hover:border-border-active hover:bg-surface-raised'}
		{isRequired ? 'cursor-default opacity-70' : 'cursor-pointer'}"
>
	<!-- Toggle indicator -->
	<div class="mt-0.5 flex-shrink-0">
		<div
			class="flex size-5 items-center justify-center rounded-md border transition-all
				{isOn
				? 'border-accent bg-accent text-bg'
				: 'border-border-active bg-transparent'}"
		>
			{#if isOn}
				<svg class="size-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M2 6l3 3 5-5" />
				</svg>
			{/if}
		</div>
	</div>

	<!-- Content -->
	<div class="min-w-0 flex-1">
		<div class="flex items-center gap-2">
			<span class="font-medium text-sm text-text-primary">{feature.name}</span>
			{#if isRequired}
				<span class="rounded bg-border-subtle px-1.5 py-0.5 font-mono text-[10px] text-text-muted">
					required
				</span>
			{/if}
			{#if isAutoEnabled && !isRequired}
				<span class="rounded bg-accent-dim px-1.5 py-0.5 font-mono text-[10px] text-accent">
					auto
				</span>
			{/if}
		</div>
		<p class="mt-0.5 text-xs leading-relaxed text-text-secondary">{feature.description}</p>
		{#if feature.dependencies.length > 0}
			<div class="mt-1.5 flex flex-wrap gap-1">
				{#each feature.dependencies as dep}
					<span class="rounded bg-surface px-1.5 py-0.5 font-mono text-[10px] text-text-muted">
						{dep}
					</span>
				{/each}
			</div>
		{/if}
	</div>
</button>

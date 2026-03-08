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
	let isLocked = $derived(generator.isLockedByFrontend(feature.id));
	let hasOptions = $derived(!!feature.options?.length);
	let showOptions = $derived(isOn && hasOptions && !isLocked);
	let selectedOptions = $derived(generator.getSelectedOptions(feature.id));
	let selectedCount = $derived(selectedOptions?.size ?? 0);
	let allSelected = $derived(selectedOptions?.size === feature.options?.length);
	let noneSelected = $derived(selectedOptions?.size === 0);
</script>

<div
	class="flex w-full flex-col rounded-xl border transition-all
		{isOn
		? 'border-accent/30 bg-accent-dim'
		: 'border-border-subtle bg-surface hover:border-border-active hover:bg-surface-raised'}
		{isRequired ? 'opacity-70' : ''}"
>
	<button
		type="button"
		onclick={() => generator.toggle(feature.id)}
		disabled={isRequired || isLocked}
		class="group relative flex w-full items-start gap-4 px-4 py-3.5 text-start
			{isRequired || isLocked ? 'cursor-default' : 'cursor-pointer'}"
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
					<svg
						class="size-3"
						viewBox="0 0 12 12"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						<path d="M2 6l3 3 5-5" />
					</svg>
				{/if}
			</div>
		</div>

		<!-- Content -->
		<div class="min-w-0 flex-1">
			<div class="flex items-center gap-2">
				<span class="text-sm font-medium text-text-primary">{feature.name}</span>
				{#if isRequired}
					<span
						class="rounded bg-border-subtle px-1.5 py-0.5 font-mono text-[10px] text-text-muted"
					>
						required
					</span>
				{/if}
				{#if isAutoEnabled && !isRequired}
					<span class="rounded bg-accent-dim px-1.5 py-0.5 font-mono text-[10px] text-accent">
						auto
					</span>
				{/if}
				{#if isLocked && !isRequired}
					<span class="rounded bg-amber-dim px-1.5 py-0.5 font-mono text-[10px] text-amber">
						locked
					</span>
				{/if}
				{#if showOptions}
					<span class="rounded bg-surface px-1.5 py-0.5 font-mono text-[10px] text-text-muted">
						{selectedCount}/{feature.options!.length}
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

	<!-- Inline options panel -->
	{#if showOptions}
		<div class="border-t border-accent/20 px-4 pb-3.5 pt-3">
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
					No providers selected - OAuth infrastructure is included but no providers will be
					registered.
				</p>
			{/if}
		</div>
	{/if}
</div>

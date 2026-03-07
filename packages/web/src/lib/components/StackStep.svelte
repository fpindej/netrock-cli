<script lang="ts">
	import { generator } from '$lib/stores/generator.svelte';
	import FeatureCard from './FeatureCard.svelte';

	const presetMeta: Record<string, { badge?: string; icon: string }> = {
		minimal: { icon: '>' },
		standard: { badge: 'Popular', icon: '>>' },
		full: { icon: '>>>' },
		'api-only': { icon: 'api' }
	};
</script>

<section id="features" class="mx-auto w-full max-w-4xl px-4">
	<div class="mb-3 font-mono text-xs tracking-widest text-text-muted uppercase">
		02 / Choose your stack
	</div>

	<!-- Presets -->
	<div class="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
		{#each generator.presets as preset}
			{@const meta = presetMeta[preset.id]}
			<button
				type="button"
				onclick={() => generator.applyPreset(preset.id)}
				class="relative flex flex-col items-center rounded-xl border px-3 py-4 transition-all
					{generator.activePresetId === preset.id
					? 'border-accent bg-accent-dim'
					: 'border-border-subtle bg-surface hover:border-border-active hover:bg-surface-raised'}"
			>
				{#if meta?.badge}
					<span
						class="absolute -top-2 rounded-full bg-accent px-2 py-0.5 text-[10px] font-medium text-bg"
					>
						{meta.badge}
					</span>
				{/if}
				<span class="mb-1 font-mono text-xs text-text-muted">{meta?.icon}</span>
				<span class="text-sm font-medium text-text-primary">{preset.name}</span>
				<span class="mt-0.5 text-center text-xs text-text-secondary">{preset.description}</span>
				<span class="mt-2 font-mono text-xs text-text-muted">
					{preset.features.length} features
				</span>
			</button>
		{/each}
	</div>

	<!-- Custom label -->
	{#if !generator.activePresetId}
		<div
			class="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent-dim px-3 py-1"
		>
			<span class="font-mono text-xs text-accent">Custom configuration</span>
		</div>
	{/if}

	<!-- Feature groups -->
	<div class="space-y-6">
		{#each generator.groups as group}
			<div>
				<h3 class="mb-3 font-mono text-xs tracking-widest text-text-muted uppercase">
					{group.label}
				</h3>
				<div class="grid gap-2 sm:grid-cols-2">
					{#each group.features as feature}
						<FeatureCard {feature} />
					{/each}
				</div>
			</div>
		{/each}
	</div>

	<!-- Frontend (coming soon) -->
	<div class="mt-6">
		<h3 class="mb-3 font-mono text-xs tracking-widest text-text-muted uppercase">Frontend</h3>
		<div class="grid gap-2 sm:grid-cols-2">
			<div
				class="relative flex w-full items-start gap-4 rounded-xl border border-border-subtle bg-surface px-4 py-3.5 opacity-50"
			>
				<div class="mt-0.5 flex-shrink-0">
					<div
						class="flex size-5 items-center justify-center rounded-md border border-border-active bg-transparent"
					></div>
				</div>
				<div class="min-w-0 flex-1">
					<div class="flex items-center gap-2">
						<span class="text-sm font-medium text-text-primary">SvelteKit frontend</span>
						<span
							class="rounded bg-accent-dim px-1.5 py-0.5 font-mono text-[10px] text-accent"
						>
							coming soon
						</span>
					</div>
					<p class="mt-0.5 text-xs leading-relaxed text-text-secondary">
						Full SvelteKit 5 reference client with all feature UIs, auth flows, admin panel, and
						more.
					</p>
				</div>
			</div>
		</div>
	</div>

	<!-- Notes -->
	{#if generator.notes.length > 0}
		<div class="mt-6 space-y-2">
			{#each generator.notes as note}
				<div class="flex gap-3 rounded-lg border border-amber/20 bg-amber-dim px-4 py-3">
					<svg class="mt-0.5 size-4 flex-shrink-0 text-amber" viewBox="0 0 20 20" fill="currentColor">
						<path
							fill-rule="evenodd"
							d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
							clip-rule="evenodd"
						/>
					</svg>
					<div>
						<p class="text-sm font-medium text-amber">{note.title}</p>
						<p class="mt-0.5 text-xs leading-relaxed text-text-secondary">{note.message}</p>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</section>

<script lang="ts">
	import { generator } from '$lib/stores/generator.svelte';
	import FeatureCard from './FeatureCard.svelte';
	import DependencyGraph from './DependencyGraph.svelte';
	import StrataColumn from './StrataColumn.svelte';

	const presetMeta: Record<string, { badge?: string; icon: string }> = {
		minimal: { icon: '>' },
		standard: { badge: 'Popular', icon: '>>' },
		full: { icon: '>>>' }
	};

	const comingSoonFrameworks = ['Angular', 'Next.js', 'Nuxt', 'React SPA'];
</script>

<section class="mx-auto grid w-full max-w-5xl gap-10 px-4 lg:grid-cols-[minmax(0,1fr)_240px] lg:gap-16">
<div class="min-w-0">
	<h1 class="display-md anim-up mb-8 text-3xl text-text-primary sm:text-4xl">Choose your stack.</h1>

	<!-- Architecture selector -->
	<div class="anim-up mb-10">
		<div class="label mb-2">Architecture</div>
		<div class="border border-border-subtle">
			<div class="grid grid-cols-2">
				<!-- API only -->
				<button
					type="button"
					onclick={() => {
						if (generator.isFrontendEnabled) generator.toggleFrontend();
					}}
					class="flex flex-col items-center px-4 py-6 transition-colors sm:px-6
						{!generator.isFrontendEnabled
						? 'bg-accent-dim'
						: 'bg-transparent hover:bg-surface'}"
				>
					<!-- Visual: single layer -->
					<div
						class="hatch-cross flex h-10 w-20 items-center justify-center border transition-colors
							{!generator.isFrontendEnabled
							? 'border-accent/60'
							: 'border-border-subtle'}"
						style="--strata: {!generator.isFrontendEnabled ? 'var(--color-accent)' : 'var(--color-border-active)'}"
					>
						<span
							class="bg-bg px-1 font-mono text-[11px] font-semibold transition-colors
								{!generator.isFrontendEnabled ? 'text-accent' : 'text-text-muted'}"
						>.NET</span>
					</div>
					<span class="mt-3 text-sm font-semibold text-text-primary">API only</span>
					<span class="mt-0.5 text-center text-xs text-text-secondary">
						Backend for any client
					</span>
				</button>

				<!-- Full stack -->
				<button
					type="button"
					onclick={() => {
						if (!generator.isFrontendEnabled) generator.toggleFrontend();
					}}
					class="flex flex-col items-center border-s border-border-subtle px-4 py-6 transition-colors sm:px-6
						{generator.isFrontendEnabled
						? 'bg-accent-dim'
						: 'bg-transparent hover:bg-surface'}"
				>
					<!-- Visual: two stacked layers -->
					<div
						class="w-20 overflow-hidden border transition-colors
							{generator.isFrontendEnabled
							? 'border-accent/60'
							: 'border-border-subtle'}"
					>
						<div
							class="hatch-solid flex h-[19px] items-center justify-center transition-colors"
							style="--strata: {generator.isFrontendEnabled ? 'color-mix(in srgb, var(--color-strata-frontend) 35%, var(--color-bg))' : 'var(--color-surface-raised)'}"
						>
							<span
								class="font-mono text-[10px] font-semibold transition-colors
									{generator.isFrontendEnabled ? 'text-text-primary' : 'text-text-muted'}"
							>Svelte</span>
						</div>
						<div
							class="hatch-cross flex h-[19px] items-center justify-center border-t transition-colors
								{generator.isFrontendEnabled ? 'border-accent/40' : 'border-border-subtle'}"
							style="--strata: {generator.isFrontendEnabled ? 'var(--color-accent)' : 'var(--color-border-active)'}"
						>
							<span
								class="bg-bg px-1 font-mono text-[10px] font-semibold transition-colors
									{generator.isFrontendEnabled ? 'text-accent' : 'text-text-muted'}"
							>.NET</span>
						</div>
					</div>
					<span class="mt-3 text-sm font-semibold text-text-primary">Full stack</span>
					<span class="mt-0.5 text-center text-xs text-text-secondary">
						SvelteKit + .NET API
					</span>
				</button>
			</div>
		</div>

		<!-- Coming soon frameworks -->
		<p class="mt-2 font-mono text-[10px] text-text-muted">
			<span class="tracking-wider uppercase">Coming soon</span>
			<span class="mx-1 text-border-active">/</span>
			{comingSoonFrameworks.join(', ')}
		</p>
	</div>

	<!-- Backend presets -->
	<div class="anim-up mb-10">
		<div class="label mb-2">Presets</div>
		<div class="grid grid-cols-3 border border-border-subtle">
			{#each generator.presets as preset, i}
				{@const meta = presetMeta[preset.id]}
				<button
					type="button"
					onclick={() => generator.applyPreset(preset.id)}
					class="relative flex flex-col items-start px-3 py-3 text-start transition-colors sm:px-4
						{i > 0 ? 'border-s border-border-subtle' : ''}
						{generator.activePresetId === preset.id
						? 'bg-accent-dim'
						: 'hover:bg-surface'}"
				>
					<span class="flex w-full items-baseline justify-between font-mono text-[10px]">
						<span class="{generator.activePresetId === preset.id ? 'text-accent' : 'text-text-muted'}">{meta?.icon}</span>
						{#if meta?.badge}
							<span class="tracking-wider text-text-muted uppercase">{meta.badge}</span>
						{/if}
					</span>
					<span class="mt-1 text-sm font-medium text-text-primary">{preset.name}</span>
					<span class="mt-0.5 hidden text-xs text-text-secondary sm:block">{preset.description}</span>
					<span class="mt-2 font-mono text-[11px] tabular-nums text-text-muted">
						{preset.features.length} features
					</span>
				</button>
			{/each}
		</div>
	</div>

	<!-- Dependency graph -->
	<div class="anim-up mb-6">
		<DependencyGraph />
	</div>

	<!-- Notes -->
	{#if generator.notes.length > 0}
		<details class="group mb-6 border border-amber/30 bg-amber-dim">
			<summary
				class="flex min-h-[44px] cursor-pointer items-center gap-2.5 px-4 py-3 select-none sm:min-h-0"
			>
				<svg class="size-4 shrink-0 text-amber" viewBox="0 0 20 20" fill="currentColor">
					<path
						fill-rule="evenodd"
						d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
						clip-rule="evenodd"
					/>
				</svg>
				<span class="font-mono text-sm font-medium text-amber">
					{generator.notes.length}
					{generator.notes.length === 1 ? 'thing' : 'things'} to know about your selection
				</span>
				<svg
					class="ms-auto size-4 shrink-0 text-amber/60 transition-transform group-open:rotate-180"
					viewBox="0 0 16 16"
					fill="currentColor"
				>
					<path
						fill-rule="evenodd"
						d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
						clip-rule="evenodd"
					/>
				</svg>
			</summary>
			<div class="space-y-2 border-t border-amber/15 px-4 py-3">
				{#each generator.notes as note}
					<div>
						<p class="text-sm font-medium text-amber">{note.title}</p>
						<p class="mt-0.5 text-xs leading-relaxed text-text-secondary">{note.message}</p>
					</div>
				{/each}
			</div>
		</details>
	{/if}

	<!-- Feature cards (collapsed by default) -->
	<details id="feature-cards" class="group">
		<summary
			class="flex min-h-[44px] cursor-pointer items-center gap-2 py-2 font-mono text-xs text-text-muted transition-colors select-none hover:text-text-secondary sm:min-h-0"
		>
			<svg
				class="size-3.5 transition-transform group-open:rotate-90"
				viewBox="0 0 16 16"
				fill="currentColor"
			>
				<path
					d="M6.22 4.22a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.75.75 0 0 1-1.06-1.06L8.94 8 6.22 5.28a.75.75 0 0 1 0-1.06Z"
				/>
			</svg>
			{!generator.activePresetId ? 'Custom configuration' : 'All features'}
			<span class="text-text-muted/60">- toggle individually</span>
		</summary>
		<div class="mt-4 space-y-6">
			{#each generator.groups as group}
				<div>
					<h3 class="label mb-2">{group.label}</h3>
					<div class="grid gap-px border border-border-subtle bg-border-subtle sm:grid-cols-2">
						{#each group.features as feature}
							<FeatureCard {feature} />
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</details>
</div>

<aside class="anim-up order-first self-start lg:order-none lg:sticky lg:top-32">
	<StrataColumn compact />
	<p class="mt-3 text-[11px] leading-relaxed text-text-muted">
		Updates as you toggle. Thickness reflects each feature's share of files.
	</p>
</aside>
</section>

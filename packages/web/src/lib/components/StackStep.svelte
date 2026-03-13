<script lang="ts">
	import { generator } from '$lib/stores/generator.svelte';
	import FeatureCard from './FeatureCard.svelte';
	import DependencyGraph from './DependencyGraph.svelte';

	const presetMeta: Record<string, { badge?: string; icon: string }> = {
		minimal: { icon: '>' },
		standard: { badge: 'Popular', icon: '>>' },
		full: { icon: '>>>' }
	};

	const comingSoonFrameworks = ['Angular', 'Next.js', 'Nuxt', 'React SPA'];
</script>

<section class="mx-auto w-full max-w-4xl px-4">
	<div class="mb-3 font-mono text-xs tracking-widest text-text-muted uppercase">
		Choose your stack
	</div>

	<!-- Architecture selector -->
	<div class="mb-10">
		<div class="overflow-hidden rounded-xl border border-border-subtle">
			<div class="grid grid-cols-2">
				<!-- API only -->
				<button
					type="button"
					onclick={() => {
						if (generator.isFrontendEnabled) generator.toggleFrontend();
					}}
					class="flex flex-col items-center px-4 py-6 transition-all sm:px-6
						{!generator.isFrontendEnabled
						? 'bg-accent-dim'
						: 'bg-surface hover:bg-surface-raised'}"
				>
					<!-- Visual: single layer -->
					<div
						class="flex h-10 w-20 items-center justify-center rounded-lg border transition-colors
							{!generator.isFrontendEnabled
							? 'border-accent/40 bg-accent/10'
							: 'border-border-subtle bg-surface-raised'}"
					>
						<span
							class="font-mono text-[11px] font-semibold transition-colors
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
					class="flex flex-col items-center border-s border-border-subtle px-4 py-6 transition-all sm:px-6
						{generator.isFrontendEnabled
						? 'bg-accent-dim'
						: 'bg-surface hover:bg-surface-raised'}"
				>
					<!-- Visual: two stacked layers -->
					<div
						class="w-20 overflow-hidden rounded-lg border transition-colors
							{generator.isFrontendEnabled
							? 'border-accent/40'
							: 'border-border-subtle'}"
					>
						<div
							class="flex h-[19px] items-center justify-center transition-colors
								{generator.isFrontendEnabled
								? 'bg-accent/10'
								: 'bg-surface-raised'}"
						>
							<span
								class="font-mono text-[10px] font-semibold transition-colors
									{generator.isFrontendEnabled ? 'text-accent' : 'text-text-muted'}"
							>Svelte</span>
						</div>
						<div
							class="flex h-[19px] items-center justify-center border-t transition-colors
								{generator.isFrontendEnabled
								? 'border-accent/30 bg-accent/10'
								: 'border-border-subtle bg-surface-raised'}"
						>
							<span
								class="font-mono text-[10px] font-semibold transition-colors
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
		<div class="mt-3 flex flex-wrap items-center justify-center gap-2">
			<span class="font-mono text-[10px] uppercase tracking-wider text-text-muted">
				Coming soon
			</span>
			{#each comingSoonFrameworks as framework}
				<span
					class="rounded-lg border border-border-subtle bg-surface px-2.5 py-1 font-mono text-[10px] text-text-muted"
				>
					{framework}
				</span>
			{/each}
		</div>
	</div>

	<!-- Backend presets -->
	<div class="mb-8 grid grid-cols-3 gap-3">
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

	<!-- Dependency graph -->
	<div class="mb-6">
		<DependencyGraph />
	</div>

	<!-- Notes -->
	{#if generator.notes.length > 0}
		<div class="mb-6 space-y-2">
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

	<!-- Feature cards (collapsed by default) -->
	<details id="feature-cards" class="group">
		<summary
			class="flex cursor-pointer items-center gap-2 rounded-lg px-1 py-2 font-mono text-xs text-text-muted transition-colors select-none hover:text-text-secondary"
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
	</details>

</section>

<script lang="ts">
	import { onMount } from 'svelte';
	import { animate, stagger } from 'animejs';
	import { getManifest, substitutePathNamespace, type FeatureId } from '@netrock/core';
	import { generator } from '$lib/stores/generator.svelte';

	interface Props {
		/** Compact mode hides per-layer file counts and tightens spacing. */
		compact?: boolean;
	}

	let { compact = false }: Props = $props();

	interface Layer {
		id: FeatureId;
		name: string;
		files: number;
		tone: string;
		hatch: string;
	}

	/** Deposition order, bottom-up: bedrock first, topsoil last. */
	const ORDER: FeatureId[] = [
		'core',
		'aspire',
		'email',
		'auth',
		'audit',
		'jobs',
		'file-storage',
		'2fa',
		'oauth',
		'captcha',
		'avatars',
		'admin',
		'claude',
		'claude-skills',
		'frontend'
	];

	const STYLE: Record<string, { tone: string; hatch: string }> = {
		core: { tone: 'var(--color-strata-core)', hatch: 'hatch-cross' },
		aspire: { tone: 'var(--color-strata-core)', hatch: 'hatch-brick' },
		email: { tone: 'var(--color-strata-infra)', hatch: 'hatch-wave' },
		auth: { tone: 'var(--color-strata-auth)', hatch: 'hatch-solid' },
		audit: { tone: 'var(--color-strata-infra)', hatch: 'hatch-dots' },
		jobs: { tone: 'var(--color-strata-infra)', hatch: 'hatch-diag' },
		'file-storage': { tone: 'var(--color-strata-infra)', hatch: 'hatch-brick' },
		'2fa': { tone: 'var(--color-strata-addon)', hatch: 'hatch-diag' },
		oauth: { tone: 'var(--color-strata-addon)', hatch: 'hatch-dots' },
		captcha: { tone: 'var(--color-strata-addon)', hatch: 'hatch-wave' },
		avatars: { tone: 'var(--color-strata-addon)', hatch: 'hatch-cross' },
		admin: { tone: 'var(--color-strata-auth)', hatch: 'hatch-diag' },
		claude: { tone: 'var(--color-strata-tooling)', hatch: 'hatch-dots' },
		'claude-skills': { tone: 'var(--color-strata-tooling)', hatch: 'hatch-diag' },
		frontend: { tone: 'var(--color-strata-frontend)', hatch: 'hatch-solid' }
	};

	let layers = $derived.by((): Layer[] => {
		const project = generator.project;
		const generated = new Set(generator.filePaths);
		const result: Layer[] = [];
		for (const id of ORDER) {
			if (!generator.resolvedFeatures.has(id)) continue;
			const manifest = getManifest(id);
			let files = 0;
			if (manifest && project) {
				for (const entry of manifest.files) {
					if (generated.has(substitutePathNamespace(entry.path, project.names))) files++;
				}
			}
			const def = generator.definitions.find((d) => d.id === id);
			const style = STYLE[id] ?? STYLE.core!;
			result.push({ id, name: def?.name ?? id, files, tone: style.tone, hatch: style.hatch });
		}
		return result;
	});

	let total = $derived(layers.reduce((n, l) => n + l.files, 0));

	/**
	 * Layer thickness in px. Grows with the square root of the file share so the
	 * biggest layers do not crush the thin ones out of legibility.
	 */
	function thickness(files: number): number {
		if (total === 0) return 0;
		const base = compact ? 12 : 16;
		const scale = compact ? 60 : 96;
		return Math.round(base + Math.sqrt(files / total) * scale);
	}

	let columnEl: HTMLDivElement;
	/** Layers start hidden until the deposition animation has run once; later additions appear immediately. */
	let settled = $state(false);

	onMount(() => {
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			settled = true;
			return;
		}
		animate(columnEl.querySelectorAll('.stratum'), {
			opacity: [0, 1],
			translateY: [8, 0],
			delay: stagger(55, { from: 'last' }),
			duration: 500,
			ease: 'outCubic',
			onComplete: () => (settled = true)
		});
	});
</script>

<figure class="w-full select-none" aria-label="Project layers by file count">
	<!-- Borehole header: the project name is the survey ID -->
	<figcaption class="mb-2 flex items-baseline justify-between gap-3">
		<span class="label">Column</span>
		<span class="truncate font-mono text-xs text-text-secondary">
			{generator.isValidName ? generator.project?.names.kebabCase : 'my-app'}
		</span>
	</figcaption>

	<div bind:this={columnEl} class="grid grid-cols-[1fr_auto] gap-x-3">
		<!-- Strata -->
		<div class="flex flex-col-reverse gap-px border-x border-b border-border-active pb-px">
			{#each layers as layer (layer.id)}
				<div
					class="stratum {settled ? '' : 'opacity-0'} {layer.hatch} transition-[height] duration-500 ease-out"
					style="--strata: {layer.tone}; height: {thickness(layer.files)}px"
					title="{layer.name} - {layer.files} files"
				></div>
			{/each}
		</div>

		<!-- Legend keyed to layers, same order -->
		<div class="flex flex-col-reverse gap-px pb-px">
			{#each layers as layer (layer.id)}
				<div
					class="stratum {settled ? '' : 'opacity-0'} flex items-center justify-between gap-3 transition-[height] duration-500 ease-out {compact ? 'text-[10px]' : 'text-[11px]'} font-mono leading-none"
					style="height: {thickness(layer.files)}px"
				>
					<span class="whitespace-nowrap text-text-secondary">{layer.name}</span>
					{#if !compact}
						<span class="tabular-nums text-text-muted">{layer.files}</span>
					{/if}
				</div>
			{/each}
		</div>
	</div>

	<div class="mt-2 flex items-baseline justify-between font-mono text-[11px] text-text-muted">
		<span>{layers.length} layers</span>
		<span class="tabular-nums">{total} files</span>
	</div>
</figure>

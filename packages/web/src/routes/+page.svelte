<script lang="ts">
	import { tick, onMount } from 'svelte';
	import { animate, stagger } from 'animejs';
	import { zipSync, strToU8, type Zippable } from 'fflate';
	import Header from '$lib/components/Header.svelte';
	import WizardProgress from '$lib/components/WizardProgress.svelte';
	import NameStep from '$lib/components/NameStep.svelte';
	import StackStep from '$lib/components/StackStep.svelte';
	import ReviewStep from '$lib/components/ReviewStep.svelte';
	import { generator } from '$lib/stores/generator.svelte';

	let currentStep = $state(0);
	let mainEl: HTMLDivElement;
	let transitioning = $state(false);

	$effect(() => {
		generator.syncToUrl();
	});

	onMount(() => {
		animateStepContent();
	});

	function animateStepContent() {
		requestAnimationFrame(() => {
			const cards = document.querySelectorAll('.animate-card');
			if (cards.length) {
				animate(cards, {
					opacity: [0, 1],
					translateY: [16, 0],
					delay: stagger(80, { start: 150 }),
					duration: 400,
					ease: 'outCubic'
				});
			}
			const pills = document.querySelectorAll('.animate-pill');
			if (pills.length) {
				animate(pills, {
					opacity: [0, 1],
					scale: [0.85, 1],
					delay: stagger(40, { start: 500 }),
					duration: 300,
					ease: 'outCubic'
				});
			}
		});
	}

	async function goToStep(next: number) {
		if (next === currentStep || transitioning) return;
		if (next > 0 && !generator.isValidName) return;
		transitioning = true;
		const forward = next > currentStep;
		const dir = forward ? 1 : -1;

		await animate(mainEl, {
			translateX: [0, -30 * dir],
			opacity: [1, 0],
			duration: 200,
			ease: 'inCubic'
		});

		currentStep = next;
		window.scrollTo({ top: 0, behavior: 'instant' });
		await tick();

		await animate(mainEl, {
			translateX: [30 * dir, 0],
			opacity: [0, 1],
			duration: 250,
			ease: 'outCubic'
		});

		animateStepContent();
		transitioning = false;
	}

	let isDownloading = $state(false);

	function download() {
		const project = generator.project;
		if (!project) return;
		isDownloading = true;
		try {
			const files: Zippable = {};
			const rootDir = project.names.kebabCase;
			const executableAttr = 0o755 << 16;
			for (const file of project.files) {
				const data = strToU8(file.content);
				const isExecutable = file.path.endsWith('.sh');
				files[`${rootDir}/${file.path}`] = isExecutable
					? [data, { attrs: executableAttr }]
					: data;
			}
			const zipped = zipSync(files);
			const blob = new Blob([zipped as unknown as Uint8Array<ArrayBuffer>], {
				type: 'application/zip'
			});
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = `${rootDir}.zip`;
			a.click();
			URL.revokeObjectURL(url);
		} finally {
			isDownloading = false;
		}
	}

	function next() {
		if (currentStep < 2) goToStep(currentStep + 1);
	}

	function back() {
		if (currentStep > 0) goToStep(currentStep - 1);
	}
</script>

<svelte:head>
	<title>netrock - .NET API project generator</title>
</svelte:head>

<Header />
<WizardProgress {currentStep} onNavigate={goToStep} canAdvance={generator.isValidName} />
<main class="pb-28 pt-28">
	<div bind:this={mainEl}>
		{#if currentStep === 0}
			<!-- Step 1: Name + Value proposition -->
			<div class="flex flex-col items-center px-4 pb-6 text-center">
				<h1 class="font-mono text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
					<span class="typewriter">
						<span class="text-accent-light">net</span><span class="text-text-primary"
							>rock</span
						>
					</span><span class="cursor-blink text-accent-light">_</span>
				</h1>
				<p class="mt-4 text-base text-text-secondary sm:text-lg">
					Your next <span class="text-text-primary">.NET</span> project starts here.
				</p>
			</div>

			<div class="mt-2">
				<NameStep />
			</div>

			<!-- What you get -->
			<div class="mx-auto mt-10 max-w-2xl px-4">
				<div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
					<div class="animate-card rounded-xl border border-border-subtle bg-surface px-4 py-4">
						<div class="mb-2 font-mono text-sm font-medium text-accent-light">What is this?</div>
						<p class="text-xs leading-relaxed text-text-secondary">
							A .NET project generator. Pick auth, email, jobs, file storage, admin panel,
							and more. Get a complete solution that builds and tests pass.
						</p>
					</div>
					<div class="animate-card rounded-xl border border-border-subtle bg-surface px-4 py-4">
						<div class="mb-2 font-mono text-sm font-medium text-accent-light">Why use this?</div>
						<p class="text-xs leading-relaxed text-text-secondary">
							Skip the weeks of plumbing. JWT auth, background jobs, SMTP, file storage,
							Aspire orchestration - all wired together and tested.
						</p>
					</div>
					<div class="animate-card rounded-xl border border-border-subtle bg-surface px-4 py-4">
						<div class="mb-2 font-mono text-sm font-medium text-accent-light">API-first, frontend ready</div>
						<p class="text-xs leading-relaxed text-text-secondary">
							The .NET API works with any client. Add a SvelteKit frontend
							that adapts to your features - auth pages, admin panel, dashboard, all wired up. Next.js coming soon.
						</p>
					</div>
					<div class="animate-card rounded-xl border border-border-subtle bg-surface px-4 py-4">
						<div class="mb-2 font-mono text-sm font-medium text-accent-light">No strings attached</div>
						<p class="text-xs leading-relaxed text-text-secondary">
							Download a ZIP, it is your code. No framework, no CLI dependency, no lock-in.
							Clean Architecture you can reshape however you need.
						</p>
					</div>
				</div>

				<div class="mt-6 flex flex-wrap items-center justify-center gap-2 font-mono text-[10px] text-text-muted">
					<span class="animate-pill rounded bg-surface-raised px-2 py-1">.NET 10</span>
					<span class="animate-pill text-border-active">+</span>
					<span class="animate-pill rounded bg-surface-raised px-2 py-1">Clean Architecture</span>
					<span class="animate-pill text-border-active">+</span>
					<span class="animate-pill rounded bg-surface-raised px-2 py-1">PostgreSQL</span>
					<span class="animate-pill text-border-active">+</span>
					<span class="animate-pill rounded bg-surface-raised px-2 py-1">Aspire</span>
					<span class="animate-pill text-border-active">+</span>
					<span class="animate-pill rounded bg-surface-raised px-2 py-1">SvelteKit</span>
				</div>

				<p class="mt-6 text-center text-xs text-text-muted">
					100% client-side. Zero tracking. Open source.
					<a href="/why" class="text-text-secondary hover:text-accent">Why netrock?</a>
				</p>
			</div>
		{:else if currentStep === 1}
			<!-- Step 2: Stack -->
			<StackStep />
		{:else}
			<!-- Step 3: Review & Download -->
			<ReviewStep />
		{/if}
	</div>
</main>

<!-- Fixed bottom bar -->
<div
	class="fixed inset-x-0 bottom-0 z-40 border-t border-border-subtle bg-bg/90 px-4 py-3 backdrop-blur-sm"
>
	<div class="mx-auto flex max-w-4xl items-center justify-between">
		<div>
			{#if currentStep > 0}
				<button
					type="button"
					onclick={back}
					disabled={transitioning}
					class="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg px-4 py-2 font-mono text-xs text-text-muted transition-colors hover:text-text-secondary"
				>
					<svg class="size-3.5" viewBox="0 0 16 16" fill="currentColor">
						<path
							fill-rule="evenodd"
							d="M9.78 4.22a.75.75 0 0 1 0 1.06L7.06 8l2.72 2.72a.75.75 0 1 1-1.06 1.06L5.47 8.53a.75.75 0 0 1 0-1.06l3.25-3.25a.75.75 0 0 1 1.06 0Z"
							clip-rule="evenodd"
						/>
					</svg>
					Back
				</button>
			{:else}
				<span></span>
			{/if}
		</div>

		<div class="flex items-center gap-3">
			{#if currentStep === 0}
				<button
					type="button"
					onclick={next}
					disabled={!generator.isValidName || transitioning}
					class="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-accent px-6 py-2.5 font-mono text-sm font-medium text-bg transition-all hover:bg-accent-light disabled:opacity-40"
				>
					Choose your stack
					<svg class="size-3.5" viewBox="0 0 16 16" fill="currentColor">
						<path
							fill-rule="evenodd"
							d="M6.22 4.22a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.75.75 0 0 1-1.06-1.06L8.94 8 6.22 5.28a.75.75 0 0 1 0-1.06Z"
							clip-rule="evenodd"
						/>
					</svg>
				</button>
			{:else if currentStep === 1}
				<span class="hidden font-mono text-xs text-text-muted sm:block">
					{generator.featureCount} features / {generator.fileCount} files
				</span>
				<button
					type="button"
					onclick={next}
					disabled={transitioning}
					class="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-accent px-6 py-2.5 font-mono text-sm font-medium text-bg transition-all hover:bg-accent-light"
				>
					Review & download
					<svg class="size-3.5" viewBox="0 0 16 16" fill="currentColor">
						<path
							fill-rule="evenodd"
							d="M6.22 4.22a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.75.75 0 0 1-1.06-1.06L8.94 8 6.22 5.28a.75.75 0 0 1 0-1.06Z"
							clip-rule="evenodd"
						/>
					</svg>
				</button>
			{:else}
				<span class="hidden font-mono text-xs text-text-muted sm:block">
					{generator.fileCount} files
				</span>
				<button
					type="button"
					onclick={download}
					disabled={isDownloading || transitioning}
					class="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-accent px-6 py-2.5 font-mono text-sm font-medium text-bg transition-all hover:bg-accent-light disabled:opacity-50"
				>
					{#if isDownloading}
						Generating...
					{:else}
						<svg class="size-4" viewBox="0 0 20 20" fill="currentColor">
							<path
								d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z"
							/>
							<path
								d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z"
							/>
						</svg>
						Download .zip
					{/if}
				</button>
			{/if}
		</div>
	</div>
</div>

<style>
	:global(body) {
		overflow-x: hidden;
	}
</style>

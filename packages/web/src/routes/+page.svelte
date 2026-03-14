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
			// Fade-up elements (subtitles, inputs, sections)
			const fadeUps = document.querySelectorAll('.anim-up');
			if (fadeUps.length) {
				animate(fadeUps, {
					opacity: [0, 1],
					translateY: [12, 0],
					delay: stagger(60, { start: 100 }),
					duration: 400,
					ease: 'outCubic'
				});
			}

			// Cards (value props, stats)
			const cards = document.querySelectorAll('.animate-card');
			if (cards.length) {
				animate(cards, {
					opacity: [0, 1],
					translateY: [16, 0],
					delay: stagger(80, { start: 200 }),
					duration: 400,
					ease: 'outCubic'
				});
			}

			// Pills (tech stack, feature tags)
			const pills = document.querySelectorAll('.animate-pill');
			if (pills.length) {
				animate(pills, {
					opacity: [0, 1],
					scale: [0.85, 1],
					delay: stagger(40, { start: 400 }),
					duration: 300,
					ease: 'outCubic'
				});
			}

			// Hero glow
			const glow = document.querySelector('.hero-glow');
			if (glow) {
				animate(glow, {
					opacity: [0, 0.6, 0.4],
					scale: [0.8, 1.1, 1],
					duration: 2000,
					ease: 'outCubic'
				});
				animate(glow, {
					opacity: [0.4, 0.7, 0.4],
					scale: [1, 1.08, 1],
					duration: 4000,
					ease: 'inOutSine',
					loop: true,
					delay: 2000
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
	let downloadDone = $state(false);

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
			for (const file of project.binaryFiles) {
				files[`${rootDir}/${file.path}`] = file.data;
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

			isDownloading = false;
			downloadDone = true;
			requestAnimationFrame(() => {
				const btn = document.querySelector('.dl-btn');
				if (btn) {
					animate(btn, { scale: [1, 1.05, 1], duration: 400, ease: 'outCubic' });
				}
			});
			setTimeout(() => (downloadDone = false), 2500);
		} catch {
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
			<div class="relative flex flex-col items-center px-4 pb-6 text-center">
				<div class="hero-glow absolute -top-16 size-64 rounded-full sm:size-80"></div>
				<h1 class="relative font-mono text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
					<span class="typewriter">
						<span class="text-accent-light">net</span><span class="text-text-primary"
							>rock</span
						>
					</span><span class="cursor-blink text-accent-light">_</span>
				</h1>
				<p class="anim-up mt-4 text-base text-text-secondary sm:text-lg">
					Your next <span class="text-text-primary">.NET</span> project starts here.
				</p>
			</div>

			<div class="anim-up mt-2">
				<NameStep />
			</div>

			<div class="anim-up mx-auto mt-8 max-w-2xl px-4 text-center">
				<div class="flex flex-wrap items-center justify-center gap-2 font-mono text-[10px] text-text-muted">
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

				<p class="anim-up mt-4 text-xs text-text-muted">
					100% client-side. Zero tracking.
					<a href="/why" class="text-text-secondary hover:text-accent">Why netrock?</a>
				</p>

				<!-- FAQ -->
				<div class="anim-up mt-8 space-y-2">
					{#each [
						{ q: 'What do I get?', a: 'A complete .NET 10 solution with Clean Architecture, PostgreSQL, Aspire orchestration, and every feature you pick. Builds and tests pass out of the box.' },
						{ q: 'Can I swap pieces out?', a: 'Yes. Clean Architecture keeps everything behind interfaces. Swap EF Core for Dapper, PostgreSQL for SQL Server, or throw away the frontend and use the API with React. The layers are designed for it.' },
						{ q: 'Is it too much for a small project?', a: 'That is what the generator solves. Pick only what you need - a core API with just PostgreSQL is 88 files. Add auth, jobs, email as your project grows. No unused boilerplate.' },
						{ q: 'Why SvelteKit with .NET?', a: 'SvelteKit acts as a BFF (backend-for-frontend) layer handling SSR and auth cookies, while the .NET API does the heavy lifting. The API is the product - the frontend is a reference client you can keep or replace.' },
						{ q: 'Will there be more frontends?', a: 'Next.js is next on the roadmap. The API is framework-agnostic - use it with any client today.' },
						{ q: 'How much was done with AI?', a: 'Architecture, security decisions, and code reviews are human. Implementation gets heavy AI assistance. Always tested, always reviewed. The repo includes the Claude skills and agent files so you can see the workflow.' },
						{ q: 'Is my data sent anywhere?', a: 'No. Everything runs in your browser. The ZIP is generated client-side. Zero tracking, zero analytics, zero cookies.' }
					] as item}
						<details class="group rounded-lg border border-border-subtle bg-surface">
							<summary
								class="flex min-h-[44px] cursor-pointer items-center justify-between px-4 py-2.5 text-sm font-medium text-text-primary select-none sm:min-h-0"
							>
								{item.q}
								<svg
									class="size-4 shrink-0 text-text-muted transition-transform group-open:rotate-180"
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
							<p class="px-4 pb-3 text-xs leading-relaxed text-text-secondary">
								{item.a}
							</p>
						</details>
					{/each}
				</div>
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
					disabled={isDownloading || downloadDone || transitioning}
					class="dl-btn inline-flex min-h-[44px] items-center gap-2 rounded-lg px-6 py-2.5 font-mono text-sm font-medium transition-all disabled:opacity-90
						{downloadDone
						? 'bg-emerald text-bg'
						: 'bg-accent text-bg hover:bg-accent-light'}"
				>
					{#if isDownloading}
						Generating...
					{:else if downloadDone}
						<svg class="size-4" viewBox="0 0 20 20" fill="currentColor">
							<path
								fill-rule="evenodd"
								d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
								clip-rule="evenodd"
							/>
						</svg>
						Downloaded
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
	.hero-glow {
		background: radial-gradient(circle, rgba(6, 182, 212, 0.12) 0%, transparent 70%);
		pointer-events: none;
		opacity: 0;
	}

	:global(.anim-up),
	:global(.animate-card),
	:global(.animate-pill) {
		opacity: 0;
	}

	:global(body) {
		overflow-x: hidden;
	}
</style>

<script lang="ts">
	import { tick, onMount } from 'svelte';
	import { animate, stagger } from 'animejs';
	import { zipSync, strToU8, type Zippable } from 'fflate';
	import Header from '$lib/components/Header.svelte';
	import WizardProgress from '$lib/components/WizardProgress.svelte';
	import NameStep from '$lib/components/NameStep.svelte';
	import StackStep from '$lib/components/StackStep.svelte';
	import ReviewStep from '$lib/components/ReviewStep.svelte';
	import StrataColumn from '$lib/components/StrataColumn.svelte';
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
<main class="pb-28 pt-32 sm:pt-36">
	<div bind:this={mainEl}>
		{#if currentStep === 0}
			<!-- Sheet 01: name the project -->
			<section class="mx-auto grid max-w-5xl gap-12 px-4 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-20">
				<div>
					<h1 class="display anim-up text-[clamp(2.75rem,8.5vw,5.75rem)] text-text-primary">
						Solid ground for your next <span class="text-accent">.NET</span> project.
					</h1>
					<p class="anim-up mt-6 max-w-md text-base leading-relaxed text-text-secondary sm:text-lg">
						Name it, pick the layers, download a solution that builds and passes its tests.
						Everything runs in your browser.
					</p>

					<div class="anim-up mt-10">
						<NameStep />
					</div>

					<ul class="anim-up mt-8 flex flex-wrap gap-x-5 gap-y-1.5 font-mono text-[11px] text-text-muted">
						{#each ['.NET 10', 'Clean Architecture', 'PostgreSQL', 'Aspire', 'SvelteKit'] as item}
							<li class="flex items-center gap-2">
								<span class="size-1.5 bg-border-active"></span>{item}
							</li>
						{/each}
					</ul>
				</div>

				<aside class="anim-up lg:pt-3">
					<StrataColumn />
					<p class="mt-4 text-[11px] leading-relaxed text-text-muted">
						Every layer is a feature. Thickness is its share of files. You will shape this on the next sheet.
					</p>
				</aside>
			</section>

			<!-- Questions -->
			<section class="mx-auto mt-20 max-w-5xl px-4">
				<div class="anim-up mb-4 flex items-baseline justify-between">
					<h2 class="label">Questions</h2>
					<a href="/faq" class="font-mono text-[11px] text-text-muted transition-colors hover:text-accent">
						More questions
					</a>
				</div>
				<div class="border-t border-border-subtle">
					{#each [
						{ q: 'What do I actually get?', a: 'A .NET 10 solution with Clean Architecture, PostgreSQL, and Aspire orchestration. You pick the features, it wires everything together. Builds and tests pass right away.' },
						{ q: 'Can I swap pieces out later?', a: 'Absolutely. Clean Architecture keeps everything behind interfaces. Swap EF Core for Dapper, Postgres for SQL Server, whatever you need. The layers are built for that.' },
						{ q: 'Isn\'t this too much for a small project?', a: 'That is what the generator solves. A core API is 88 files. Add auth, jobs, or email when you need them. Nothing unused ships.' },
						{ q: 'How is this different from ABP?', a: 'ABP is a framework you depend on at runtime. This is a generator. Download the code and it is yours. No runtime dependency, just clean .NET you can read and change.' },
						{ q: 'Is my data sent anywhere?', a: 'Nope. Everything runs in your browser. No tracking, no analytics, no cookies.' }
					] as item}
						<details class="animate-card group border-b border-border-subtle">
							<summary
								class="flex min-h-[44px] cursor-pointer items-center justify-between gap-4 py-3 text-sm text-text-primary select-none sm:text-[15px]"
							>
								{item.q}
								<span class="font-mono text-text-muted transition-transform group-open:rotate-45" aria-hidden="true">+</span>
							</summary>
							<p class="max-w-2xl pb-4 text-sm leading-relaxed text-text-secondary">
								{item.a}
							</p>
						</details>
					{/each}
				</div>
				<p class="anim-up mt-6 font-mono text-[11px] text-text-muted">
					100% client-side. Zero tracking.
					<a href="/why" class="text-text-secondary underline decoration-border-active underline-offset-4 hover:text-accent">Why netrock?</a>
				</p>
			</section>
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
	class="fixed inset-x-0 bottom-0 z-40 border-t border-border-subtle bg-bg px-4 py-3"
>
	<div class="mx-auto flex max-w-5xl items-center justify-between">
		<div>
			{#if currentStep > 0}
				<button
					type="button"
					onclick={back}
					disabled={transitioning}
					class="inline-flex min-h-[44px] items-center gap-1.5 px-3 py-2 font-mono text-xs text-text-muted transition-colors hover:text-text-secondary"
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
					class="btn-primary"
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
					class="btn-primary"
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
					class="dl-btn btn-primary disabled:opacity-100 {downloadDone ? 'bg-emerald hover:bg-emerald' : ''}"
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
	:global(.anim-up),
	:global(.animate-card),
	:global(.animate-pill) {
		opacity: 0;
	}

	:global(body) {
		overflow-x: hidden;
	}
</style>

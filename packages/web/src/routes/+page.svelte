<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import NameStep from '$lib/components/NameStep.svelte';
	import StackStep from '$lib/components/StackStep.svelte';
	import ReviewStep from '$lib/components/ReviewStep.svelte';

	const plausibleDomain = import.meta.env.VITE_PLAUSIBLE_DOMAIN ?? '';
	const plausibleSrc = import.meta.env.VITE_PLAUSIBLE_SRC || 'https://plausible.io/js/script.js';

	let activeSection = $state('name');

	function handleScroll() {
		const sections = ['review', 'features', 'name'];
		for (const id of sections) {
			const el = document.getElementById(id);
			if (el) {
				const rect = el.getBoundingClientRect();
				if (rect.top <= 200) {
					activeSection = id;
					return;
				}
			}
		}
		activeSection = 'name';
	}
</script>

<svelte:head>
	<title>netrock - Generate production-ready .NET + SvelteKit projects</title>
	{#if plausibleDomain}
		<script defer data-domain={plausibleDomain} src={plausibleSrc}></script>
	{/if}
</svelte:head>

<svelte:window onscroll={handleScroll} />

<Header {activeSection} />

<main class="pb-20 pt-16">
	<!-- Hero -->
	<div id="top" class="flex flex-col items-center px-4 pt-12 pb-16 text-center sm:pt-20 sm:pb-20">
		<h1 class="font-mono text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
			<span class="text-accent-light">net</span><span class="text-text-primary">rock</span>
		</h1>
		<p class="mt-4 max-w-md text-base text-text-secondary sm:text-lg">
			Production-ready .NET + SvelteKit in seconds.
			<br class="hidden sm:block" />
			Pick features, preview, download.
		</p>
		<div class="mt-6 flex items-center gap-2 font-mono text-xs text-text-muted">
			<span class="rounded bg-surface px-2 py-1">.NET 10</span>
			<span class="text-border-active">+</span>
			<span class="rounded bg-surface px-2 py-1">Clean Architecture</span>
			<span class="text-border-active">+</span>
			<span class="rounded bg-surface px-2 py-1">SvelteKit</span>
		</div>
	</div>

	<!-- Sections -->
	<div class="flex flex-col gap-16 sm:gap-20">
		<NameStep />
		<StackStep />
		<ReviewStep />
	</div>
</main>

<footer class="border-t border-border-subtle px-4 py-6 text-center">
	<p class="font-mono text-xs text-text-muted">
		Built by
		<a
			href="https://github.com/fpindej"
			target="_blank"
			rel="noopener noreferrer"
			class="text-text-secondary hover:text-accent"
		>
			fpindej
		</a>
		- 100% client-side, zero tracking, open source
	</p>
</footer>

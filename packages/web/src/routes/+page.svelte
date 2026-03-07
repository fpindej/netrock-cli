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

<footer class="border-t border-border-subtle">
	<!-- Coming soon -->
	<div class="mx-auto max-w-4xl px-4 pt-12 pb-8">
		<h2 class="mb-4 text-center font-mono text-sm font-medium text-text-secondary">
			More frontends coming soon
		</h2>
		<div class="flex flex-wrap justify-center gap-3">
			<span class="rounded-lg border border-border-subtle bg-surface px-4 py-2 font-mono text-xs text-text-muted">
				Angular
			</span>
			<span class="rounded-lg border border-border-subtle bg-surface px-4 py-2 font-mono text-xs text-text-muted">
				Next.js
			</span>
			<span class="rounded-lg border border-border-subtle bg-surface px-4 py-2 font-mono text-xs text-text-muted">
				Nuxt
			</span>
			<span class="rounded-lg border border-border-subtle bg-surface px-4 py-2 font-mono text-xs text-text-muted">
				React SPA
			</span>
		</div>
		<p class="mt-3 text-center text-xs text-text-muted">
			The .NET backend stays the same - just swap the frontend template.
		</p>
	</div>

	<!-- CTA -->
	<div class="mx-auto max-w-4xl px-4 pb-10">
		<div class="flex flex-col items-center gap-4 rounded-xl border border-border-subtle bg-surface px-6 py-8 sm:flex-row sm:justify-between sm:px-8">
			<div class="text-center sm:text-start">
				<p class="text-sm font-medium text-text-primary">Help build netrock</p>
				<p class="mt-1 text-xs text-text-secondary">
					Contribute on GitHub or support development to keep this free and growing.
				</p>
			</div>
			<div class="flex flex-shrink-0 gap-3">
				<a
					href="https://github.com/fpindej/netrock-cli"
					target="_blank"
					rel="noopener noreferrer"
					class="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border-subtle bg-surface-raised px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:border-border-active hover:text-accent-light"
				>
					<svg class="size-4" viewBox="0 0 24 24" fill="currentColor">
						<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
					</svg>
					Contribute
				</a>
				<a
					href="https://buymeacoffee.com/fpindej"
					target="_blank"
					rel="noopener noreferrer"
					class="inline-flex min-h-11 items-center gap-2 rounded-lg bg-amber px-4 py-2 text-sm font-medium text-bg transition-opacity hover:opacity-90"
				>
					<svg class="size-4" viewBox="0 0 24 24" fill="currentColor">
						<path d="M20.216 6.415l-.132-.666c-.119-.598-.388-1.163-1.001-1.379-.197-.069-.42-.098-.57-.241-.152-.143-.196-.366-.231-.572-.065-.378-.125-.756-.192-1.133-.057-.325-.102-.69-.25-.987-.195-.4-.597-.634-.996-.788a5.723 5.723 0 00-.626-.194c-1-.263-2.05-.36-3.077-.416a25.834 25.834 0 00-3.7.062c-.915.083-1.88.184-2.75.5-.318.116-.646.256-.888.501-.297.302-.393.77-.177 1.146.154.267.415.456.692.58.36.162.737.284 1.123.366 1.075.238 2.189.331 3.287.37 1.218.05 2.437.01 3.65-.118.299-.033.598-.073.896-.119.352-.054.578-.513.474-.834-.124-.383-.457-.531-.834-.473-.466.074-.96.108-1.382.146-1.177.08-2.358.082-3.536.006a22.228 22.228 0 01-1.157-.107c-.086-.01-.18-.025-.258-.036-.243-.036-.484-.08-.724-.13-.111-.027-.111-.185 0-.212h.005c.277-.06.557-.108.838-.147h.002c.131-.009.263-.032.394-.048a25.076 25.076 0 013.426-.12c.674.019 1.347.067 2.017.144l.228.031c.267.04.533.088.798.145.392.085.895.113 1.07.542.055.137.08.288.111.431l.319 1.484a.237.237 0 01-.199.284h-.003c-.037.006-.075.01-.112.015a36.704 36.704 0 01-4.743.295 37.059 37.059 0 01-4.699-.304c-.14-.017-.293-.042-.417-.06-.326-.048-.649-.108-.973-.161-.393-.065-.768-.032-1.123.161-.29.16-.502.451-.399.801.064.217.2.391.364.536.214.191.489.324.752.431.581.24 1.202.359 1.815.453.827.127 1.665.192 2.504.229.873.037 1.748.042 2.621.006.875-.037 1.746-.098 2.611-.215.249-.034.498-.073.746-.117.11-.02.218-.05.325-.083a.232.232 0 01.286.166l.325 1.515c.076.359.15.717.232 1.075.066.29-.031.577-.246.777-.219.204-.506.282-.8.319-.614.077-1.233.125-1.854.149a32.834 32.834 0 01-4.265-.099 30.892 30.892 0 01-1.932-.26c-.264-.046-.522-.107-.776-.179-.307-.086-.621-.163-.872-.381a1.028 1.028 0 01-.32-.652c-.026-.27.049-.527.157-.771.088-.2.19-.395.293-.59.1-.19.2-.38.278-.581.062-.164.09-.339.064-.514a.527.527 0 00-.18-.337c-.104-.094-.226-.157-.353-.2a1.69 1.69 0 00-.451-.09c-.246-.008-.496.013-.74.065-.29.064-.575.155-.833.297a1.804 1.804 0 00-.574.487 2.083 2.083 0 00-.29.553c-.063.181-.099.375-.098.567v.01c0 .088.006.176.017.263.014.108.037.214.067.318.088.303.234.586.434.826.284.341.649.58 1.033.756.466.213.965.347 1.467.447.665.132 1.338.217 2.014.272 1.18.098 2.368.105 3.548.035.798-.047 1.593-.127 2.38-.253.364-.058.726-.128 1.084-.213.276-.065.574-.127.768-.35.108-.124.166-.28.197-.44l.73-3.428c.032-.154.081-.304.081-.463 0-.233-.207-.395-.41-.457a4.067 4.067 0 00-.506-.105" />
					</svg>
					Buy me a coffee
				</a>
			</div>
		</div>
	</div>

	<!-- Bottom bar -->
	<div class="border-t border-border-subtle px-4 py-6 text-center">
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
	</div>
</footer>

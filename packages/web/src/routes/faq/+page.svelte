<script lang="ts">
	import Header from '$lib/components/Header.svelte';

	const questions = [
		{ q: 'What do I actually get?', a: 'A .NET 10 solution with Clean Architecture, PostgreSQL, and Aspire orchestration. You pick the features, it wires everything together. Builds and tests pass right away.' },
		{ q: 'Can I swap pieces out later?', a: 'Absolutely. Clean Architecture keeps everything behind interfaces. Swap EF Core for Dapper, Postgres for SQL Server, whatever you need. The layers are built for that.' },
		{ q: 'Isn\'t this too much for a small project?', a: 'That is what the generator solves. A core API is 88 files. Add auth, jobs, or email when you need them. Nothing unused ships.' },
		{ q: 'Why SvelteKit with a .NET backend?', a: 'SvelteKit runs as a BFF (backend-for-frontend) handling SSR and auth cookies. The .NET API does the heavy lifting. Think of the frontend as a reference client. Keep it, swap it, or just use the API standalone.' },
		{ q: 'Will there be more frontend options?', a: 'Next.js is next on the roadmap. The API is completely framework-agnostic though, so you can use it with anything today.' },
		{ q: 'How is this different from ABP?', a: 'ABP is a framework you depend on at runtime. This is a generator. Download the code and it is yours. No runtime dependency, just clean .NET you can read and change.' },
		{ q: 'Is it multi-tenant?', a: 'Not right now, and that is intentional. Multitenancy strategy is too use-case specific to bake into a general template. Choosing the wrong approach upfront is worse than adding it later.' },
		{ q: 'How much was built with AI?', a: 'Architecture, security decisions, and code reviews are mine. Implementation gets heavy AI assistance. Always tested, always reviewed before merge. The repo includes the Claude skills and agents so you can see exactly how it works.' },
		{ q: 'Is my data sent anywhere?', a: 'Nope. Everything runs in your browser. The ZIP is generated client-side. No tracking, no analytics, no cookies.' }
	];
</script>

<svelte:head>
	<title>FAQ - netrock</title>
	<meta name="description" content="Frequently asked questions about netrock, the .NET project generator. Swappability, multitenancy, ABP comparison, AI transparency, and more." />
	<link rel="canonical" href="https://netrock.dev/faq" />
	<meta property="og:title" content="FAQ - netrock" />
	<meta property="og:description" content="Frequently asked questions about the netrock .NET project generator." />
	<meta property="og:url" content="https://netrock.dev/faq" />
</svelte:head>

<Header />

<main class="mx-auto max-w-2xl px-4 pt-24 pb-20 sm:pt-28">
	<h1 class="display text-5xl text-text-primary sm:text-6xl">Questions.</h1>
	<p class="mt-2 text-sm text-text-secondary">
		Questions from the community. Can't find yours?
		<a
			href="https://github.com/fpindej/netrock/discussions"
			target="_blank"
			rel="noopener noreferrer"
			class="text-accent hover:text-accent-light"
		>Open a discussion</a>.
	</p>

	<div class="mt-10 border-t border-border-subtle">
		{#each questions as item}
			<details class="group border-b border-border-subtle">
				<summary
					class="flex min-h-[44px] cursor-pointer items-center justify-between gap-4 py-3 text-sm text-text-primary select-none sm:text-[15px]"
				>
					{item.q}
					<span class="font-mono text-text-muted transition-transform group-open:rotate-45" aria-hidden="true">+</span>
				</summary>
				<p class="pb-4 text-sm leading-relaxed text-text-secondary">
					{item.a}
				</p>
			</details>
		{/each}
	</div>
</main>

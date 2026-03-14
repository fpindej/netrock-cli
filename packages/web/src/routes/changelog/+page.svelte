<script lang="ts">
	import { onMount } from 'svelte';
	import Header from '$lib/components/Header.svelte';
	import changelog from 'virtual:changelog';

	interface Release {
		version: string;
		date: string;
		sections: { title: string; items: string[] }[];
	}

	function parseChangelog(raw: string): Release[] {
		const releases: Release[] = [];
		const blocks = raw.split(/^## /m).slice(1);

		for (const block of blocks) {
			const [heading, ...rest] = block.split('\n');
			const match = heading.match(/\[(.+?)]\s*-\s*(\S+)/);
			if (!match) continue;

			const sections: Release['sections'] = [];
			let current: Release['sections'][0] | null = null;

			for (const line of rest) {
				if (line.startsWith('### ')) {
					current = { title: line.slice(4).trim(), items: [] };
					sections.push(current);
				} else if (line.startsWith('- ') && current) {
					current.items.push(line.slice(2));
				}
			}

			releases.push({ version: match[1], date: match[2], sections });
		}

		return releases;
	}

	const releases = parseChangelog(changelog);
	let activeVersion = $state(releases[0]?.version ?? '');

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						activeVersion = entry.target.id.slice(1);
					}
				}
			},
			{ rootMargin: '-80px 0px -60% 0px' }
		);

		for (const release of releases) {
			const el = document.getElementById(`v${release.version}`);
			if (el) observer.observe(el);
		}

		return () => observer.disconnect();
	});
</script>

<svelte:head>
	<title>Changelog - netrock</title>
	<meta name="description" content="Release history for the netrock .NET project generator. New features, bug fixes, and improvements." />
	<link rel="canonical" href="https://netrock.dev/changelog" />
	<meta property="og:title" content="Changelog - netrock" />
	<meta property="og:description" content="Release history for the netrock .NET project generator. New features, bug fixes, and improvements." />
	<meta property="og:url" content="https://netrock.dev/changelog" />
</svelte:head>

<Header />

<main class="mx-auto max-w-2xl px-4 pt-28 pb-20 sm:pt-32">
	<article class="text-sm leading-relaxed text-text-secondary sm:text-base sm:leading-relaxed">
		<div>
			<h1 class="font-mono text-2xl font-bold text-text-primary sm:text-3xl">Changelog</h1>
			<p class="mt-2 text-text-muted">Notable changes to the netrock generator.</p>
		</div>

		{#if releases.length > 1}
			<nav
				class="sticky top-14 z-40 -mx-4 mt-6 border-b border-border-subtle bg-bg/90 px-4 py-2.5 backdrop-blur-sm"
			>
				<div class="flex gap-2 overflow-x-auto">
					{#each releases as release}
						<a
							href="#v{release.version}"
							class="inline-flex min-h-[36px] items-center rounded-md px-3 py-1.5 font-mono text-xs transition-colors sm:min-h-0 sm:px-2.5 sm:py-1
								{activeVersion === release.version
								? 'bg-accent-dim text-accent-light'
								: 'text-text-muted hover:bg-surface-raised hover:text-text-secondary'}"
						>
							{release.version}
						</a>
					{/each}
				</div>
			</nav>
		{/if}

		<div class="mt-8 space-y-8">
			{#each releases as release}
				<section id="v{release.version}" class="scroll-mt-28 space-y-4">
					<div class="flex items-baseline gap-3">
						<h2 class="font-mono text-lg font-bold text-text-primary">
							{release.version}
						</h2>
						<span class="font-mono text-xs text-text-muted">{release.date}</span>
					</div>

					{#each release.sections as section}
						<div>
							<h3 class="mb-2 font-mono text-sm font-semibold text-accent">
								{section.title}
							</h3>
							<ul class="space-y-1">
								{#each section.items as item}
									<li class="flex gap-2">
										<span
											class="mt-2 size-1 flex-shrink-0 rounded-full bg-border-active"
										></span>
										<span>{item}</span>
									</li>
								{/each}
							</ul>
						</div>
					{/each}
				</section>
			{/each}
		</div>

		<div class="pt-8">
			<a
				href="/"
				class="inline-flex min-h-11 items-center rounded-lg bg-accent px-5 py-2 text-sm font-medium text-bg transition-opacity hover:opacity-90"
			>
				Back to generator
			</a>
		</div>
	</article>
</main>

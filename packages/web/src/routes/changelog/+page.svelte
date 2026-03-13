<script lang="ts">
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
</script>

<svelte:head>
	<title>Changelog - netrock</title>
</svelte:head>

<Header />

<main class="mx-auto max-w-2xl px-4 pt-28 pb-20 sm:pt-32">
	<article class="space-y-8 text-sm leading-relaxed text-text-secondary sm:text-base sm:leading-relaxed">
		<div>
			<h1 class="font-mono text-2xl font-bold text-text-primary sm:text-3xl">Changelog</h1>
			<p class="mt-2 text-text-muted">Notable changes to the netrock generator.</p>
		</div>

		{#each releases as release}
			<section class="space-y-4">
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
									<span class="mt-2 size-1 flex-shrink-0 rounded-full bg-border-active"></span>
									<span>{item}</span>
								</li>
							{/each}
						</ul>
					</div>
				{/each}
			</section>
		{/each}

		<div class="pt-4">
			<a
				href="/"
				class="inline-flex min-h-11 items-center rounded-lg bg-accent px-5 py-2 text-sm font-medium text-bg transition-opacity hover:opacity-90"
			>
				Back to generator
			</a>
		</div>
	</article>
</main>

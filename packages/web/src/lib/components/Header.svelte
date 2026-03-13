<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';

	interface Props {
		activeSection?: string;
	}

	let { activeSection }: Props = $props();

	const steps = [
		{ id: 'name', label: '1. Name' },
		{ id: 'features', label: '2. Features' },
		{ id: 'review', label: '3. Download' }
	];

	let isHome = $derived(page.url.pathname === '/');
	let stars = $state<number | null>(null);

	onMount(async () => {
		try {
			const res = await fetch('https://api.github.com/repos/fpindej/netrock');
			if (res.ok) {
				const data = await res.json();
				stars = data.stargazers_count;
			}
		} catch {
			// silently ignore - star count is cosmetic
		}
	});
</script>

<header
	class="fixed top-0 z-50 flex w-full items-center justify-between border-b border-border-subtle bg-bg/80 px-4 py-3 backdrop-blur-xl sm:px-6"
>
	<div class="flex items-center gap-2">
		<a
			href="/"
			class="font-mono text-lg font-bold tracking-tight text-accent-light"
		>
			netrock
		</a>
		<a
			href="/changelog"
			class="relative rounded bg-accent-dim px-1.5 py-0.5 text-[10px] font-medium text-accent transition-colors hover:bg-accent/20 after:absolute after:-inset-4 after:content-['']"
			>v{__APP_VERSION__}</a
		>
	</div>

	<nav class="flex items-center gap-1">
		{#each steps as step}
			<a
				href="{isHome ? '' : '/'}#{step.id}"
				class="hidden rounded-md px-3 py-1.5 font-mono text-xs transition-colors sm:block
					{isHome && activeSection === step.id
					? 'bg-accent-dim text-accent-light'
					: 'text-text-muted hover:text-text-secondary'}"
			>
				{step.label}
			</a>
		{/each}
		<a
			href="/why"
			class="inline-flex min-h-[44px] items-center rounded-md px-3 py-1.5 font-mono text-xs transition-colors sm:min-h-0
				{!isHome
				? 'bg-accent-dim text-accent-light'
				: 'text-text-muted hover:text-text-secondary'}"
		>
			Why?
		</a>
	</nav>

	<a
		href="https://github.com/fpindej/netrock"
		target="_blank"
		rel="noopener noreferrer"
		class="inline-flex min-h-[44px] items-center gap-1.5 rounded-md px-3 py-1.5 text-xs text-text-muted transition-colors hover:text-text-secondary sm:min-h-0"
	>
		<svg class="size-4" viewBox="0 0 24 24" fill="currentColor">
			<path
				d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
			/>
		</svg>
		{#if stars !== null}
			<span class="hidden font-mono sm:inline">{stars}</span>
			<svg class="hidden size-3 sm:block" viewBox="0 0 16 16" fill="currentColor">
				<path
					d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"
				/>
			</svg>
		{:else}
			<span class="hidden sm:inline">GitHub</span>
		{/if}
	</a>
</header>

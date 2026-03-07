<script lang="ts">
	import { generator } from '$lib/stores/generator.svelte';
	import { zipSync, strToU8, type Zippable } from 'fflate';
	import FileTree from './FileTree.svelte';

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
				files[`${rootDir}/${file.path}`] = isExecutable ? [data, { attrs: executableAttr }] : data;
			}

			const zipped = zipSync(files);
			const blob = new Blob([zipped as unknown as Uint8Array<ArrayBuffer>], { type: 'application/zip' });
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = `${rootDir}.zip`;
			a.click();
			URL.revokeObjectURL(url);
		// Track download event for analytics (Plausible)
			if (typeof window !== 'undefined' && 'plausible' in window) {
				(window as Record<string, Function>).plausible('Download', {
					props: {
						features: project.summary.enabledFeatures.join(','),
						featureCount: project.summary.enabledFeatures.length,
						fileCount: project.summary.totalFiles
					}
				});
			}
		} finally {
			isDownloading = false;
		}
	}
</script>

<section id="review" class="mx-auto w-full max-w-4xl px-4">
	<div class="mb-3 font-mono text-xs tracking-widest text-text-muted uppercase">
		03 / Review &amp; download
	</div>

	{#if !generator.isValidName}
		<div class="rounded-xl border border-border-subtle bg-surface px-6 py-12 text-center">
			<p class="text-text-secondary">Enter a valid project name to see the preview.</p>
		</div>
	{:else if generator.project}
		<!-- Stats -->
		<div class="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
			<div class="rounded-xl border border-border-subtle bg-surface px-4 py-3 text-center">
				<div class="font-mono text-2xl font-bold text-accent-light">
					{generator.featureCount}
				</div>
				<div class="mt-0.5 text-xs text-text-muted">features</div>
			</div>
			<div class="rounded-xl border border-border-subtle bg-surface px-4 py-3 text-center">
				<div class="font-mono text-2xl font-bold text-text-primary">
					{generator.fileCount}
				</div>
				<div class="mt-0.5 text-xs text-text-muted">files</div>
			</div>
			<div class="rounded-xl border border-border-subtle bg-surface px-4 py-3 text-center">
				<div class="font-mono text-2xl font-bold text-text-primary">
					.NET 10
				</div>
				<div class="mt-0.5 text-xs text-text-muted">backend</div>
			</div>
			<div class="rounded-xl border border-border-subtle bg-surface px-4 py-3 text-center">
				<div class="font-mono text-2xl font-bold text-text-primary">
					{generator.resolvedFeatures.has('frontend') ? 'Svelte 5' : 'API'}
				</div>
				<div class="mt-0.5 text-xs text-text-muted">
					{generator.resolvedFeatures.has('frontend') ? 'frontend' : 'only'}
				</div>
			</div>
		</div>

		<!-- Enabled features summary -->
		<div class="mb-6 flex flex-wrap gap-1.5">
			{#each generator.project.summary.enabledFeatures as featureId}
				{@const def = generator.definitions.find((d) => d.id === featureId)}
				<span
					class="rounded-full border border-accent/20 bg-accent-dim px-2.5 py-1 font-mono text-xs text-accent-light"
				>
					{def?.name ?? featureId}
				</span>
			{/each}
		</div>

		<!-- File tree -->
		<FileTree paths={generator.filePaths} />

		<!-- Download button -->
		<div class="mt-8 flex flex-col items-center gap-3">
			<button
				type="button"
				onclick={download}
				disabled={isDownloading}
				class="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-accent px-8 py-3 font-mono text-sm font-medium text-bg transition-all hover:bg-accent-light disabled:opacity-50 sm:w-auto"
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
			<p class="text-xs text-text-muted">
				Everything runs in your browser. No data is sent to any server.
			</p>
		</div>

		<!-- Quick nav back -->
		<div class="mt-6 flex justify-center gap-4">
			<a href="#name" class="font-mono text-xs text-text-muted transition-colors hover:text-accent">
				Change name
			</a>
			<a href="#features" class="font-mono text-xs text-text-muted transition-colors hover:text-accent">
				Change features
			</a>
		</div>
	{/if}
</section>

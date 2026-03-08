<script lang="ts">
	import { generator } from '$lib/stores/generator.svelte';
	import { zipSync, strToU8, type Zippable } from 'fflate';
	import FileTree from './FileTree.svelte';

	let isDownloading = $state(false);
	let copiedCmd = $state<string | null>(null);

	const setupCmds = [
		{ id: 'sh', label: 'macOS / Linux', text: 'chmod +x setup.sh && ./setup.sh' },
		{
			id: 'ps',
			label: 'Windows (PowerShell)',
			text: 'Set-ExecutionPolicy -Scope Process Bypass; .\\setup.ps1'
		}
	];

	async function copyCommand(text: string, id: string) {
		await navigator.clipboard.writeText(text);
		copiedCmd = id;
		setTimeout(() => (copiedCmd = null), 2000);
	}

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

		<!-- Before You Ship -->
		<details class="group mt-8 rounded-xl border border-amber/30 bg-amber-dim">
			<summary
				class="flex cursor-pointer items-center gap-2 px-5 py-3.5 font-mono text-sm font-medium text-amber select-none"
			>
				<svg
					class="size-4 shrink-0 transition-transform group-open:rotate-90"
					viewBox="0 0 20 20"
					fill="currentColor"
				>
					<path
						fill-rule="evenodd"
						d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
						clip-rule="evenodd"
					/>
				</svg>
				Before you ship - what you'll configure
			</summary>
			<div class="border-t border-amber/15 px-5 py-4 text-sm leading-relaxed text-text-secondary">
				<p class="mb-3 text-xs text-text-muted">
					Local dev works out of the box{generator.resolvedFeatures.has('aspire')
						? ' (Aspire manages Postgres, MailPit, MinIO automatically)'
						: ''}. These items need your input for production.
				</p>
				<ul class="space-y-1.5">
					<li>
						<span class="font-mono text-xs text-amber">DB</span> - Point
						<code class="text-xs">ConnectionStrings__Database</code> to your production PostgreSQL
					</li>
					<li>
						<span class="font-mono text-xs text-amber">CORS</span> - Set
						<code class="text-xs">Cors__AllowedOrigins__0</code> to your domain (app crashes on
						purpose if left open)
					</li>
					{#if generator.resolvedFeatures.has('auth')}
						<li>
							<span class="font-mono text-xs text-amber">JWT</span> - Replace the dev JWT key with
							a production secret (64+ chars, cryptographically random)
						</li>
						<li>
							<span class="font-mono text-xs text-amber">Email</span> - Configure a real SMTP
							provider{generator.resolvedFeatures.has('aspire')
								? ' (MailPit handles local dev)'
								: ''}
						</li>
						<li>
							<span class="font-mono text-xs text-amber">Admin</span> - Set
							<code class="text-xs">Seed__Users__0__*</code> env vars for bootstrap Superuser
						</li>
					{/if}
					{#if generator.resolvedFeatures.has('captcha')}
						<li>
							<span class="font-mono text-xs text-amber">CAPTCHA</span> - Replace Turnstile dev
							keys with production keys
						</li>
					{/if}
					{#if generator.resolvedFeatures.has('oauth')}
						<li>
							<span class="font-mono text-xs text-amber">OAuth</span> - Set encryption key +
							configure providers from admin UI
						</li>
					{/if}
					{#if generator.resolvedFeatures.has('file-storage')}
						<li>
							<span class="font-mono text-xs text-amber">Storage</span> - Configure
							<code class="text-xs">FileStorage__*</code> for your S3
							provider{generator.resolvedFeatures.has('aspire')
								? ' (MinIO handles local dev)'
								: ''}
						</li>
					{/if}
					<li>
						<span class="font-mono text-xs text-amber">TLS</span> - Put a reverse proxy in front
						for HTTPS termination
					</li>
				</ul>
				<p class="mt-3 text-xs text-text-muted">
					Full checklist in <code class="text-xs">docs/before-you-ship.md</code> in the generated
					project.
				</p>
			</div>
		</details>

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

		<!-- Setup instructions -->
		<div class="mt-6 rounded-xl border border-accent/20 bg-surface px-5 py-4">
			<div class="mb-3 flex items-center gap-2">
				<svg class="size-4 text-accent" viewBox="0 0 20 20" fill="currentColor">
					<path
						fill-rule="evenodd"
						d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
						clip-rule="evenodd"
					/>
				</svg>
				<span class="font-mono text-xs font-medium text-text-primary">
					After downloading, run the setup script
				</span>
			</div>
			<div class="space-y-2.5">
				{#each setupCmds as cmd}
					<div>
						<p class="mb-1 font-mono text-[10px] uppercase tracking-wider text-text-muted">
							{cmd.label}
						</p>
						<div class="relative">
							<code
								class="block rounded-lg bg-bg pe-10 ps-3 py-2 font-mono text-xs leading-relaxed text-text-secondary"
							>
								{cmd.text}
							</code>
							<button
								type="button"
								onclick={() => copyCommand(cmd.text, cmd.id)}
								class="absolute end-1.5 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-text-muted transition-colors hover:bg-surface hover:text-text-primary"
								title="Copy to clipboard"
							>
								{#if copiedCmd === cmd.id}
									<svg
										class="size-3.5 text-green-400"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path
											fill-rule="evenodd"
											d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
											clip-rule="evenodd"
										/>
									</svg>
								{:else}
									<svg class="size-3.5" viewBox="0 0 20 20" fill="currentColor">
										<path
											d="M7 3.5A1.5 1.5 0 018.5 2h3.879a1.5 1.5 0 011.06.44l3.122 3.12A1.5 1.5 0 0117 6.622V12.5a1.5 1.5 0 01-1.5 1.5h-1v-3.379a3 3 0 00-.879-2.121L10.5 5.379A3 3 0 008.379 4.5H7v-1z"
										/>
										<path
											d="M4.5 6A1.5 1.5 0 003 7.5v9A1.5 1.5 0 004.5 18h7a1.5 1.5 0 001.5-1.5v-5.879a1.5 1.5 0 00-.44-1.06L9.44 6.439A1.5 1.5 0 008.378 6H4.5z"
										/>
									</svg>
								{/if}
							</button>
						</div>
					</div>
				{/each}
			</div>
			<p class="mt-3 text-xs leading-relaxed text-text-muted">
				The setup script checks prerequisites, configures ports, creates the initial database
				migration, initializes git, and verifies the build.
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

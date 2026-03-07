<script lang="ts">
	import Header from '$lib/components/Header.svelte';
</script>

<svelte:head>
	<title>Why netrock?</title>
</svelte:head>

<Header />

<main class="mx-auto max-w-2xl px-4 pt-28 pb-20 sm:pt-32">
	<article class="space-y-6 text-sm leading-relaxed text-text-secondary sm:text-base sm:leading-relaxed">
		<h1 class="font-mono text-2xl font-bold text-text-primary sm:text-3xl">Why netrock?</h1>

		<p>
			If you work in JavaScript, you have <code class="font-mono text-xs text-accent">create-next-app</code>,
			<code class="font-mono text-xs text-accent">create-svelte</code>,
			<code class="font-mono text-xs text-accent">create-t3-app</code>, and dozens more.
			Go has its own generators. Rails has been doing this for twenty years.
		</p>

		<p>
			In .NET? I never found anything like it. You either start from
			<code class="font-mono text-xs text-accent">dotnet new webapi</code> and spend
			days wiring up authentication, EF Core, background jobs, email, and all the plumbing
			that every real project needs - or you copy-paste from your last project and hope you
			renamed everything.
		</p>

		<p>
			That's why I built netrock. It started as my own template -
			a <a href="https://github.com/fpindej/netrock" class="text-accent hover:text-accent-light">production .NET + SvelteKit repository</a>
			that I kept reusing across projects. Every time I started something new, I'd clone it, rename
			things, delete the features I didn't need, and fix all the broken references. It worked, but it
			was tedious and error-prone.
		</p>

		<p>
			So I turned it into a generator. Pick the features you want, give your project a name, and get a
			complete repository - builds, tests pass, ready to deploy. No magic, no lock-in, no hidden runtime.
			Just your code.
		</p>

		<h2 class="pt-4 font-mono text-lg font-bold text-text-primary">Opinionated on purpose</h2>

		<p>
			Netrock is opinionated. Clean Architecture. Result pattern for error handling. ProblemDetails for
			API errors. PostgreSQL. Serilog. xUnit. These are choices I've made after running .NET in production
			and I think they work well together.
		</p>

		<p>
			You might disagree with some of them - and that's fine. The whole point is that
			<strong class="text-text-primary">you own the code</strong>. There's no framework to
			depend on, no CLI you need to keep running, no package that has to stay up to date. You download
			the project, and it's yours. Change the architecture, swap the ORM, rewrite the auth - whatever
			makes sense for your team.
		</p>

		<p>
			It's similar to how companies spin out their own internal templates and starter kits, except this
			one is free and open source for anyone to use.
		</p>

		<h2 class="pt-4 font-mono text-lg font-bold text-text-primary">Built with Claude</h2>

		<p>
			Full transparency: this generator was built 99% with
			<a href="https://claude.ai" class="text-accent hover:text-accent-light" target="_blank" rel="noopener noreferrer">Claude</a>.
			The original netrock repository is human-written - hundreds of hours of .NET and SvelteKit code
			refined over real projects. The generator that extracts and reassembles it is where Claude came in.
			The template engine, dependency resolver, feature manifests, web UI, and the
			page you're reading right now.
		</p>

		<p>
			I think that's worth mentioning. Not as a gimmick, but because it's honest. AI is
			good at this kind of work - taking a well-defined codebase and building tooling around it.
			The source material matters, and the source material here is production code
			that I've been shipping for a while.
		</p>

		<h2 class="pt-4 font-mono text-lg font-bold text-text-primary">Alpha, but real</h2>

		<p>
			This is early. The backend generator works well - 11 features, 9 tested combinations,
			over 1,000 tests passing on the full stack. The SvelteKit frontend templates are coming
			next. There will be rough edges.
		</p>

		<p>
			If you find something broken, open an issue. If you want to help,
			PRs are welcome at both repos. If you just want to say hi, there's a
			<a href="https://discord.gg/5rHquRptSh" class="text-accent hover:text-accent-light" target="_blank" rel="noopener noreferrer">Discord</a>
			too.
		</p>

		<div class="flex flex-wrap gap-3 pt-4">
			<a
				href="/"
				class="inline-flex min-h-11 items-center rounded-lg bg-accent px-5 py-2 text-sm font-medium text-bg transition-opacity hover:opacity-90"
			>
				Try the generator
			</a>
			<a
				href="https://github.com/fpindej/netrock"
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border-subtle bg-surface-raised px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:border-border-active hover:text-accent-light"
			>
				<svg class="size-4" viewBox="0 0 24 24" fill="currentColor">
					<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
				</svg>
				netrock
			</a>
			<a
				href="https://github.com/fpindej/netrock-cli"
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border-subtle bg-surface-raised px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:border-border-active hover:text-accent-light"
			>
				<svg class="size-4" viewBox="0 0 24 24" fill="currentColor">
					<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
				</svg>
				netrock-cli
			</a>
			<a
				href="https://discord.gg/5rHquRptSh"
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border-subtle bg-surface-raised px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:border-border-active hover:text-accent-light"
			>
				<svg class="size-4" viewBox="0 0 24 24" fill="currentColor">
					<path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.947 2.418-2.157 2.418z" />
				</svg>
				Discord
			</a>
		</div>

		<p class="pt-2 text-xs text-text-muted">
			- Filip
		</p>
	</article>
</main>

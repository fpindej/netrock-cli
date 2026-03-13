<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar';
	import { AppSidebar, Header, ContentHeader, CommandPalette } from '$lib/components/layout';
	// @feature auth
	import { EmailVerificationBanner } from '$lib/components/auth';
	// @end
	import { page } from '$app/state';
	import { invalidateAll } from '$app/navigation';
	import { healthState } from '$lib/state';

	let { children, data } = $props();

	// When health polling detects the backend went down, re-run server loads.
	// The (app) layout.server.ts will throw 503, showing the error page with
	// auto-recovery. Only trigger on a confirmed online->offline transition.
	let wasOnline = false;
	$effect(() => {
		if (healthState.checked && wasOnline && !healthState.online) {
			invalidateAll();
		}
		if (healthState.checked) wasOnline = healthState.online;
	});
</script>

<!-- @feature auth -->
<CommandPalette user={data.user} />
<!-- @end -->
<!-- @feature !auth -->
<CommandPalette />
<!-- @end -->

<Sidebar.Provider open={data.sidebarOpen} class="h-dvh overflow-hidden">
	<!-- @feature auth -->
	<AppSidebar user={data.user} />
	<!-- @end -->
	<!-- @feature !auth -->
	<AppSidebar />
	<!-- @end -->
	<Sidebar.Inset>
		<!-- @feature auth -->
		<Header user={data.user} />
		<!-- @end -->
		<!-- @feature !auth -->
		<Header />
		<!-- @end -->
		<ContentHeader />
		<!-- @feature auth -->
		{#if data.user && !data.user.emailConfirmed}
			<EmailVerificationBanner />
		{/if}
		<!-- @end -->
		<div
			class="flex flex-1 flex-col gap-4 overflow-y-auto overscroll-contain p-4 pb-[max(4rem,calc(env(safe-area-inset-bottom,0px)+2rem))] lg:gap-6 lg:p-6 lg:pb-[max(4rem,calc(env(safe-area-inset-bottom,0px)+2rem))]"
		>
			{#key page.url.pathname}
				<div
					class="mx-auto w-full max-w-7xl motion-safe:duration-300 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4"
				>
					{@render children()}
				</div>
			{/key}
		</div>
	</Sidebar.Inset>
</Sidebar.Provider>

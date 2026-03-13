<script lang="ts">
	import '../styles/index.css';
	import 'flag-icons/css/flag-icons.min.css';
	import { onMount } from 'svelte';
	import { initTheme } from '$lib/state/theme.svelte';
	import * as m from '$lib/paraglide/messages';
	import { Toaster } from '$lib/components/ui/sonner';
	// @feature auth
	import { toast } from '$lib/components/ui/sonner';
	// @end
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { globalShortcuts } from '$lib/state/shortcuts.svelte';
	// @feature auth
	import { goto, invalidateAll } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { routes } from '$lib/config';
	import { logout, createAuthMiddleware } from '$lib/auth';
	import { initBrowserAuth } from '$lib/api';
	// @end
	import { initBackendMonitor } from '$lib/api/backend-monitor';
	import { ShortcutsHelp } from '$lib/components/layout';
	import { initHealthCheck } from '$lib/state';

	let { children } = $props();

	onMount(() => {
		initBackendMonitor();
		// @feature auth
		initBrowserAuth(
			createAuthMiddleware(fetch, '', async () => {
				toast.error(m.auth_sessionExpired_title(), {
					description: m.auth_sessionExpired_description()
				});
				await invalidateAll();
				await goto(resolve(routes.login));
			})
		);
		// @end
		const cleanupTheme = initTheme();
		const cleanupHealth = initHealthCheck();
		return () => {
			cleanupTheme?.();
			cleanupHealth?.();
		};
	});

	// @feature auth
	async function handleSettings() {
		await goto(resolve(routes.settings));
	}
	// @end
</script>

<svelte:window
	use:globalShortcuts={{
		// @feature auth
		settings: handleSettings,
		logout: logout
		// @end
	}}
/>

<ShortcutsHelp />

<svelte:head>
	<title>{m.app_name()}</title>
	<meta name="description" content={m.meta_description()} />
</svelte:head>

<Tooltip.Provider>
	<Toaster />
	{@render children()}
</Tooltip.Provider>

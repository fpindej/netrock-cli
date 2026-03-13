<script lang="ts">
	import { PageHeader } from '$lib/components/common';
	// @feature auth
	import {
		WelcomeGuide,
		AccountStatus,
		QuickActions
	} from '$lib/components/dashboard';
	// @end
	import { DeveloperGuide } from '$lib/components/dashboard';
	import * as m from '$lib/paraglide/messages';
	// @feature auth
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let user = $derived(data.user);
	let greeting = $derived(
		user?.firstName ? m.dashboard_welcome({ name: user.firstName }) : m.dashboard_welcomeGeneric()
	);
	// @end
</script>

<svelte:head>
	<title>{m.meta_titleTemplate({ title: m.meta_dashboard_title() })}</title>
	<meta name="description" content={m.meta_dashboard_description()} />
</svelte:head>

<div class="space-y-6">
	<!-- @feature auth -->
	<PageHeader title={greeting} description={m.dashboard_subtitle()} />
	<!-- @end -->
	<!-- @feature !auth -->
	<PageHeader title={m.meta_dashboard_title()} description={m.meta_dashboard_description()} />
	<!-- @end -->

	<div class="space-y-8">
		<!-- @feature auth -->
		<WelcomeGuide {user} />
		<!-- @end -->
		<DeveloperGuide />

		<!-- @feature auth -->
		<QuickActions {user} />
		<AccountStatus {user} />
		<!-- @end -->
	</div>
</div>

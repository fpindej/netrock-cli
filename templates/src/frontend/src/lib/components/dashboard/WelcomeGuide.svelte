<!-- @feature auth -->
<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Sparkles, UserPen, Shield } from '@lucide/svelte';
	// @feature admin
	import { ShieldCheck } from '@lucide/svelte';
	import { adminRoutes } from '$lib/config';
	import { hasAnyPermission } from '$lib/utils';
	// @end
	import * as m from '$lib/paraglide/messages';
	import type { User } from '$lib/types';

	interface Props {
		user: User | null | undefined;
	}

	let { user }: Props = $props();

	// @feature admin
	let hasAdminAccess = $derived(
		hasAnyPermission(
			user,
			Object.values(adminRoutes).map((r) => r.permission)
		)
	);
	// @end
</script>

<Card.Root class="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
	<Card.Header>
		<Card.Title class="flex items-center gap-2">
			<Sparkles class="size-5 text-primary" />
			{m.dashboard_guide_title()}
		</Card.Title>
		<Card.Description>
			{m.dashboard_guide_description()}
		</Card.Description>
	</Card.Header>
	<Card.Content>
		<!-- @feature admin -->
		<div class="grid gap-4 text-sm sm:grid-cols-2" class:lg:grid-cols-3={hasAdminAccess}>
		<!-- @end -->
		<!-- @feature !admin -->
		<div class="grid gap-4 text-sm sm:grid-cols-2">
		<!-- @end -->
			<div class="flex items-start gap-3">
				<UserPen class="mt-0.5 size-4 shrink-0 text-primary" />
				<span class="text-muted-foreground">{m.dashboard_guide_profile()}</span>
			</div>
			<div class="flex items-start gap-3">
				<Shield class="mt-0.5 size-4 shrink-0 text-primary" />
				<span class="text-muted-foreground">{m.dashboard_guide_security()}</span>
			</div>
			<!-- @feature admin -->
			{#if hasAdminAccess}
				<div class="flex items-start gap-3">
					<ShieldCheck class="mt-0.5 size-4 shrink-0 text-primary" />
					<span class="text-muted-foreground">{m.dashboard_guide_admin()}</span>
				</div>
			{/if}
			<!-- @end -->
		</div>
	</Card.Content>
</Card.Root>
<!-- @end -->

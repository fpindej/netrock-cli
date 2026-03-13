<script lang="ts">
	import * as Command from '$lib/components/ui/command';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { routes } from '$lib/config';
	// @feature admin
	import { adminRoutes, type AdminRoute } from '$lib/config';
	import { hasPermission } from '$lib/utils';
	// @end
	import { shortcutsState, ShortcutAction, getShortcutSymbol } from '$lib/state/shortcuts.svelte';
	import { toggleTheme } from '$lib/state/theme.svelte';
	// @feature auth
	import { logout } from '$lib/auth';
	// @end
	import * as m from '$lib/paraglide/messages';
	import {
		LayoutDashboard,
		// @feature auth
		User,
		Settings,
		// @end
		// @feature admin
		Users,
		Shield,
		// @feature jobs
		Clock,
		// @end
		// @feature oauth
		KeyRound,
		// @end
		// @end
		Sun,
		// @feature auth
		LogOut
		// @end
	} from '@lucide/svelte';
	import type { Component } from 'svelte';
	import type { IconProps } from '@lucide/svelte';
	// @feature auth
	import type { User as UserType } from '$lib/types';
	// @end

	interface Props {
		// @feature auth
		user: UserType | null | undefined;
		// @end
	}

	// @feature auth
	let { user }: Props = $props();
	// @end
	// @feature !auth
	let {}: Props = $props();
	// @end

	type CommandItem = {
		label: () => string;
		icon: Component<IconProps>;
		action: () => void;
		shortcut?: string;
	};

	// @feature admin
	type AdminCommandItem = CommandItem & { permission: AdminRoute['permission'] };
	// @end

	function close() {
		shortcutsState.isCommandPaletteOpen = false;
	}

	const navItems: CommandItem[] = [
		{
			label: m.nav_dashboard,
			icon: LayoutDashboard,
			action: () => {
				close();
				goto(resolve(routes.dashboard));
			}
		},
		// @feature auth
		{
			label: m.profile_title,
			icon: User,
			action: () => {
				close();
				goto(resolve(routes.profile));
			}
		},
		{
			label: m.nav_settings,
			icon: Settings,
			action: () => {
				close();
				goto(resolve(routes.settings));
			},
			shortcut: getShortcutSymbol(ShortcutAction.Settings)
		}
		// @end
	];

	// @feature admin
	const adminItems: AdminCommandItem[] = [
		{
			label: m.nav_adminUsers,
			icon: Users,
			action: () => {
				close();
				goto(resolve(adminRoutes.users.path));
			},
			permission: adminRoutes.users.permission
		},
		{
			label: m.nav_adminRoles,
			icon: Shield,
			action: () => {
				close();
				goto(resolve(adminRoutes.roles.path));
			},
			permission: adminRoutes.roles.permission
		},
		// @feature jobs
		{
			label: m.nav_adminJobs,
			icon: Clock,
			action: () => {
				close();
				goto(resolve(adminRoutes.jobs.path));
			},
			permission: adminRoutes.jobs.permission
		},
		// @end
		// @feature oauth
		{
			label: m.nav_adminOAuthProviders,
			icon: KeyRound,
			action: () => {
				close();
				goto(resolve(adminRoutes.oauthProviders.path));
			},
			permission: adminRoutes.oauthProviders.permission
		},
		// @end
	];
	// @end

	const actionItems: CommandItem[] = [
		{
			label: m.commandPalette_toggleTheme,
			icon: Sun,
			action: () => {
				toggleTheme();
				close();
			}
		},
		// @feature auth
		{
			label: m.nav_logout,
			icon: LogOut,
			action: () => {
				close();
				logout();
			},
			shortcut: getShortcutSymbol(ShortcutAction.Logout)
		}
		// @end
	];

	// @feature admin
	let visibleAdminItems = $derived(
		adminItems.filter((item) => hasPermission(user, item.permission))
	);
	// @end
</script>

<Command.Dialog
	bind:open={shortcutsState.isCommandPaletteOpen}
	title={m.shortcuts_commandPalette()}
	description={m.commandPalette_placeholder()}
>
	<Command.Input placeholder={m.commandPalette_placeholder()} />
	<Command.List>
		<Command.Empty>{m.commandPalette_noResults()}</Command.Empty>

		<Command.Group heading={m.commandPalette_navigation()}>
			{#each navItems as item (item.label())}
				<Command.Item onSelect={item.action}>
					<item.icon />
					<span>{item.label()}</span>
					{#if item.shortcut}
						<Command.Shortcut>{item.shortcut}</Command.Shortcut>
					{/if}
				</Command.Item>
			{/each}
		</Command.Group>

		<!-- @feature admin -->
		{#if visibleAdminItems.length > 0}
			<Command.Group heading={m.commandPalette_admin()}>
				{#each visibleAdminItems as item (item.label())}
					<Command.Item onSelect={item.action}>
						<item.icon />
						<span>{item.label()}</span>
					</Command.Item>
				{/each}
			</Command.Group>
		{/if}
		<!-- @end -->

		<Command.Separator />

		<Command.Group heading={m.commandPalette_actions()}>
			{#each actionItems as item (item.label())}
				<Command.Item onSelect={item.action}>
					<item.icon />
					<span>{item.label()}</span>
					{#if item.shortcut}
						<Command.Shortcut>{item.shortcut}</Command.Shortcut>
					{/if}
				</Command.Item>
			{/each}
		</Command.Group>
	</Command.List>
</Command.Dialog>

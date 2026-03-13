<script lang="ts">
	import { SidebarTrigger } from '$lib/components/ui/sidebar';
	import { Separator } from '$lib/components/ui/separator';
	import { Button } from '$lib/components/ui/button';
	// @feature auth
	import { LanguageSelector, ThemeToggle, UserNav } from '$lib/components/layout';
	// @end
	// @feature !auth
	import { LanguageSelector, ThemeToggle } from '$lib/components/layout';
	// @end
	import { shortcutsState } from '$lib/state/shortcuts.svelte';
	import { Search, CircleHelp } from '@lucide/svelte';
	import * as m from '$lib/paraglide/messages';
	// @feature auth
	import type { User } from '$lib/types';
	// @end

	interface Props {
		// @feature auth
		user: User | null | undefined;
		// @end
	}

	// @feature auth
	let { user }: Props = $props();
	// @end
	// @feature !auth
	let {}: Props = $props();
	// @end
</script>

<header
	class="flex h-14 shrink-0 items-center gap-2 border-b bg-muted/40 px-4 pt-[env(safe-area-inset-top,0px)] md:hidden"
>
	<SidebarTrigger class="min-h-11 min-w-11" />
	<Separator orientation="vertical" class="h-4" />
	<div class="flex-1"></div>
	<nav class="flex items-center gap-1">
		<Button
			variant="ghost"
			size="icon"
			class="min-h-11 min-w-11"
			onclick={() => (shortcutsState.isCommandPaletteOpen = true)}
			aria-label={m.shortcuts_commandPalette()}
		>
			<Search class="size-4" />
		</Button>
		<Button
			variant="ghost"
			size="icon"
			class="min-h-11 min-w-11"
			onclick={() => (shortcutsState.isHelpOpen = true)}
			aria-label={m.shortcuts_help()}
		>
			<CircleHelp class="size-4" />
		</Button>
		<LanguageSelector />
		<ThemeToggle />
		<!-- @feature auth -->
		{#if user}
			<UserNav {user} />
		{/if}
		<!-- @end -->
	</nav>
</header>

<script lang="ts">
	import { onMount } from 'svelte';
	import { animate } from 'animejs';
	import Shepherd from 'shepherd.js';
	import 'shepherd.js/dist/css/shepherd.css';

	const STORAGE_KEY = 'netrock-tour-seen';

	type Tour = InstanceType<typeof Shepherd.Tour>;

	let showButton = $state(false);
	let tour: Tour | null = null;

	const backNext = (t: Tour) => [
		{ text: 'Back', action: t.back, classes: 'tour-btn-secondary' },
		{ text: 'Next', action: t.next, classes: 'tour-btn-primary' }
	];

	function createTour(): Tour {
		const t = new Shepherd.Tour({
			useModalOverlay: true,
			keyboardNavigation: true,
			defaultStepOptions: {
				scrollTo: { behavior: 'smooth', block: 'center' },
				cancelIcon: { enabled: true },
				classes: 'netrock-tour-step',
				modalOverlayOpeningPadding: 8,
				modalOverlayOpeningRadius: 12
			}
		});

		t.addStep({
			id: 'welcome',
			title: 'Welcome to netrock',
			text: 'This generator creates ship-ready .NET projects with the exact features you need. Let me show you around.',
			buttons: [
				{ text: 'Skip', action: t.cancel, classes: 'tour-btn-secondary' },
				{ text: 'Start', action: t.next, classes: 'tour-btn-primary' }
			]
		});

		t.addStep({
			id: 'name',
			title: '1. Name your project',
			text: 'Type a name and the generator derives the .NET namespace and file slug automatically.',
			attachTo: { element: '#name', on: 'bottom' },
			buttons: backNext(t)
		});

		t.addStep({
			id: 'architecture',
			title: '2. Choose your architecture',
			text: 'API only gives you a clean .NET backend. Full stack adds a SvelteKit frontend that adapts to your selected features. More frontends are on the roadmap - Next.js is next.',
			attachTo: { element: '.grid.grid-cols-2', on: 'bottom' },
			buttons: backNext(t)
		});

		t.addStep({
			id: 'presets',
			title: '3. Pick a preset or go custom',
			text: 'Presets configure common feature sets in one click. Standard is recommended for most projects. Or toggle individual features below.',
			attachTo: { element: '.grid.grid-cols-3', on: 'bottom' },
			buttons: backNext(t)
		});

		t.addStep({
			id: 'graph',
			title: '4. Interactive dependency graph',
			text: 'Click any node to toggle a feature. Dependencies auto-resolve - enable Admin and Auth + Audit light up automatically. The graph and feature cards below stay in sync.',
			attachTo: { element: '.overflow-x-auto.rounded-xl', on: 'top' },
			buttons: backNext(t)
		});

		t.addStep({
			id: 'features',
			title: '5. Fine-tune features',
			text: 'Each card shows dependencies and has a "What\'s included" dropdown with details on what you get.',
			attachTo: { element: '.space-y-6 > div:first-child .grid.gap-2', on: 'top' },
			buttons: backNext(t)
		});

		t.addStep({
			id: 'oauth',
			title: 'OAuth providers',
			text: 'When OAuth is enabled, you can choose exactly which providers to include - Google, GitHub, Microsoft, Apple, and more. Only the ones you pick get configured.',
			attachTo: { element: '.space-y-6 > div:nth-child(2) .grid.gap-2', on: 'top' },
			buttons: backNext(t)
		});

		t.addStep({
			id: 'review',
			title: '6. Review and download',
			text: 'See the generated file tree, project stats, and setup commands. Everything runs client-side - no data leaves your browser.',
			attachTo: { element: '#review', on: 'top' },
			buttons: backNext(t)
		});

		t.addStep({
			id: 'before-ship',
			title: 'Before you ship',
			text: 'This checklist shows exactly what to configure for production - database, CORS, JWT secrets, SMTP, and more. Local dev works out of the box with Aspire.',
			attachTo: { element: '#before-you-ship', on: 'top' },
			beforeShowPromise: () => {
				return new Promise<void>((resolve) => {
					const el = document.getElementById('before-you-ship');
					if (el) el.open = true;
					setTimeout(resolve, 100);
				});
			},
			buttons: backNext(t)
		});

		t.addStep({
			id: 'done',
			title: 'You are all set',
			text: 'Pick features, download, run the setup script, and you have a production-ready .NET project. You can replay this tour anytime with the button in the bottom right.',
			buttons: [
				{ text: 'Back', action: t.back, classes: 'tour-btn-secondary' },
				{
					text: 'Done',
					action: () => {
						t.complete();
						window.scrollTo({ top: 0, behavior: 'smooth' });
					},
					classes: 'tour-btn-primary'
				}
			]
		});

		t.on('show', () => {
			requestAnimationFrame(() => {
				const el = document.querySelector('.shepherd-element');
				if (el) {
					animate(el, {
						opacity: [0, 1],
						translateY: [8, 0],
						duration: 300,
						ease: 'outCubic'
					});
				}
			});
		});

		t.on('complete', () => {
			localStorage.setItem(STORAGE_KEY, 'true');
		});

		t.on('cancel', () => {
			localStorage.setItem(STORAGE_KEY, 'true');
		});

		return t;
	}

	function startTour() {
		tour ??= createTour();
		tour.start();
	}

	onMount(() => {
		showButton = true;
		const seen = localStorage.getItem(STORAGE_KEY);
		if (!seen) {
			setTimeout(() => {
				tour = createTour();
				tour.start();
			}, 1500);
		}
	});
</script>

{#if showButton}
	<button
		type="button"
		onclick={startTour}
		class="fixed bottom-4 right-4 z-40 inline-flex min-h-[44px] items-center gap-2 rounded-full border border-border-subtle bg-surface/90 px-4 py-2 font-mono text-xs text-text-muted shadow-lg backdrop-blur-sm transition-all hover:border-accent/40 hover:text-accent sm:bottom-6 sm:right-6"
	>
		<svg class="size-4" viewBox="0 0 20 20" fill="currentColor">
			<path
				fill-rule="evenodd"
				d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.94 6.94a.75.75 0 11-1.061-1.061 3 3 0 112.871 5.026v.345a.75.75 0 01-1.5 0v-.5c0-.72.57-1.172 1.081-1.287A1.5 1.5 0 108.94 6.94zM10 15a1 1 0 100-2 1 1 0 000 2z"
				clip-rule="evenodd"
			/>
		</svg>
		Take a tour
	</button>
{/if}

<style>
	:global(.shepherd-modal-overlay-container) {
		fill: rgba(0, 0, 0, 0.7);
	}

	:global(.netrock-tour-step) {
		background: #111118 !important;
		border: 1px solid #222233 !important;
		border-radius: 12px !important;
		box-shadow:
			0 0 30px rgba(6, 182, 212, 0.08),
			0 20px 40px rgba(0, 0, 0, 0.5) !important;
		max-width: min(360px, calc(100vw - 32px)) !important;
		font-family: var(--font-sans) !important;
	}

	:global(.netrock-tour-step .shepherd-content) {
		padding: 0 !important;
	}

	:global(.netrock-tour-step .shepherd-header) {
		padding: 16px 20px 0 !important;
		background: transparent !important;
	}

	:global(.netrock-tour-step .shepherd-title) {
		font-family: var(--font-mono) !important;
		font-size: 14px !important;
		font-weight: 600 !important;
		color: #22d3ee !important;
	}

	:global(.netrock-tour-step .shepherd-cancel-icon) {
		color: #555566 !important;
		font-size: 20px !important;
	}

	:global(.netrock-tour-step .shepherd-cancel-icon:hover) {
		color: #ececf1 !important;
	}

	:global(.netrock-tour-step .shepherd-text) {
		padding: 10px 20px 16px !important;
		font-size: 13px !important;
		line-height: 1.6 !important;
		color: #8e8ea0 !important;
	}

	:global(.netrock-tour-step .shepherd-footer) {
		padding: 0 20px 16px !important;
		border-top: none !important;
		display: flex !important;
		justify-content: flex-end !important;
		gap: 8px !important;
	}

	:global(.tour-btn-primary) {
		background: #06b6d4 !important;
		color: #08080d !important;
		border: none !important;
		border-radius: 8px !important;
		padding: 7px 16px !important;
		font-family: var(--font-mono) !important;
		font-size: 12px !important;
		font-weight: 500 !important;
		cursor: pointer !important;
		transition: opacity 0.2s !important;
		min-height: 44px !important;
	}

	@media (min-width: 640px) {
		:global(.tour-btn-primary) {
			min-height: 34px !important;
		}
	}

	:global(.tour-btn-primary:hover) {
		opacity: 0.9 !important;
	}

	:global(.tour-btn-secondary) {
		background: transparent !important;
		color: #555566 !important;
		border: 1px solid #222233 !important;
		border-radius: 8px !important;
		padding: 7px 16px !important;
		font-family: var(--font-mono) !important;
		font-size: 12px !important;
		font-weight: 500 !important;
		cursor: pointer !important;
		transition: all 0.2s !important;
		min-height: 44px !important;
	}

	@media (min-width: 640px) {
		:global(.tour-btn-secondary) {
			min-height: 34px !important;
		}
	}

	:global(.tour-btn-secondary:hover) {
		border-color: #334155 !important;
		color: #8e8ea0 !important;
	}

	:global(.shepherd-arrow::before) {
		background: #111118 !important;
		border: 1px solid #222233 !important;
	}
</style>

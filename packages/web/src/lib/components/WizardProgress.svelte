<script lang="ts">
	interface Props {
		currentStep: number;
		onNavigate: (step: number) => void;
		canAdvance: boolean;
	}

	let { currentStep, onNavigate, canAdvance }: Props = $props();

	const steps = [
		{ label: 'Name', short: '1' },
		{ label: 'Stack', short: '2' },
		{ label: 'Download', short: '3' }
	];
</script>

<div
	class="fixed top-[49px] z-40 w-full border-b border-border-subtle bg-bg/90 px-4 backdrop-blur-sm sm:px-6"
>
	<div class="mx-auto flex max-w-lg items-center gap-1 py-2.5">
		{#each steps as step, i}
			{@const isActive = currentStep === i}
			{@const isDone = currentStep > i}
			{@const isReachable = i === 0 || (i === 1 && canAdvance) || (i === 2 && canAdvance)}
			<button
				type="button"
				onclick={() => isReachable && onNavigate(i)}
				disabled={!isReachable}
				class="relative flex min-h-[44px] items-center gap-1.5 rounded-md px-2 py-1 font-mono text-xs transition-all sm:min-h-0 sm:gap-2 sm:px-3
					{isActive
					? 'text-accent-light'
					: isDone
						? 'text-accent/60'
						: isReachable
							? 'text-text-muted hover:text-text-secondary'
							: 'text-text-muted/40 cursor-default'}"
			>
				<span
					class="flex size-5 items-center justify-center rounded-full border text-[10px] font-medium transition-all
						{isActive
						? 'border-accent bg-accent text-bg'
						: isDone
							? 'border-accent/40 bg-accent/10 text-accent/80'
							: 'border-border-active bg-transparent'}"
				>
					{#if isDone}
						<svg class="size-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M2 6l3 3 5-5" />
						</svg>
					{:else}
						{step.short}
					{/if}
				</span>
				<span class="hidden sm:inline">{step.label}</span>
			</button>
			{#if i < steps.length - 1}
				<div class="h-px flex-1 bg-border-subtle">
					<div
						class="h-full bg-accent/40 transition-all duration-500"
						style="width: {currentStep > i ? '100%' : '0%'}"
					></div>
				</div>
			{/if}
		{/each}
	</div>
</div>

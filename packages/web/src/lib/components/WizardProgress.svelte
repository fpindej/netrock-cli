<script lang="ts">
	interface Props {
		currentStep: number;
		onNavigate: (step: number) => void;
		canAdvance: boolean;
	}

	let { currentStep, onNavigate, canAdvance }: Props = $props();

	const steps = ['Name', 'Stack', 'Download'];
</script>

<!-- Sheet index: 01 / 02 / 03, the way a drawing set numbers its sheets -->
<div class="fixed top-14 z-40 w-full border-b border-border-subtle bg-bg px-4 sm:top-12 sm:px-6">
	<div class="mx-auto flex max-w-5xl items-stretch">
		{#each steps as label, i}
			{@const isActive = currentStep === i}
			{@const isDone = currentStep > i}
			{@const isReachable = i === 0 || canAdvance}
			<button
				type="button"
				onclick={() => isReachable && onNavigate(i)}
				disabled={!isReachable}
				aria-current={isActive ? 'step' : undefined}
				class="relative flex min-h-[44px] flex-1 items-center gap-2 border-e border-border-subtle px-3 py-2 font-mono text-xs transition-colors last:border-e-0 sm:flex-none sm:pe-8
					{isActive
					? 'text-text-primary'
					: isDone
						? 'text-text-secondary'
						: isReachable
							? 'text-text-muted hover:text-text-secondary'
							: 'cursor-default text-text-muted/50'}"
			>
				<span class="tabular-nums {isActive ? 'text-accent' : ''}">0{i + 1}</span>
				<span>{label}</span>
				{#if isDone}
					<svg class="size-3 text-emerald" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2" aria-label="done">
						<path d="M2 6l3 3 5-5" />
					</svg>
				{/if}
				{#if isActive}
					<span class="absolute inset-x-0 -bottom-px h-0.5 bg-accent"></span>
				{/if}
			</button>
		{/each}
	</div>
</div>

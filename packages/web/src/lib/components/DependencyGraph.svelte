<script lang="ts">
	import { generator } from '$lib/stores/generator.svelte';
	import { onMount } from 'svelte';
	import { animate, stagger } from 'animejs';
	import type { FeatureId } from '@netrock/core';

	const W = 88;
	const H = 30;
	const R = 6;
	const HIT_PAD = 16;

	interface GNode {
		id: FeatureId;
		label: string;
		cx: number;
		cy: number;
	}

	const S1 = 42;
	const Y0 = 26;

	const nodes: GNode[] = [
		{ id: 'core', label: 'Core', cx: 40, cy: Y0 + 3 * S1 },
		{ id: 'email', label: 'Email', cx: 155, cy: Y0 },
		{ id: 'auth', label: 'Auth', cx: 280, cy: Y0 },
		{ id: 'audit', label: 'Audit', cx: 280, cy: Y0 + S1 },
		{ id: 'file-storage', label: 'Files', cx: 280, cy: Y0 + 2 * S1 },
		{ id: 'jobs', label: 'Jobs', cx: 280, cy: Y0 + 3 * S1 },
		{ id: 'aspire', label: 'Aspire', cx: 280, cy: Y0 + 4 * S1 },
		{ id: 'claude', label: 'Claude', cx: 280, cy: Y0 + 5 * S1 },
		{ id: 'frontend', label: 'Svelte', cx: 280, cy: Y0 + 6 * S1 },
		{ id: '2fa', label: '2FA', cx: 460, cy: Y0 },
		{ id: 'oauth', label: 'OAuth', cx: 460, cy: Y0 + S1 },
		{ id: 'captcha', label: 'Captcha', cx: 460, cy: Y0 + 2 * S1 },
		{ id: 'admin', label: 'Admin', cx: 460, cy: Y0 + 3 * S1 },
		{ id: 'avatars', label: 'Avatars', cx: 460, cy: Y0 + 4 * S1 },
		{ id: 'claude-skills', label: 'Skills', cx: 460, cy: Y0 + 5 * S1 }
	];

	const lastY = Y0 + 6 * S1 + H / 2;
	const labelY = lastY + 22;
	const viewH = labelY + 12;

	const edgeDefs: [FeatureId, FeatureId][] = [
		['core', 'email'],
		['email', 'auth'],
		['core', 'audit'],
		['core', 'file-storage'],
		['core', 'jobs'],
		['core', 'aspire'],
		['core', 'claude'],
		['core', 'frontend'],
		['auth', '2fa'],
		['auth', 'oauth'],
		['auth', 'captcha'],
		['auth', 'admin'],
		['auth', 'avatars'],
		['audit', 'admin'],
		['file-storage', 'avatars'],
		['claude', 'claude-skills']
	];

	const nodeMap = new Map(nodes.map((n) => [n.id, n]));

	function edgePath(from: FeatureId, to: FeatureId): string {
		const f = nodeMap.get(from)!;
		const t = nodeMap.get(to)!;
		const sx = f.cx + W / 2;
		const sy = f.cy;
		const tx = t.cx - W / 2;
		const ty = t.cy;
		const dx = tx - sx;
		return `M${sx},${sy} C${sx + dx * 0.45},${sy} ${tx - dx * 0.45},${ty} ${tx},${ty}`;
	}

	function isOn(id: FeatureId): boolean {
		return generator.resolvedFeatures.has(id);
	}

	function edgeOn(from: FeatureId, to: FeatureId): boolean {
		return isOn(from) && isOn(to);
	}

	function handleClick(id: FeatureId) {
		if (id === 'core') return;
		generator.toggle(id);

		const rect = document.querySelector(`#gnode-${CSS.escape(id)} .gnode-rect`);
		if (rect) {
			animate(rect, {
				strokeWidth: [1.5, 3.5, 1.5],
				duration: 500,
				ease: 'outQuad'
			});
		}
	}

	onMount(() => {
		animate('.gnode', {
			opacity: [0, 1],
			translateX: [-12, 0],
			delay: stagger(35),
			duration: 500,
			ease: 'outCubic'
		});

		document.querySelectorAll<SVGPathElement>('.gedge').forEach((el) => {
			const len = el.getTotalLength();
			el.style.strokeDasharray = `${len}`;
			el.style.strokeDashoffset = `${len}`;
			animate(el, {
				strokeDashoffset: [len, 0],
				duration: 900,
				delay: 250,
				ease: 'inOutQuad'
			});
		});
	});
</script>

<div class="overflow-x-auto rounded-xl border border-border-subtle bg-surface/60 p-3 sm:p-4">
	<svg
		viewBox="0 0 550 {viewH}"
		class="mx-auto block w-full"
		style="min-width: 380px;"
	>
		<defs>
			<pattern id="gg" width="20" height="20" patternUnits="userSpaceOnUse">
				<path d="M20 0 L0 0 0 20" fill="none" stroke="#222233" stroke-width="0.3" opacity="0.5" />
			</pattern>
			<filter id="glow" x="-80%" y="-80%" width="260%" height="260%">
				<feGaussianBlur in="SourceAlpha" stdDeviation="5" result="b" />
				<feFlood flood-color="#06b6d4" flood-opacity="0.25" result="c" />
				<feComposite in="c" in2="b" operator="in" result="g" />
				<feMerge>
					<feMergeNode in="g" />
					<feMergeNode in="SourceGraphic" />
				</feMerge>
			</filter>
		</defs>

		<rect width="550" height={viewH} fill="url(#gg)" rx="8" />

		<!-- Layer labels -->
		<text
			x="40"
			y={labelY}
			text-anchor="middle"
			fill="#555566"
			font-size="8"
			font-family="var(--font-mono)"
		>
			required
		</text>
		<text
			x="280"
			y={labelY}
			text-anchor="middle"
			fill="#555566"
			font-size="8"
			font-family="var(--font-mono)"
		>
			features
		</text>
		<text
			x="460"
			y={labelY}
			text-anchor="middle"
			fill="#555566"
			font-size="8"
			font-family="var(--font-mono)"
		>
			extensions
		</text>

		<!-- Edges -->
		{#each edgeDefs as [from, to]}
			{@const active = edgeOn(from, to)}
			{@const d = edgePath(from, to)}
			<path
				class="gedge"
				d={d}
				fill="none"
				stroke={active ? '#06b6d4' : '#222233'}
				stroke-width={active ? 1.2 : 0.6}
				opacity={active ? 0.7 : 0.25}
				style="transition: stroke 0.3s, stroke-width 0.3s, opacity 0.3s;"
			/>
			{#if active}
				<circle r="2.5" fill="#22d3ee" opacity="0.8">
					<animateMotion dur="2.2s" repeatCount="indefinite" path={d} />
				</circle>
				<circle r="1.5" fill="#06b6d4" opacity="0.4">
					<animateMotion dur="2.2s" repeatCount="indefinite" path={d} begin="0.8s" />
				</circle>
			{/if}
		{/each}

		<!-- Nodes -->
		{#each nodes as node}
			{@const on = isOn(node.id)}
			{@const isCore = node.id === 'core'}
			<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
			<g
				id="gnode-{node.id}"
				class="gnode outline-none {isCore ? '' : 'cursor-pointer'}"
				role={isCore ? 'img' : 'button'}
				tabindex={isCore ? undefined : 0}
				onclick={() => handleClick(node.id)}
				onkeydown={(e) => e.key === 'Enter' && handleClick(node.id)}
			>
				<!-- Invisible hit area for touch targets -->
				{#if !isCore}
					<rect
						x={node.cx - W / 2 - HIT_PAD}
						y={node.cy - H / 2 - HIT_PAD}
						width={W + HIT_PAD * 2}
						height={H + HIT_PAD * 2}
						rx={R + 2}
						fill="transparent"
					/>
				{/if}
				<!-- Visible node -->
				<rect
					class="gnode-rect"
					x={node.cx - W / 2}
					y={node.cy - H / 2}
					width={W}
					height={H}
					rx={R}
					fill={on ? '#06b6d415' : '#191922'}
					stroke={on ? '#06b6d4' : '#222233'}
					stroke-width={on ? 1.5 : 0.8}
					filter={on ? 'url(#glow)' : 'none'}
					style="transition: fill 0.3s, stroke 0.3s, stroke-width 0.3s;"
				/>
				<text
					x={node.cx}
					y={node.cy + 1}
					text-anchor="middle"
					dominant-baseline="central"
					fill={on ? '#22d3ee' : '#555566'}
					font-size="11"
					font-family="var(--font-mono)"
					class="pointer-events-none select-none"
					style="transition: fill 0.3s;"
				>
					{node.label}
				</text>
				{#if isCore}
					<circle cx={node.cx} cy={node.cy - H / 2 - 4} r="2" fill="#06b6d4" opacity="0.6">
						<animate
							attributeName="opacity"
							values="0.6;1;0.6"
							dur="2s"
							repeatCount="indefinite"
						/>
					</circle>
				{/if}
			</g>
		{/each}
	</svg>
</div>

<style>
	.gnode:focus-visible .gnode-rect {
		stroke: #22d3ee;
		stroke-width: 2;
	}
</style>

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

	const S = 46;
	const Y0 = 24;

	const nodes: GNode[] = [
		{ id: 'core', label: 'Core', cx: 48, cy: Y0 + 2.5 * S },
		{ id: 'email', label: 'Email', cx: 168, cy: Y0 },
		{ id: 'auth', label: 'Auth', cx: 298, cy: Y0 },
		{ id: 'audit', label: 'Audit', cx: 298, cy: Y0 + S },
		{ id: 'file-storage', label: 'Files', cx: 298, cy: Y0 + 2 * S },
		{ id: 'jobs', label: 'Jobs', cx: 298, cy: Y0 + 3 * S },
		{ id: 'claude', label: 'Claude', cx: 298, cy: Y0 + 4 * S },
		{ id: '2fa', label: '2FA', cx: 458, cy: Y0 },
		{ id: 'oauth', label: 'OAuth', cx: 458, cy: Y0 + S },
		{ id: 'captcha', label: 'Captcha', cx: 458, cy: Y0 + 2 * S },
		{ id: 'admin', label: 'Admin', cx: 458, cy: Y0 + 3 * S },
		{ id: 'avatars', label: 'Avatars', cx: 458, cy: Y0 + 4 * S },
		{ id: 'claude-skills', label: 'Skills', cx: 458, cy: Y0 + 5 * S }
	];

	const tips: Record<string, string> = {
		core: 'Clean Architecture, Result pattern, PostgreSQL, Aspire, health checks',
		email: 'SMTP service with Liquid templates. Standalone or auto-included with Auth',
		auth: 'JWT login, registration, email verification, password reset, user profile',
		audit: 'Append-only event log for security-sensitive actions',
		'file-storage': 'S3/MinIO abstraction for file uploads',
		jobs: 'Hangfire background processing with PostgreSQL storage',
		claude: 'CLAUDE.md, agents, lifecycle hooks for AI-assisted dev',
		'2fa': 'TOTP-based two-factor with recovery codes',
		oauth: 'Google, GitHub, Microsoft, Apple + more. Pick your providers',
		captcha: 'Cloudflare Turnstile on registration and password reset',
		admin: 'User management, role management, permissions',
		avatars: 'Profile avatar upload with server-side image processing',
		'claude-skills': '22 slash-command skills and convention references'
	};

	const lastY = Y0 + 5 * S + H / 2;
	const labelY = lastY + 20;
	const viewH = labelY + 12;

	const edgeDefs: [FeatureId, FeatureId][] = [
		['core', 'email'],
		['email', 'auth'],
		['core', 'audit'],
		['core', 'file-storage'],
		['core', 'jobs'],
		['core', 'claude'],
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
		let sy = f.cy;
		const tx = t.cx - W / 2;
		const ty = t.cy;
		const dx = tx - sx;

		if (from === 'core') {
			const targets = edgeDefs.filter((e) => e[0] === 'core').map((e) => e[1]);
			const idx = targets.indexOf(to);
			const count = targets.length;
			const spread = Math.min(H - 4, count * 4);
			sy = f.cy - spread / 2 + (spread / (count - 1)) * idx;
		}

		return `M${sx},${sy} C${sx + dx * 0.45},${sy} ${tx - dx * 0.45},${ty} ${tx},${ty}`;
	}

	function isOn(id: FeatureId): boolean {
		return generator.resolvedFeatures.has(id);
	}

	function edgeOn(from: FeatureId, to: FeatureId): boolean {
		return isOn(from) && isOn(to);
	}

	const requiredIds = new Set<FeatureId>(['core']);

	// Tooltip state
	let hoveredNode = $state<FeatureId | null>(null);
	let tooltipX = $state(0);
	let tooltipY = $state(0);
	let svgEl: SVGSVGElement;
	let containerEl: HTMLDivElement;

	function oauthCount(): string {
		const opts = generator.getSelectedOptions('oauth');
		const total = generator.definitions.find((d) => d.id === 'oauth')?.options?.length ?? 0;
		return opts ? `${opts.size}/${total}` : '';
	}

	function nodeLabel(node: GNode): string {
		if (node.id === 'oauth' && isOn('oauth')) {
			const count = oauthCount();
			return count ? `OAuth (${count})` : node.label;
		}
		return node.label;
	}

	function handleClick(id: FeatureId) {
		if (requiredIds.has(id)) return;
		const wasOff = !generator.resolvedFeatures.has(id);
		generator.toggle(id);

		const rect = document.querySelector(`#gnode-${CSS.escape(id)} .gnode-rect`);
		if (rect) {
			animate(rect, {
				strokeWidth: [1.5, 3.5, 1.5],
				duration: 500,
				ease: 'outQuad'
			});
		}

		// When enabling OAuth, expand feature cards so user can pick providers
		if (id === 'oauth' && wasOff) {
			setTimeout(() => {
				const details = document.getElementById('feature-cards') as HTMLDetailsElement | null;
				if (details) {
					details.open = true;
					setTimeout(() => {
						const oauthCard = document.querySelector('[data-feature="oauth"]');
						oauthCard?.scrollIntoView({ behavior: 'smooth', block: 'center' });
					}, 100);
				}
			}, 200);
		}
	}

	function showTip(node: GNode) {
		hoveredNode = node.id;
		if (!svgEl || !containerEl) return;
		const svgRect = svgEl.getBoundingClientRect();
		const containerRect = containerEl.getBoundingClientRect();
		const scaleX = svgRect.width / 510;
		const scaleY = svgRect.height / viewH;
		tooltipX = svgRect.left - containerRect.left + node.cx * scaleX;
		tooltipY = svgRect.top - containerRect.top + (node.cy - H / 2) * scaleY;
	}

	function hideTip() {
		hoveredNode = null;
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

<div bind:this={containerEl} class="relative overflow-x-auto rounded-xl border border-border-subtle bg-surface/60 p-3 sm:p-4">
	<div class="mb-2 flex items-center justify-between px-1">
		<span class="font-mono text-[10px] uppercase tracking-wider text-text-muted">
			{generator.isFrontendEnabled ? 'Full stack' : 'API only'} - backend dependencies
		</span>
		<span class="font-mono text-[10px] text-text-muted">click nodes to toggle</span>
	</div>
	<svg
		bind:this={svgEl}
		viewBox="0 0 510 {viewH}"
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

		<rect width="510" height={viewH} fill="url(#gg)" rx="8" />

		<!-- Layer labels -->
		<text x="48" y={labelY} text-anchor="middle" fill="#555566" font-size="8" font-family="var(--font-mono)">
			required
		</text>
		<text x="298" y={labelY} text-anchor="middle" fill="#555566" font-size="8" font-family="var(--font-mono)">
			features
		</text>
		<text x="458" y={labelY} text-anchor="middle" fill="#555566" font-size="8" font-family="var(--font-mono)">
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
			{@const isRequired = requiredIds.has(node.id)}
			<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
			<g
				id="gnode-{node.id}"
				class="gnode outline-none {isRequired ? '' : 'cursor-pointer'}"
				role={isRequired ? 'img' : 'button'}
				tabindex={isRequired ? undefined : 0}
				onclick={() => handleClick(node.id)}
				onkeydown={(e) => e.key === 'Enter' && handleClick(node.id)}
				onpointerenter={() => showTip(node)}
				onpointerleave={hideTip}
			>
				{#if !isRequired}
					<rect
						x={node.cx - W / 2 - HIT_PAD}
						y={node.cy - H / 2 - HIT_PAD}
						width={W + HIT_PAD * 2}
						height={H + HIT_PAD * 2}
						rx={R + 2}
						fill="transparent"
					/>
				{/if}
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
					font-size={node.id === 'oauth' && isOn('oauth') ? '9' : '11'}
					font-family="var(--font-mono)"
					class="pointer-events-none select-none"
					style="transition: fill 0.3s;"
				>
					{nodeLabel(node)}
				</text>
				{#if isRequired}
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

<!-- Tooltip (positioned outside SVG, desktop only) -->
{#if hoveredNode && tips[hoveredNode]}
	<div
		class="pointer-events-none absolute z-50 max-w-[220px] rounded-lg border border-border-subtle bg-surface px-3 py-2 text-xs leading-relaxed text-text-secondary shadow-lg hover-tooltip"
		style="left: {tooltipX}px; top: {tooltipY - 8}px; transform: translate(-50%, -100%);"
	>
		<span class="font-mono font-medium text-accent-light">
			{nodes.find((n) => n.id === hoveredNode)?.label}
		</span>
		<span class="mx-1 text-border-active">-</span>
		{tips[hoveredNode]}
	</div>
{/if}

<style>
	.gnode:focus-visible .gnode-rect {
		stroke: #22d3ee;
		stroke-width: 2;
	}

	.hover-tooltip {
		display: none;
	}

	@media (hover: hover) {
		.hover-tooltip {
			display: block;
		}
	}
</style>

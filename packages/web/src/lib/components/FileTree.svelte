<script lang="ts">
	import { animate, stagger } from 'animejs';

	interface TreeNode {
		name: string;
		path: string;
		children: TreeNode[];
		isFile: boolean;
	}

	interface Props {
		paths: string[];
	}

	let { paths }: Props = $props();

	let expanded = $state(new Set<string>());

	function buildTree(filePaths: string[]): TreeNode {
		const root: TreeNode = { name: '', path: '', children: [], isFile: false };
		for (const fp of filePaths) {
			const parts = fp.split('/');
			let node = root;
			for (let i = 0; i < parts.length; i++) {
				const isLast = i === parts.length - 1;
				const childPath = parts.slice(0, i + 1).join('/');
				let child = node.children.find((c) => c.name === parts[i]);
				if (!child) {
					child = { name: parts[i], path: childPath, children: [], isFile: isLast };
					node.children.push(child);
				}
				node = child;
			}
		}
		sortTree(root);
		return root;
	}

	function sortTree(node: TreeNode) {
		node.children.sort((a, b) => {
			if (a.isFile !== b.isFile) return a.isFile ? 1 : -1;
			return a.name.localeCompare(b.name);
		});
		for (const child of node.children) sortTree(child);
	}

	function collectFolders(node: TreeNode): string[] {
		const result: string[] = [];
		for (const child of node.children) {
			if (!child.isFile) {
				result.push(child.path);
				result.push(...collectFolders(child));
			}
		}
		return result;
	}

	function countFiles(node: TreeNode): number {
		let count = 0;
		for (const child of node.children) {
			if (child.isFile) count++;
			else count += countFiles(child);
		}
		return count;
	}

	let tree = $derived(buildTree(paths));
	let allFolders = $derived(collectFolders(tree));
	let isAllExpanded = $derived(allFolders.length > 0 && allFolders.every((f) => expanded.has(f)));

	// Default: expand top-level folders. Resets when paths change (feature toggle).
	$effect(() => {
		const next = new Set<string>();
		for (const child of tree.children) {
			if (!child.isFile) next.add(child.path);
		}
		expanded = next;
	});

	function toggle(path: string) {
		const next = new Set(expanded);
		const opening = !next.has(path);
		if (opening) {
			next.add(path);
		} else {
			next.delete(path);
		}
		expanded = next;

		if (opening) {
			requestAnimationFrame(() => {
				const el = document.querySelector(`[data-folder="${CSS.escape(path)}"]`);
				if (el) {
					const items = el.querySelectorAll(':scope > div, :scope > button');
					animate(items, {
						opacity: [0, 1],
						translateX: [-8, 0],
						delay: stagger(20),
						duration: 200,
						ease: 'outCubic'
					});
				}
			});
		}
	}

	function expandAll() {
		expanded = new Set(allFolders);
	}

	function collapseAll() {
		expanded = new Set<string>();
	}
</script>

<div class="overflow-hidden rounded-xl border border-border-subtle bg-surface">
	<div class="flex items-center justify-between border-b border-border-subtle px-4 py-2">
		<span class="font-mono text-xs text-text-muted">{paths.length} files</span>
		<button
			type="button"
			onclick={() => (isAllExpanded ? collapseAll() : expandAll())}
			class="min-h-[34px] font-mono text-xs text-accent hover:text-accent-light sm:min-h-0"
		>
			{isAllExpanded ? 'Collapse all' : 'Expand all'}
		</button>
	</div>
	<div class="max-h-80 overflow-y-auto p-3 sm:max-h-96">
		<div class="font-mono text-xs leading-relaxed">
			{#snippet renderNodes(nodes: TreeNode[], depth: number)}
				{#each nodes as node}
					{#if node.isFile}
						<div
							style="padding-inline-start: {depth * 20}px"
							class="flex min-w-0 items-center gap-1.5 py-0.5"
						>
							<span class="flex w-3 shrink-0 justify-center text-text-muted/50">-</span>
							<span class="min-w-0 truncate text-text-secondary">{node.name}</span>
						</div>
					{:else}
						{@const isOpen = expanded.has(node.path)}
						<button
							type="button"
							onclick={() => toggle(node.path)}
							style="padding-inline-start: {depth * 20}px"
							class="flex min-h-[34px] w-full min-w-0 items-center gap-1.5 rounded py-1 text-start transition-colors hover:bg-surface-raised/50 sm:min-h-0 sm:py-0.5"
						>
							<svg
								class="size-3 shrink-0 text-text-muted transition-transform {isOpen
									? 'rotate-90'
									: ''}"
								viewBox="0 0 16 16"
								fill="currentColor"
							>
								<path
									d="M6.22 4.22a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.75.75 0 0 1-1.06-1.06L8.94 8 6.22 5.28a.75.75 0 0 1 0-1.06Z"
								/>
							</svg>
							<span class="min-w-0 truncate text-accent-light">{node.name}/</span>
							{#if !isOpen}
								<span class="shrink-0 text-[10px] text-text-muted/40">
									{countFiles(node)}
								</span>
							{/if}
						</button>
						{#if isOpen}
							<div data-folder={node.path}>
								{@render renderNodes(node.children, depth + 1)}
							</div>
						{/if}
					{/if}
				{/each}
			{/snippet}

			{@render renderNodes(tree.children, 0)}
		</div>
	</div>
</div>

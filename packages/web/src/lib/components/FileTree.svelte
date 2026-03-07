<script lang="ts">
	interface TreeNode {
		name: string;
		children: TreeNode[];
		isFile: boolean;
	}

	interface Props {
		paths: string[];
		maxVisible?: number;
	}

	let { paths, maxVisible = 60 }: Props = $props();
	let showAll = $state(false);

	function buildTree(filePaths: string[]): TreeNode {
		const root: TreeNode = { name: '', children: [], isFile: false };
		for (const path of filePaths) {
			const parts = path.split('/');
			let node = root;
			for (let i = 0; i < parts.length; i++) {
				const isLast = i === parts.length - 1;
				let child = node.children.find((c) => c.name === parts[i]);
				if (!child) {
					child = { name: parts[i], children: [], isFile: isLast };
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

	function flattenTree(node: TreeNode, depth: number): { name: string; depth: number; isFile: boolean }[] {
		const lines: { name: string; depth: number; isFile: boolean }[] = [];
		for (const child of node.children) {
			lines.push({ name: child.name, depth, isFile: child.isFile });
			if (!child.isFile) {
				lines.push(...flattenTree(child, depth + 1));
			}
		}
		return lines;
	}

	let tree = $derived(buildTree(paths));
	let allLines = $derived(flattenTree(tree, 0));
	let visibleLines = $derived(showAll ? allLines : allLines.slice(0, maxVisible));
	let hasMore = $derived(allLines.length > maxVisible);
</script>

<div class="overflow-hidden rounded-xl border border-border-subtle bg-surface">
	<div class="flex items-center justify-between border-b border-border-subtle px-4 py-2">
		<span class="font-mono text-xs text-text-muted">{paths.length} files</span>
		{#if hasMore && !showAll}
			<button
				type="button"
				onclick={() => (showAll = true)}
				class="font-mono text-xs text-accent hover:text-accent-light"
			>
				Show all
			</button>
		{/if}
	</div>
	<div class="max-h-80 overflow-y-auto p-3 sm:max-h-96">
		<div class="font-mono text-xs leading-relaxed">
			{#each visibleLines as line}
				<div style="padding-inline-start: {line.depth * 16}px" class="flex items-center gap-1.5 py-px">
					{#if line.isFile}
						<span class="text-text-muted">-</span>
						<span class="text-text-secondary">{line.name}</span>
					{:else}
						<span class="text-accent">+</span>
						<span class="text-text-primary">{line.name}/</span>
					{/if}
				</div>
			{/each}
			{#if hasMore && !showAll}
				<div class="mt-1 text-text-muted">... {allLines.length - maxVisible} more</div>
			{/if}
		</div>
	</div>
</div>

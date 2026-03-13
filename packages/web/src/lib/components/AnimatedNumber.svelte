<script lang="ts">
	import { animate } from 'animejs';

	interface Props {
		value: number;
	}

	let { value }: Props = $props();
	let el: HTMLSpanElement;
	let prev = 0;
	let first = true;

	$effect(() => {
		const target = value;
		if (!el) return;
		if (first) {
			el.textContent = String(target);
			prev = target;
			first = false;
			return;
		}
		if (prev === target) return;
		const obj = { v: prev };
		animate(obj, {
			v: target,
			duration: 500,
			ease: 'outExpo',
			onUpdate: () => {
				if (el) el.textContent = String(Math.round(obj.v));
			},
			onComplete: () => {
				prev = target;
			}
		});
	});
</script>

<span bind:this={el}>{value}</span>

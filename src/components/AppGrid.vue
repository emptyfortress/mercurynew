<script setup lang="ts">
</script>

<template lang="pug">
.grid
	.item
	.item
	.item
	.item
	.item
	.item
	.item
	.item
	.item
	.item
	.item
</template>

<style scoped lang="scss">
.grid {
	--width: 200px;
	margin: 1rem;
	display: grid;
	grid-auto-flow: row;
	grid-template-columns: repeat(auto-fill, var(--width));
	// justify-items: start;
	// align-items: stretch;
	gap: 1rem;

	.item {
		background: #fff;
		height: var(--width);
		border-radius: .5rem;
		cursor: pointer;
		transition: transform .2s ease;

		&:hover {
			transform: translateY(-8px);
			box-shadow: 2px 2px 6px rgba($color: #000000, $alpha: 0.2);
			outline: 1px solid #ccc;
		}
	}
}
</style>

<template lang="pug">
.loader
	.par1
		.bl
			q-skeleton(type="circle" bordered width="48px" height="48px")
		template(v-for="n in 4")
			q-skeleton(type="rect" bordered width="170px" :height="rectHeight")
</template>

<script setup lang="ts">
const props = defineProps({
	rectHeight: {
		type: String,
		default: '170px',
	},
})
</script>

<style scoped lang="scss">
.loader {
	position: absolute;
	inset: 0;
	padding-top: 75px;
	background: linear-gradient(
		180deg,
		#d8e3f1 0%,
		hsl(210 22% 83% / 1) 52.6%,
		hsl(199 39% 86% / 1) 100%
	);
	z-index: 9999;
}
.par1 {
	margin-top: 1rem;
	width: 1100px;
	margin: 0 auto;
	display: grid;
	grid-template-columns: repeat(6, 170px);
	gap: 1rem;
	.bl {
		display: flex;
		justify-content: center;
		align-items: center;
	}
}
</style>

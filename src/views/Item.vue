<script setup lang="ts">
</script>

<template lang="pug">
transition(:css="false" @leave="(el, done) => motions.cube.leave(done)")
	.fuck(
		v-motion='"cube"'
		:initial="{ y: 100, opacity: 0 }"
		:enter='{ y: 0, opacity: 1, transition: { delay: 500 + (100 * index) } }'
		:leave="{ opacity: 0, y: 100 }"
		)
</template>

<style scoped lang="scss">
.fuck {
	width: 100px;
	height: 100px;
	background: #fff;
}
</style>

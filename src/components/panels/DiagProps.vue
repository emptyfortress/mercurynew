<script setup lang="ts">
import etapProps from '@/assets/img/etap.png'

const test = (() => {
	console.log(111)
})
</script>

<template lang="pug">
div
	div Свойства
	img(:src="etapProps" usemap="#image-map" width="335")
	map(name="image-map")
		area(target="_self" alt="next" title="next" @click="test" href="#" coords="299,154,346,197" shape="rect")

</template>

<style scoped lang="scss"></style>

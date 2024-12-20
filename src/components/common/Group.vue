<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'

const item = defineModel<App>('item')

const props = defineProps<{
	index: number,
	// expanded: boolean,
}>()

gsap.registerPlugin(Flip)

const delay = ref(true)
onMounted(() => {
	nextTick(() => {
		delay.value = false
	})
})

const calcDelay = (ind: number) => {
	return delay.value ? (300 + ind * 100) : 300
}
const calcLabel = (() => {
	return item.value.group > 1 ? 'Группа' : item.value.label
})

const calcClass = computed(() => {
	if (props.expanded == true && item.value.expand == true) return 'active'
	if (props.expanded == true && item.value.expand == false) return 'inactive'
	else return ''
})

const expand = ((item: App) => {
	console.log(item)
	// const state = Flip.getState('.item, .ani')
	item.value.expand = !item.value.expand
	console.log(item)
	// nextTick(() => {
	// 	Flip.from(state, {
	// 		duration: 0.4,
	// 		ease: 'power3.inOut',
	// 		targets: '.item, .dialog',
	// 		absolute: true,
	// 		fade: true,
	// 	})
	// })
})

</script>

<template lang="pug">
.item(
	v-motion
	:initial="{ scale: 0, opacity: 0 }"
	:enter='{ scale: 1, opacity: 1, transition: { delay: calcDelay(index) } }'
	@click='expand(item)'
	:class="calcClass"
	)

	.hg.ani {{ calcLabel(item) }}
	q-icon.ani.img(v-if='item.group == 1' name="mdi-application-braces-outline" color="secondary" size="lg")


	// AppPreview(:item='item' v-if='item.expand && item.group == 1 && props.expanded')
</template>

<style scoped lang="scss">
.img {
	position: absolute;
	bottom: 1rem;
}
</style>

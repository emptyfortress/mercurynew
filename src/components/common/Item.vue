<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'

const item = defineModel<App>()

const props = defineProps<{
	index: number,
	// expanded: boolean,
}>()

gsap.registerPlugin(Flip)

const expanded = ref(false)

const delay = ref(true)
onMounted(() => {
	nextTick(() => {
		delay.value = false
	})
})

const calcDelay = (ind: number) => {
	return delay.value ? (300 + ind * 100) : 300
}
const calcClass = computed(() => {
	if (expanded.value && item.value.expand == true) return 'active'
	if (expanded.value && item.value.expand == false) return 'inactive'
	// if (props.expanded == true && item.value.expand == false) return 'inactive'
	else return ''
})

const expand = ((item: App) => {
	console.log(item)
	const state = Flip.getState('.item')
	expanded.value = !expanded.value
	item.expand = !item.expand
	nextTick(() => {
		Flip.from(state, {
			duration: 0.4,
			ease: 'power3.inOut',
			// targets: '.item, .dialog',
			absolute: true,
			// fade: true,
		})
	})
})

</script>

<template lang="pug">
.item(
	v-motion
	:initial="{ scale: 0, opacity: 0 }"
	:enter='{ scale: 1, opacity: 1, transition: { delay: calcDelay(index) } }'
	@click.stop='expand(item)'
	:class="calcClass"
	)

	.hg.ani {{ item.label }}
	q-icon.ani.img(v-if='item.group == 1' name="mdi-application-braces-outline" color="secondary" size="lg")


	// AppPreview(:item='item' v-if='item.expand && item.group == 1 && props.expanded')
.dialog
</template>

<style scoped lang="scss">
.img {
	position: absolute;
	bottom: 1rem;
}
.dialog {
	position: fixed;
	height: 70vh;
	width: 900px;
	margin: 0 auto;
	left: 0;
	right: 0;
	border: 1px solid #ccc;
	box-shadow: 2px 2px 6px rgba($color: #000000, $alpha: 0.2);
	display: none;
}
.item.active {
	visibility: hidden;

	.dialog {
		display: block;
	}
	// position: fixed;
	// height: 70vh;
	// width: 900px;
	// margin: 0 auto;
	// left: 0;
	// right: 0;
	// border: 1px solid #ccc;
	// box-shadow: 2px 2px 6px rgba($color: #000000, $alpha: 0.2);
}
.item.inactive {
	visibility: hidden;
}
</style>

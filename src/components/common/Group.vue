<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'

const props = defineProps<{
	item: App,
	index: number,
	groupexpanded: boolean,
}>()

const delay = ref(true)
onMounted(() => {
	nextTick(() => {
		delay.value = false
	})
})

const calcDelay = (ind: number) => {
	return delay.value ? (300 + ind * 100) : 300
}
const calcLabel = ((item: any) => {
	return item.group > 1 ? 'Группа' : item.label
})

const calcClass = (item: App) => {
	// if (groupexpanded.value == true && item.expand == true && item.group > 1) return 'groupactive'
	// if (item.group > 1) return 'group'
	if (props.expanded == true && props.item.expand == true) return 'active'
	if (props.expanded == true && props.item.expand == false) return 'inactive'
	else return ''
}

</script>

<template lang="pug">
.item(
	v-motion
	:initial="{ scale: 0, opacity: 0 }"
	:enter='{ scale: 1, opacity: 1, transition: { delay: calcDelay(index) } }'
	@click='expand(props.item)'
	:class="calcClass(props.item)"
	)

	.hg.ani {{ calcLabel(item) }}
	q-icon.ani.img(v-if='item.group == 1' name="mdi-application-braces-outline" color="secondary" size="lg")


	AppPreview(:item='props.item' v-if='props.item.expand && props.item.group == 1 && props.expanded')
</template>

<style scoped lang="scss"></style>

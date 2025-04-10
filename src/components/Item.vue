<script setup lang="ts">
import { ref } from 'vue'
import { motion } from 'motion-v'

const expanded = defineModel('expanded')
const tapes = defineModel<App[]>('tapes')
const activeItem = defineModel<number>('activeItem')

const Div = motion.div

const emit = defineEmits(['navigate'])

const action = (item: App) => {
	if (item.group == 2) {
		emit('navigate', item.id)
	} else {
		if (activeItem.value !== 0 && activeItem.value == item.id) {
			expanded.value = false
			activeItem.value = 0
		} else {
			expanded.value = true
			activeItem.value = item.id
		}
	}
}

const calcClass = (item: App) => {
	if (item.group == 2) return 'group1'
	if (expanded.value && activeItem.value == item.id) return 'active'
	return ''
}
const calcId = (item: App) => {
	if (item.group == 2) return 'underline'
}
const initial = {
	opacity: 0,
	y: 20,
}

const animate = (index: number) => ({
	opacity: 1,
	y: 0,
	transition: { delay: index * 0.05 },
})

const spring = {
	type: 'spring',
	visualDuration: 0.3,
	bounce: 0.25,
}
</script>

<template lang="pug">
Div.it(v-for="(item, index) in tapes", :key="item.id",
	@click.stop='action(item)',
	:data-state="expanded",
	layout,
	:layout-id="calcId(item)"
	:class='calcClass(item)'
	:initial="initial"
	:animate="animate(index)"
	:transition="spring"
)
	span {{ item.label }}

	.img(v-if='item.group == 1')
		component(:is='item.pic')

	template(v-if='item.group == 2')
		.img1
			component(:is='el.pic' v-for="el in item.list" :key="el.id")
</template>

<style scoped lang="scss">
.img1 {
	bottom: 0.5rem;
	left: 0.8rem;
	font-size: 1.5rem;
}
</style>

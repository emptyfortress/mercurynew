<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import AddButtonNew1 from '@/components/common/AddButtonNew1.vue'
import ItemNew from '@/components/ItemNew.vue'
import { spring } from '@/utils/springConstants'
import { animations } from '@formkit/drag-and-drop'
import { useDragAndDrop } from '@formkit/drag-and-drop/vue'
import { motion } from 'motion-v'

const initial = {
	opacity: 0,
	y: -20,
}

const animate = {
	opacity: 1,
	y: 0,
}

const Div = motion.div

const des = ref([
	{
		id: '0',
		label: 'Решение 1',
		descr: '',
		expand: false,
	},
	{
		id: '1',
		label: 'Решение 2',
		descr: '',
		expand: false,
	},
	{
		id: '2',
		label: 'Решение 3',
		descr: '',
		expand: false,
	},
])

const config = {
	plugins: [animations()],
	dragPlaceholderClass: 'ghost',
	sortable: true,
	draggable: (child: HTMLElement) => {
		return child.classList.contains('it')
	},
}

const [parent, tapes] = useDragAndDrop(des.value, config)

watch(tapes, (val) => {
	if (val) {
		des.value = tapes.value
	}
})

const expanded = ref(false)

const row = computed(() => {
	return Math.floor(tapes.value.length / 4 + 1)
})
const row1 = computed(() => {
	return tapes.value.length + 1
})
</script>

<template lang="pug">
q-page(padding)
	.parent(ref='parent')
		Div.plus(
			layout
			:transition='spring'
		)
			AddButtonNew1(mode='app')

		ItemNew(
			v-model:expanded="expanded"
			v-model:tapes='tapes'
			v-model:activeItem="activeItem"
			@navigate="navigate"
			@duplicate="duble"
		)

		// Div.it(
		// 	v-for="(item, index) in tapes",
		// 	:key="item.id",
		// 	:transition="spring"
		// 	:initial="initial"
		// 	:animate="animate"
		// )
		// 	label {{ item.label }}
</template>

<style scoped lang="scss">
.parent {
	grid-template-rows: repeat(v-bind(row), 170px);
	&.end {
		grid-template-rows: repeat(v-bind(row1), 80px);
	}
}
</style>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useDragAndDrop } from '@formkit/drag-and-drop/vue'
// import { animations } from '@formkit/drag-and-drop'
import { useRouter, useRoute } from 'vue-router'
import { motion } from 'motion-v'

const list = defineModel<App[]>('list')

const router = useRouter()
const route = useRoute()
const config = {
	// plugins: [animations()],
	dragPlaceholderClass: 'ghost',
	sortable: true,
	group: 'items',
	draggable: (child: HTMLElement) => {
		return child.classList.contains('it')
	},
}

const Div = motion.div

const [parent, tapes] = useDragAndDrop(list.value!, config)

watch(tapes, (val) => {
	if (val) {
		list.value = tapes.value
	}
})

const navigate = (id: string) => {
	router.push(`/folder/${route.params.id}/${id}`)
}

const calcIdNew = (item: App) => {
	return item.id
}

const rowList = computed(() => {
	if (list.value && list.value.length) {
		return Math.floor(list.value.length / 3 + 1)
	}
})

const emit = defineEmits(['removeGroup'])
const remove = () => {
	emit('removeGroup')
}
</script>

<template lang="pug">
q-btn(v-if='tapes.length == 0' unelevated color="primary" label="Удалить группу" @click.stop="remove") 
.parent(ref='parent')
	Div.it(v-for="(item, index) in tapes", :key="item.id",
		:layout-id='calcIdNew(item)'
		@click.stop='navigate(item.id)',
	)
		span {{ item.label }}

		.img()
			component(:is='item.pic')
</template>

<style scoped lang="scss">
.it.active.group .parent {
	width: 615px;
	grid-template-rows: repeat(v-bind(rowList), 170px);
}
.it.active.group .it {
	border: 1px solid $secondary;
}
.q-btn {
	display: block;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
}
.parent {
	min-height: 150px;
}
</style>

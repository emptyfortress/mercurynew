<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { motion } from 'motion-v'
import { animations } from '@formkit/drag-and-drop'
import { useDragAndDrop } from '@formkit/drag-and-drop/vue'
import IcOutlineDesktopWindows from '@/components/icons/IcOutlineDesktopWindows.vue'
import { servers } from '@/stores/servers'

const config = {
	plugins: [animations()],
	dragPlaceholderClass: 'ghost',
	sortable: true,
	draggable: (child: HTMLElement) => {
		return child.classList.contains('server')
	},
}

const [pare, tapes] = useDragAndDrop(servers.value, config)

const Div = motion.div

const expanded = ref<boolean>(false)

const initial = {
	opacity: 0,
	y: -20,
}

const animate = {
	opacity: 1,
	y: 0,
}
const spring = {
	type: 'spring',
	visualDuration: 0.3,
	bounce: 0.25,
}

const emit = defineEmits(['navigate', 'back'])
const activeItem = ref()
const action = async (item: any) => {
	if (activeItem.value !== '' && activeItem.value == item.id) {
		expanded.value = false
		activeItem.value = ''
		item.expand = false
		emit('back')
		await nextTick()
	} else {
		expanded.value = true
		activeItem.value = item.id
		item.expand = true
		emit('navigate', item.id)
		await nextTick()
	}
}

const calcClass = (item: any, index: number) => {
	if (expanded.value && activeItem.value !== item.id) return `em-${index! + 1}`
	else if (expanded.value && activeItem.value == item.id) return 'active'
	else return `im-${index! + 1}`
}
</script>

<template lang="pug">
div
	.hd1
		q-icon.q-mr-sm(name="mdi-database-outline" size="24px") 
		|Базы данных
	Div.pare(ref='pare',
		:class="{'end': expanded}"
	)
		Div.server(v-for="(item, index) in tapes", :key="item.id",
			@click.stop='action(item)',
			:layout-id="item.id"
			:initial="initial"
			:animate="animate"
			:transition="spring"
			:class='calcClass(item, index)'
		)
			.toprow
				div {{ item.nick }}
				q-btn(flat round dense color="primary") 
					IcOutlineDesktopWindows

</template>

<style scoped lang="scss">
.hd1 {
	font-size: 1rem;
	text-align: center;
	margin-bottom: 0.5rem;
	img {
		margin-bottom: -2px;
	}
}
.server {
	width: 100%;
	height: 100px;
	background: #ffffff77;
	border-radius: 0.5rem;
	border: 1px solid white;
	order: 0;
	&.active {
		height: 170px;
		grid-column: 1/-1;
		grid-row: 1/2;
	}
}
.server.drag-over {
	border: 2px dashed $primary;
	background-color: #e3f2fd;
}
.toprow {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin: 0 0 1rem 0.5rem;
}
.pare {
	width: 100%;
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	column-gap: 0.5rem;
	row-gap: 0.5rem;
	&.end {
		grid-template-rows: 200px auto;
	}
}

.im-1 {
	grid-column: 1/2;
	grid-row: 1/2;
}
.im-2 {
	grid-column: 2/3;
	grid-row: 1/2;
}
.im-3 {
	grid-column: 3/4;
	grid-row: 1/2;
}
.im-4 {
	grid-column: 1/2;
	grid-row: 2/3;
}
.im-5 {
	grid-column: 2/3;
	grid-row: 2/3;
}
.im-6 {
	grid-column: 3/4;
	grid-row: 2/3;
}
.im-7 {
	grid-column: 1/2;
	grid-row: 3/4;
}
.im-8 {
	grid-column: 2/3;
	grid-row: 3/4;
}
.im-9 {
	grid-column: 3/4;
	grid-row: 3/4;
}

.em-1 {
	grid-column: 1/2;
	grid-row: 2/3;
}
.em-2 {
	grid-column: 2/3;
	grid-row: 2/3;
}
.em-3 {
	grid-column: 3/4;
	grid-row: 2/3;
}
.em-4 {
	grid-column: 1/2;
	grid-row: 3/4;
}
.em-5 {
	grid-column: 2/3;
	grid-row: 3/4;
}
.em-6 {
	grid-column: 3/4;
	grid-row: 3/4;
}
.em-7 {
	grid-column: 1/2;
	grid-row: 4/5;
}
.em-8 {
	grid-column: 2/3;
	grid-row: 4/5;
}
.em-9 {
	grid-column: 3/4;
	grid-row: 4/5;
}
</style>

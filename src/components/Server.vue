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

const emit = defineEmits(['navigate'])
const activeItem = ref()
const action = async (item: any) => {
	if (activeItem.value !== '' && activeItem.value == item.id) {
		expanded.value = false
		activeItem.value = ''
		item.expand = false
	} else {
		expanded.value = true
		activeItem.value = item.id
		item.expand = true
		emit('navigate', item.id)
		await nextTick()
	}
}

const calcClass = (item: any, index: number) => {
	if (expanded.value && activeItem.value == item.id) return 'active'
	return ''
}

const calcGhost = computed(() => {
	let ind = tapes.value?.findIndex((item) => item.id == activeItem.value)

	if (ind !== -1) {
		return `em-${ind! + 1}`
	}
	return ''
})
</script>

<template lang="pug">
div
	.hd1
		q-icon.q-mr-sm(name="mdi-server-network-outline" size="24px") 
		|Серверы
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

		.ghostItem(ref='ghostItem'
			v-if='expanded',
			:class='calcGhost'
			@click.stop
		)

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
		height: 150px;
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
	// display: flex;
	// flex-wrap: wrap;
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	// grid-template-rows: 100px;
	column-gap: 0.5rem;
	row-gap: 0.5rem;
	&.end {
		grid-template-rows: 200px auto;
	}
}
</style>

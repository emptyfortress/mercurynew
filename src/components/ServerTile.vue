<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { useDragAndDrop } from '@formkit/drag-and-drop/vue'
import { useServers } from '@/stores/servers'
import { motion } from 'motion-v'

const server = useServers()

const activeItem = ref('')
const config = {
	dragPlaceholderClass: 'ghost',
	sortable: true,
	draggable: (child: HTMLElement) => {
		return child.classList.contains('server')
	},
}
const [pare, tapes] = useDragAndDrop(server.visibleServers, config)

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

const action = async (item: any) => {
	if (activeItem.value !== '' && activeItem.value == item.id) {
		expanded.value = false
		activeItem.value = ''
		item.expand = false
		// back()
		await nextTick()
	} else {
		expanded.value = true
		activeItem.value = item.id
		item.expand = true
		// navigate(item.id)
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
	.hd1.text-center
		q-icon.q-mr-sm(name="mdi-database-outline" size="24px") 
		|Базы данных
	Div.pare(ref='pare',
		:class="{'end': expanded}"
	)
		Div.server(v-for="(item, index) in tapes", :key="item.id",
			@click='action(item)',
			:layout-id="item.id"
			:initial="initial"
			:animate="animate"
			:transition="spring"
			:class="calcClass(item, index) + (item.def ? ' is-default' : '')"
		)
			.toprow
				q-icon.q-mr-sm(v-if='item.prod' name="mdi-access-point" color="red" size='sm')
					q-tooltip(v-if='item.prod') Production environment
				div {{ item.nick }}
			.text-center.q-mt-md(v-if='!item.expand')
				// q-icon(name="mdi-account-circle" color="primary")
				span.dont Не настроено

</template>

<style scoped lang="scss">
.dont {
	font-size: 0.8rem;
	color: #888;
}
.pare {
	margin-top: 1rem;
	width: 100%;
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	column-gap: 0.5rem;
	row-gap: 0.5rem;
	&.end {
		grid-template-rows: 200px auto;
	}
}
.server {
	width: 100%;
	height: 100px;
	background: #e1e8ef;
	border-radius: 0.5rem;
	border: 1px solid white;
	cursor: pointer;
	&.active {
		height: 170px;
		grid-column: 1/-1;
		grid-row: 1/2;
	}
	&:hover {
		box-shadow: var(--shad0);
	}
}
.toprow {
	display: flex;
	justify-content: start;
	align-items: center;
	margin: 0 0.5rem 0 1rem;
}
</style>

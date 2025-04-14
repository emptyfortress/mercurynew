<script setup lang="ts">
import { ref, computed } from 'vue'
import { motion, animate, stagger, AnimatePresence } from 'motion-v'
import { useRouter, useRoute } from 'vue-router'
import { useApps } from '@/stores/apps'
import { useDragAndDrop } from '@formkit/drag-and-drop/vue'
import { animations } from '@formkit/drag-and-drop'

const myapps = useApps()
const router = useRouter()
const route = useRoute()

const list = computed(() => {
	return myapps.apps.filter((item) => item.id == +route.params.id)[0].list
})

const Div = motion.div

const back = () => {
	router.back()
}

const config = {
	plugins: [animations()],
	dragPlaceholderClass: 'ghost',
	sortable: true,
	draggable: (child: HTMLElement) => {
		return child.classList.contains('it')
	},
}
const [parent, tapes] = useDragAndDrop(list.value, config)

// expand item
const expanded = ref(false)
const activeItem = ref(0)

const action = (item: App) => {
	if (activeItem.value !== 0 && activeItem.value == item.id) {
		expanded.value = false
		activeItem.value = 0
	} else {
		expanded.value = true
		activeItem.value = item.id
	}
}

const calcClass = (item: App) => {
	if (expanded.value && activeItem.value == item.id) return 'active'
	return ''
}
</script>

<template lang="pug">
q-page(padding)
	Div.box(@click='back' layout-id="underline")
		.header
			span Маркетинг
		Div.parent(ref='parent',
			:class="{'end': expanded}",
			layout,
		)

			Div.it(
				v-for="(item, index) in tapes",
				:key="item.id",
				:class='calcClass(item)'
				layout,
				@click.stop='action(item)'
			)
				span {{ item.label }} - {{ expanded }}
				.img
					component(:is='item.pic')

</template>

<style scoped lang="scss">
.header {
	text-align: center;
	color: $primary;
	margin-bottom: 0.8rem;
	span {
		font-size: 1.2rem;
		border-bottom: 1px dotted $primary;
	}
}
.ic {
	font-size: 1.9rem;
	margin-bottom: -5px;
	margin-right: 0.5rem;
}
.box {
	margin: 0 auto;
	margin-top: 1rem;
	width: 860px;
	padding: 0.5rem;
	background: hsl(213deg 83.95% 94.68%);
	border: 2px solid var(--green);
	border-radius: 0.5rem;
	z-index: 10;
}
.it {
	width: 170px;
	height: 170px;
	border: 1px solid $secondary;
}
.parent {
	width: initial;
	display: flex;
	margin: 0.5rem;
	&:hover {
		box-shadow: none;
	}
	&.end {
		display: grid;
		grid-template-columns: repeat(1, 200px);
		grid-template-rows: repeat(4, 80px);
		width: 200px;
		margin: 0;
		// margin-left: calc(50% - 500px);
		margin-top: 1rem;
		.it {
			padding: 0.5rem;
			font-size: 0.85rem;
			width: 100%;
			height: initial;
			&.active {
				padding: 1rem;
				font-size: 1.2rem;
				width: 550px;
				height: 350px;
				position: fixed;
				top: 145px;
				left: calc(50% - 160px);
				// font-size: 2rem;
				.img {
					font-size: 4rem;
				}
			}
		}
	}
}
</style>

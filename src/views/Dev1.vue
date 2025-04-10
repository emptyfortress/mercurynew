<script setup lang="ts">
import { ref, computed } from 'vue'
import { motion, animate, stagger, AnimatePresence } from 'motion-v'
import { useRouter, useRoute } from 'vue-router'
import IconFolderOpen from '@/components/icons/IconFolderOpen.vue'
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

const play = () => {
	router.push('/')
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

const expanded = ref(false)
</script>

<template lang="pug">
q-page(padding)
	Div.header(layout-id='zag')
		IconFolderOpen.ic
		|Маркетинг
	.cont
		Div.box(@click='play' layout-id="underline")
			Div.pa(ref='parent'
				:class="{'end': expanded}"
			)
				Div.it(v-for="(item, index) in tapes", :key="item.id",
					:data-state="expanded",
					layout,
				)

</template>

<style scoped lang="scss">
.header {
	font-size: 1.5rem;
	text-align: center;
	vertical-align: bottom;
}
.ic {
	font-size: 1.9rem;
	margin-bottom: -5px;
	margin-right: 0.5rem;
}
.cont {
	width: 728px;
	margin: 0 auto;
	margin-bottom: 0.5rem;
}
.box {
	width: 100%;
	height: 400px;
	background: hsl(213deg 83.95% 94.68%);
	border: 2px solid var(--green);
	border-radius: 0.5rem;
	z-index: 10;
}
.pa {
	display: grid;
	grid-template-columns: repeat(4, 170px);
	grid-template-rows: repeat(4, 170px);
	gap: 1rem;
	margin: 0 auto;
	margin-top: 0.5rem;
	width: 728px;
	// background: #ccc;
	&.end {
		grid-template-columns: repeat(1, 200px);
		grid-template-rows: repeat(7, 80px);
		width: 200px;
		margin: 0;
		// margin-left: 200px;
		margin-left: calc(50% - 500px);
		.it {
			padding: 0.5rem;
			font-size: 0.85rem;
			&.active {
				padding: 1rem;
				font-size: 1.2rem;
				.img {
					font-size: 4rem;
				}
			}
		}
		.img,
		img1 {
			font-size: 1.5rem;
		}
	}
}
.it {
	border-radius: 0.5rem;
	cursor: pointer;
	padding: 1rem;
	background: #fff;
	border: 1px solid #fff;
	position: relative;

	&:hover {
		border: 1px solid #ccc;
		box-shadow: 2px 2px 6px rgba($color: #000000, $alpha: 0.2);
	}
	&.active {
		width: 550px;
		height: 250px;
		position: fixed;
		top: 9rem;
		left: calc(50% - 225px);
		font-size: 2rem;
	}
	&.group1 {
		background: hsl(213deg 83.95% 94.68%);
		border: 2px solid var(--green);
		z-index: 10;
	}
}
</style>

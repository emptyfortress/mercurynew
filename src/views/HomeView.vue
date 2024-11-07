<script setup lang="ts">
import { ref, } from 'vue'
import BaseTree from '@/components/BaseTree.vue'
// import AppGrid from '@/components/AppGrid.vue'
import { myApps } from '@/stores/tree'
import { useStorage } from '@vueuse/core'
import { useRouter, useRoute } from 'vue-router'
import { useMotions, useMotion } from '@vueuse/motion'



const router = useRouter()
const route = useRoute()

const app = useStorage('app', localStorage)

const showAdd = ref(false)

const motions = useMotions()

const add = async () => {
	showAdd.value = !showAdd.value
	await cardAnim('set1')
	await cardAnim('set2')
	await cardAnim('initial')
	// } else await cardAnim({ width: 600 })
}


const card = ref<HTMLElement>()

const { apply: cardAnim } = useMotion(card, {
	initial: {
		width: 600,
		opacity: 1,
		x: 0,
	},
	set1: {
		width: 300,
		x: -200,
		opacity: 1
	},
	set2: {
		width: 300,
		x: -300,
		opacity: 0.5,
		transition: {
			delay: 1,
		},
	}

})
</script>

<template lang="pug">
q-page(padding)
	.card(ref='card')
		.fab(@click="add")

			// transition(:css="false" @leave="(el, done) => motions.cube.leave(done)")
				q-card-section(
					v-if='showAdd'
					v-motion='"cube"'
					:initial="{ opacity: 0, y: 100 }"
					:enter="{ opacity: 1, y: 0, scale: 1, }"
					:leave="{ opacity: 0, y: -100 }"
					)
					.hd Новое приложение

		q-card-section
			.row.q-gutter-x-md
				RouterLink(to='/assistent') Assistent
				RouterLink(to='/test') Test
		q-card-section
			.hd Приложения
		q-card-section
			BaseTree(:treeData="myApps")

</template>

<style scoped lang='scss'>
.q-page {
	display: flex;
	justify-content: center;
	align-items: start;
}

.mycontainer {
	background: pink;
	position: relative;
	display: flex;
	gap: .5rem;
	justify-content: start;
}

.adddialog {
	background: #fff;
	width: 600px;
}

.card {
	width: 600px;
	border-radius: var(--rad);
	box-shadow: var(--shad);
	background: #fff;
	position: relative;
}

.fab {
	position: absolute;
	top: 0;
	right: -3.5rem;
	width: 48px;
	height: 48px;
	background: #fff;
	border-radius: 48px;
	box-shadow: var(--shad);
	cursor: pointer;
	transform-origin: top left;
	z-index: 3;
}

.hd {
	font-size: 1.2rem;
}
</style>

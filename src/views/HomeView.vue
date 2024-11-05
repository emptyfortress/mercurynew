<script setup lang="ts">
import { ref, computed } from 'vue'
import BaseTree from '@/components/BaseTree.vue'
// import AppGrid from '@/components/AppGrid.vue'
import { myApps } from '@/stores/tree'
import { useStorage } from '@vueuse/core'
import { useRouter, useRoute } from 'vue-router'
import { useMotions } from '@vueuse/motion'
// import { directive as motion } from '@vueuse/motion'



const router = useRouter()
const route = useRoute()

const app = useStorage('app', localStorage)

const showAdd = ref(false)

const add = (() => {
	showAdd.value = !showAdd.value
})

const target = ref()

const motions = computed(() => {
	return useMotions()
})

</script>

<template lang="pug">
q-page(padding)
	.card
		.fab(@click="add")
			transition(:css="false" @leave="(el, done) => motions.cube.leave(done)")
				q-card-section(ref="target"
					v-if='showAdd'
					v-motion='"cube"'
					:initial="{ opacity: 0, y: 100 }"
					:enter="{ opacity: 1, y: 0, scale: 1, }"
					:leave="{ opacity: 0, y: 100 }"
					)
					.hd Новое приложение

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

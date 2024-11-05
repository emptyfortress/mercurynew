<script setup lang="ts">
import { ref } from 'vue'
import BaseTree from '@/components/BaseTree.vue'
// import AppGrid from '@/components/AppGrid.vue'
import { myApps } from '@/stores/tree'
import { useStorage } from '@vueuse/core'
import { useRouter, useRoute } from 'vue-router'
import { gsap } from 'gsap'
// import { Flip } from 'gsap/Flip'

// gsap.registerPlugin(Flip)

const router = useRouter()
const route = useRoute()

const splitterModel = ref(20)
const app = useStorage('app', localStorage)

const showAdd = ref(false)

const add = (() => {
	showAdd.value = true
	gsap.to('.card', {
		x: -200,
		width: 300,
		ease: 'power3.out',
		duration: 0.4,
	})
	gsap.to('.fab', {
		width: 400,
		height: 300,
		x: 350,
		borderRadius: '8px',
		ease: 'power3.out',
		duration: 0.3,
		delay: .4,
	})
	gsap.fromTo('.del', {
		y: 50,
		opacity: 0,
	}, {
		y: 0,
		opacity: 1,
		ease: 'power3.out',
		duration: 0.2,
		delay: .8,
	})
})
</script>

<template lang="pug">
q-page(padding)
	.card
		.fab(@click="add")
			q-card-section.del(v-if='showAdd')
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

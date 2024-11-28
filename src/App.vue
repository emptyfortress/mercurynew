<script setup lang="ts">
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import { useStorage } from '@vueuse/core'
// import { gsap } from 'gsap'
import { useRouter, useRoute } from 'vue-router'
import {
	coverBeforeEnter,
	coverEnter,
	coverLeave,
	slideLeave,
	slideEnter,
	slideBeforeEnter,
} from '@/utils/utils'
// import { useMotion } from '@vueuse/motion'

const route = useRoute()
const router = useRouter()

const leftDrawer = ref(false)
const toggleLeftDrawer = () => {
	leftDrawer.value = !leftDrawer.value
}
const rightDrawer = ref(false)
const toggleRightDrawer = () => {
	rightDrawer.value = !rightDrawer.value
}

const app = useStorage('app', localStorage)

const cover = ref(true)
const mode = ref<any>('out-in')

router.afterEach((to, from) => {
	if (to.name == 'form' && from.name == 'process') {
		cover.value = false
		// mode.value = undefined
	} else {
		cover.value = true
		// mode.value = 'out-in'
	}
})

const leave = async (el: any, done: any) => {
	cover.value ? coverLeave(el, done) : slideLeave(el, done)
}

const beforeEnter = (el: any) => {
	cover.value ? coverBeforeEnter() : slideBeforeEnter(el)
}

const enter = async (el: any, done: any) => {
	cover.value ? coverEnter(el, done) : slideEnter(el, done)
}
</script>

<template lang="pug">
q-layout(view='hHh LpR fFf')
	// q-header.bg-primary.text-info(elevated)
	q-header(elevated)
		q-toolbar
			q-btn(dense flat round icon='mdi-menu' @click='toggleLeftDrawer')
			q-btn(dense flat round icon='mdi-home-roof' to="/")
			q-toolbar-title
				span(v-if='route.name == "home"') Конструктор приложений
				span(v-if='route.name == "process"') {{ app.label }}
			q-btn(dense flat round icon='menu' @click='toggleRightDrawer')

	q-drawer(v-model='leftDrawer' side='left' overlay bordered behavior="desktop")
		// drawer content

	q-drawer(v-model='rightDrawer' side='right' overlay bordered behavior="desktop")
	// drawer content

	q-page-container
		#cont
			router-view(v-slot="{ Component, route }")
				transition(@before-enter="beforeEnter" @enter="enter" @leave="leave" :css="false" :mode="mode")
					component(:is="Component")
</template>

<style scoped lang="scss">
header {
	line-height: 1.5;
	max-height: 100vh;
}

.logo {
	display: block;
	margin: 0 auto 2rem;
}

nav {
	width: 100%;
	font-size: 12px;
	text-align: center;
	margin-top: 2rem;
}

nav a.router-link-exact-active {
	color: var(--color-text);
}

nav a.router-link-exact-active:hover {
	background-color: transparent;
}

nav a {
	display: inline-block;
	padding: 0 1rem;
	border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
	border: 0;
}

@media (min-width: 1024px) {
	header {
		display: flex;
		place-items: center;
		padding-right: calc(var(--section-gap) / 2);
	}

	.logo {
		margin: 0 2rem 0 0;
	}

	header .wrapper {
		display: flex;
		place-items: flex-start;
		flex-wrap: wrap;
	}

	nav {
		text-align: left;
		margin-left: -1rem;
		font-size: 1rem;

		padding: 1rem 0;
		margin-top: 1rem;
	}
}

#cont {
	position: relative;
	// background: yellow;
}
</style>

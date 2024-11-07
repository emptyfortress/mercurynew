<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, RouterView } from 'vue-router'
import { useStorage } from '@vueuse/core'
import { myApps } from '@/stores/tree'
import { gsap } from 'gsap'

const leftDrawer = ref(false)
const toggleLeftDrawer = (() => {
	leftDrawer.value = !leftDrawer.value
})
const rightDrawer = ref(false)
const toggleRightDrawer = (() => {
	rightDrawer.value = !rightDrawer.value
})

const app = useStorage('app', localStorage)

const router = useRouter()

// const refresh = (() => {
// 	router.push('/')
// 	app.value.id = myApps[0].id
// 	app.value.text = myApps[0].text
// 	app.value.descr = myApps[0].descr
// 	app.value.type = myApps[0].type
// 	app.value.selected = myApps[0].
// })

const leave = async (el: any, done: any) => {
	let div = document.createElement('div')
	let cont = document.querySelector('#cont')
	await cont?.appendChild(div)
	await div.classList.add('cover')
	await gsap.to(div, {
		duration: 0.5,
		left: 0,
		ease: 'power3.out',
	})
	done()
	div.remove()
}
const beforeEnter = (el: any) => {
	let div = document.createElement('div')
	let cont = document.querySelector('#cont')
	cont?.appendChild(div)
	div.classList.add('cover')
}

const enter = async (el: any, done: any) => {
	let div = document.querySelector('.cover')
	await gsap.fromTo(
		'.cover',
		{
			left: 0,
		},
		{
			delay: 0.3,
			left: '100%',
			duration: 0.5,
			ease: 'power3.out',
		}
	)
	div?.remove()
	done()
}
</script>

<template lang="pug">
q-layout(view='hHh LpR fFf')
	q-header.bg-primary.text-white(elevated)
		q-toolbar
			q-btn(dense flat round icon='mdi-menu' @click='toggleLeftDrawer')
			q-btn(dense flat round icon='mdi-home-roof' to="/")
			q-toolbar-title
				|Конструктор приложений
				// |{{ app.text }}
			q-btn(dense flat round icon='menu' @click='toggleRightDrawer')

	q-drawer(v-model='leftDrawer' side='left' overlay bordered behavior="desktop")
		// drawer content

	q-drawer(v-model='rightDrawer' side='right' overlay bordered behavior="desktop")
	// drawer content

	q-page-container
		#cont
			router-view(v-slot="{ Component, route }")
				transition(@before-enter="beforeEnter" @enter="enter" @leave="leave" :css="false" mode="out-in")
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

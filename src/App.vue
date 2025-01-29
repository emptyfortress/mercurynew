<script setup lang="ts">
import { ref, computed } from 'vue'
import {
	coverBeforeEnter,
	coverEnter,
	coverLeave,
	slideLeaveLeft,
	slideLeaveRight,
	slideEnterFromLeft,
	slideEnterFromRight,
	slideBeforeEnter,
} from '@/utils/utils'
import { RouterView } from 'vue-router'
import { useStorage } from '@vueuse/core'
import { useRouter, useRoute } from 'vue-router'
import Drawer from '@/components/Drawer.vue'
import IconHome from '@/components/icons/IconHome.vue'

const route = useRoute()
const router = useRouter()

const rightDrawer = ref(false)
const toggleRightDrawer = () => {
	rightDrawer.value = !rightDrawer.value
}

const app = useStorage('app', localStorage)

const cover = ref(0)

const mode = ref<any>('out-in')

router.afterEach((to, from) => {
	if (to.name == 'form' && from.name == 'process') {
		cover.value = 1
	} else if (to.name == 'process' && from.name == 'form') {
		cover.value = 2
	} else {
		cover.value = 0
	}
})

const leave = (el: any, done: any) => {
	if (cover.value == 2) return slideLeaveRight(el, done)
	if (cover.value == 1) return slideLeaveLeft(el, done)
	if (cover.value == 0) return coverLeave(el, done)
}

const beforeEnter = (el: any) => {
	if (cover.value == 2) return slideBeforeEnter()
	if (cover.value == 1) return slideBeforeEnter()
	if (cover.value == 0) return coverBeforeEnter()
}

const enter = (el: any, done: any) => {
	if (cover.value == 2) return slideEnterFromLeft(el, done)
	if (cover.value == 1) return slideEnterFromRight(el, done)
	if (cover.value == 0) return coverEnter(el, done)
}
</script>

<template lang="pug">
q-layout(view='hHh LpR fFf')
	q-header(elevated)
		q-toolbar
			q-btn(dense flat round @click='$router.push("/")')
				IconHome.home
			q-toolbar-title
				span(v-if='route.name == "home"') Конструктор приложений
				span(v-else) Настройка приложения "{{ app.label }}"
			q-btn(dense flat round icon='menu' @click='toggleRightDrawer')

	Drawer

	q-drawer(v-model='rightDrawer' side='right' overlay bordered behavior="desktop")
		q-list.q-mt-lg
			q-item(clickable to='/bugs')
				q-item-section(avatar)
					q-icon(name="mdi-bug" color="primary")
				q-item-section
					q-item-label Баги

				q-item-section(avatar)
					q-icon(name="mdi-test-tube" color="primary")
				q-item-section
					q-item-label Temp

			q-item(clickable to='/tmp1')
				q-item-section(avatar)
					q-icon(name="mdi-test-tube" color="primary")
				q-item-section
					q-item-label Temp 1

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

.home {
	font-size: 1.5rem;
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

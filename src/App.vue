<script setup lang="ts">
import { ref, computed, } from 'vue'
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

router.beforeEach((to, from, next) => {
	if (from.meta.count !== undefined) {
		cover.value = to.meta.count - from.meta.count
		console.log(cover.value)
		next()
	}
	else next()
})

const calcLeave = computed(() => {
	if (cover.value == 19) {
		return 'fadeOutLeft'
	}
	if (cover.value == -19) {
		return 'fadeOutRight'
	}
	if (cover.value > 0) {
		return 'fadeOutTop'
	}
	if (cover.value < 0) {
		return 'fadeOutBottom'
	}
})

const calcEnter = computed(() => {
	if (cover.value == 19) {
		return 'fadeInRight'
	}
	if (cover.value == -19) {
		return 'fadeInLeft'
	}
	if (cover.value > 0) {
		return 'fadeInBottom'
	}
	if (cover.value < 0) {
		return 'fadeInTop'
	}
})

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

	q-page-container
		#cont
			router-view(v-slot="{ Component, route }")
				transition(
					:leave-active-class='calcLeave'
					:enter-active-class='calcEnter'
					mode='out-in'
					)
					component(:is="Component")


</template>

<style scoped lang="scss">
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

	.logo {
		margin: 0 2rem 0 0;
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
}
</style>

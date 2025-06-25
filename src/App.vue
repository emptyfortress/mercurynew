<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { RouterView } from 'vue-router'
import { useStorage } from '@vueuse/core'
import { useRouter, useRoute } from 'vue-router'
import Drawer from '@/components/Drawer.vue'
import RDrawer from '@/components/RDrawer.vue'
// import IconHome from '@/components/icons/IconHome.vue'
import { useApps } from '@/stores/apps'
import { useIdle, useCounter } from '@vueuse/core'
import { useMotion } from '@vueuse/motion'
import { useQuasar } from 'quasar'

const route = useRoute()
const router = useRouter()
const myapps = useApps()

const rightDrawer = ref(false)

const app = useStorage('app', localStorage)

const cover = ref(0)

router.beforeEach((to, from, next) => {
	if (from.meta.count !== undefined) {
		cover.value = to.meta.count - from.meta.count
		next()
	} else next()
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
	if (cover.value == 0) {
		return ''
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
	if (cover.value == 0) {
		return ''
	}
})

const nav = () => {
	router.push('/')
	// if (myapps.groupPath.length > 0 && myapps.groupPath == route.fullPath.toString()) {
	// 	router.push(myapps.path)
	// 	myapps.setGroupPath('')
	// } else if (myapps.groupPath.length > 0) {
	// 	router.push(myapps.groupPath)
	// } else if (myapps.path == route.fullPath.toString()) {
	// 	router.push('/')
	// } else if (myapps.groupPath.length == 0) {
	// 	router.push(myapps.path)
	// }
}

const helpMode = ref(false)

const toggleBug = () => {
	helpMode.value = false
	rightDrawer.value = !rightDrawer.value
}
const toggleHelp = () => {
	helpMode.value = true
	rightDrawer.value = !rightDrawer.value
}

const buttonRef = ref<HTMLButtonElement | null>(null)
const isAnimating = ref(false)

const { idle, reset } = useIdle(5000)
const { inc, count } = useCounter()

const attention = computed(() => {
	return isAnimating.value && idle.value
})

watch(idle, async (idleValue) => {
	if (idleValue) {
		inc()
		setTimeout(() => {
			reset()
		}, 5000)

		if (count.value == 3 && isAnimating.value) {
			count.value = 0
			reset()
			jump()
		}
	}
})

const { apply } = useMotion(buttonRef, {
	enter: {
		x: 0,
		rotate: 0,
		scale: 1,
	},
	fly1: {
		x: -600,
		scale: 1,
		rotate: 0,
	},
	fly2: {
		scale: 2,
		rotate: 0,
	},
	fly3: {
		scale: 1,
		rotate: 0,
	},
	fly4: {
		rotate: 720,
		duration: 1000,
	},
	fly5: {
		x: 0,
		rotate: 0,
	},
})

// const off = () => {
// 	isAnimating.value = false
// 	// toggleHelp()
// }
const jump = async () => {
	await apply('fly1')
	await apply('fly2')
	await apply('fly3')
	await apply('fly4')
	await apply('fly5')
	reset()
}

const $q = useQuasar()
const refresh = () => {
	$q.notify({
		icon: 'mdi-alert',
		color: 'negative',
		message: 'Страница изменена другим пользователем. Ваши изменения не сохранены.',
		position: 'center',
		progress: true,
	})
}
</script>

<template lang="pug">
q-layout(view='hHh LpR fFf')
	q-header(elevated)
		q-toolbar
			q-btn(dense flat round @click='nav')
				img(src='@/assets/img/kp_logo.svg')
			q-toolbar-title( @click='nav')
				span(v-if='route.name == "home"') Конструктор приложений
				span(v-else) Настройка приложения "{{ app.label }}"

			.group.ddis(v-if='route.name !== "home"')
				q-avatar(size='28px' color="positive" text-color="white" @click='refresh') РЛ
					q-tooltip Роза Львовна
				q-avatar(size='28px' color="warning" text-color="black" @click='refresh') СК
					q-tooltip Сирень Крокодиловна
				.save Сохранение...

			q-avatar.ddis(size='md')
				img(src="https://cdn.quasar.dev/img/avatar.png")
			q-btn(dense flat round icon='mdi-menu' @click='toggleBug')
			// q-btn(dense flat round icon='mdi-cog' @click='toggleBug')
			// q-btn(ref='buttonRef' dense flat round icon='mdi-information-outline' @click='off' :class='{bounce: attention}')

	Drawer
	RDrawer(v-model="rightDrawer" :help='helpMode')

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
.bounce {
	animation: bounce-alt 1s linear 3;
	animation-fill-mode: none;
}
@keyframes bounce-alt {
	from,
	20%,
	53%,
	80%,
	to {
		animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
		transform: translate3d(0, 0, 0);
	}
	40%,
	43% {
		animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
		transform: translate3d(0, -30px, 0);
	}
	70% {
		animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
		transform: translate3d(0, -15px, 0);
	}
	90% {
		transform: translate3d(0, -4px, 0);
	}
}
.animate-bounce-alt {
	animation: bounce-alt 1s linear infinite;
	transform-origin: center bottom;
}
.group {
	font-size: 0.7rem;
	display: flex;
	gap: 0.5rem;
	justify-content: start;
	align-items: center;
	margin-right: 3rem;
	.q-avatar {
		cursor: pointer;
	}
}
.q-toolbar__title {
	cursor: pointer;
}
.save {
	margin-left: 3rem;
}
</style>

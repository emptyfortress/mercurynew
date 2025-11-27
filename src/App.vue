<script setup lang="ts">
import { ref, computed, shallowRef, watch } from 'vue'
import { RouterView } from 'vue-router'
import { useStorage } from '@vueuse/core'
import { useRouter, useRoute } from 'vue-router'
import Drawer from '@/components/Drawer.vue'
import RDrawer from '@/components/RDrawer.vue'
import CifRu from '@/components/icons/CifRu.vue'
import CifGb from '@/components/icons/CifGb.vue'
import StreamlineEmergencyExitSolid from '@/components/icons/StreamlineEmergencyExitSolid.vue'
import OcticonTools from '@/components/icons/OcticonTools.vue'
import MdiCloudUploadOutline from '@/components/icons/MdiCloudUploadOutline.vue'
import Fab from '@/components/Fab.vue'
import Footer from '@/components/Footer.vue'
import HealthiconsGuideDogfrom from '@/components/icons/HealthiconsGuideDog.vue'
import HelpModal from '@/components/HelpModal.vue'
import { useAppTour } from '@/tour'

const route = useRoute()
const { startTour } = useAppTour()

watch(
	() => route.meta.hideScroll,
	(hideScroll) => {
		if (hideScroll) {
			document.documentElement.style.overflow = 'hidden'
		} else {
			document.documentElement.style.overflow = ''
		}
	},
	{ immediate: true }
)

const router = useRouter()

const rightDrawer = ref(false)

const app = useStorage('app', localStorage)

const cover = ref(0)

router.beforeEach((to, from, next) => {
	// Безопасно читаем count (0, если не указан)
	const toCount = typeof to.meta.count === 'number' ? to.meta.count : 0
	const fromCount = typeof from.meta.count === 'number' ? from.meta.count : 0
	cover.value = toCount - fromCount
	next()
})

const leaveClass = computed(() => {
	const v = cover.value
	if (v === 19) return 'fadeOutLeft'
	if (v === -19) return 'fadeOutRight'
	if (v > 0) return 'fadeOutTop'
	if (v < 0) return 'fadeOutBottom'
	return 'fadeOutTop' // безопасный дефолт на случай 0/NaN
})

const enterClass = computed(() => {
	const v = cover.value
	if (v === 19) return 'fadeInRight'
	if (v === -19) return 'fadeInLeft'
	if (v > 0) return 'fadeInBottom'
	if (v < 0) return 'fadeInTop'
	return 'fadeInBottom' // безопасный дефолт на случай 0/NaN
})

const nav = () => {
	router.push('/')
}

const helpMode = ref(false)

const toggleBug = () => {
	helpMode.value = false
	rightDrawer.value = !rightDrawer.value
}

const lang = [
	{
		id: 0,
		label: 'Русский',
		icon: CifRu,
	},
	{
		id: 1,
		label: 'English',
		icon: CifGb,
	},
]

const currentLang = shallowRef({
	id: 0,
	label: 'Русский',
	icon: CifRu,
})
const changeLang = (e: any) => {
	currentLang.value = e
}
const calcClass = (num: number) => {
	if (currentLang.value.id == num) return 'selected'
}

const user = [
	{
		id: 0,
		icon: OcticonTools,
		label: 'Настройки конструктора',
		action: () => router.push('/settings'),
	},
	{
		id: 1,
		icon: MdiCloudUploadOutline,
		label: 'Управление публикациями',
		action: () => router.push('/publications'),
	},
	{
		id: 2,
		icon: StreamlineEmergencyExitSolid,
		label: 'Выход',
		action: undefined,
	},
]

const topLevelKey = (route: any) => route.matched[0]?.path || route.path

const title = computed(() => {
	if (route.matched[0]?.path === '/:id?') {
		return 'Конструктор приложений'
	}

	if (route.path.startsWith('/timeline')) {
		return 'Ход исполнения'
	}

	if (route.path.startsWith('/settings')) {
		return 'Настройка конструктора'
	}

	if (route.path.startsWith('/map')) {
		return 'Публикация версии'
	}

	if (route.path.startsWith('/publications')) {
		return 'Управление публикациями'
	}

	return `Настройка приложения "${app.value.label}"`
})

// --- Help modal state ---
const showHelpModal = ref(false)
const helpLabel = ref('Помощь')

const handleOk = () => {
	startTour(route)
}
const handleCancel = (menuLabel: string) => {
	console.log('Help modal Cancel clicked', menuLabel)
}
</script>

<template lang="pug">
q-layout(view='hHh LpR fFf')
  q-header(elevated)
    q-toolbar
      q-btn(dense flat round @click='nav' data-tour='home')
        img(src='@/assets/img/kp_logo.svg')
        q-tooltip Домой
      q-toolbar-title {{ title }}
      .lang
        component(:is='currentLang.icon')
        q-menu(transition-show="jump-down" transition-hide="jump-up")
          q-list
            q-item(clickable v-for="item in lang" :key='item.id' @click="changeLang(item)" v-close-popup :class="calcClass(item.id)")
              q-item-section(side)
                component(:is='item.icon')
              q-item-section {{ item.label }}

      q-avatar(size='md')
        img(src="https://cdn.quasar.dev/img/avatar.png")
        q-menu(transition-show="jump-down" transition-hide="jump-up")
          q-list
            q-item(clickable  v-close-popup)
              q-item-section(side)
                q-avatar(size='26px')
                  img(src="https://cdn.quasar.dev/img/avatar.png")
              q-item-section Администратор

            q-item(clickable v-for="item in user" :key='item.id' @click="item.action" v-close-popup)
              q-item-section(side)
                component.ic(:is='item.icon')
              q-item-section {{ item.label }}

      q-btn.q-mx-sm(dense flat round icon='mdi-help-circle-outline')
        q-menu(transition-show="jump-down" transition-hide="jump-up")
          q-list
            q-item(clickable @click="helpLabel = 'Помощь'; showHelpModal = true" v-close-popup)
              q-item-section(side)
                q-icon(name="mdi-book" color="primary")
              q-item-section Документация
            q-item(clickable @click="helpLabel = 'Гид'; showHelpModal = true" v-close-popup)
              q-item-section(side)
                HealthiconsGuideDogfrom.ic
              q-item-section Гид

      q-btn(dense flat round icon='mdi-menu' @click='toggleBug')

  Drawer
  RDrawer(v-model="rightDrawer" :help='helpMode')

  q-page-container
    #cont
      router-view(v-slot="{ Component, route }")
        transition(
          :leave-active-class="leaveClass"
          :enter-active-class="enterClass"
          mode='out-in'
          )
          component(:is="Component" :key="topLevelKey(route)")

  Footer
  Fab

  // Help modal component
  HelpModal(v-model="showHelpModal" :menu-label="helpLabel" @ok="handleOk" @cancel="handleCancel")
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
.lang {
	margin: 0 1rem;
	margin-top: 5px;
	cursor: pointer;
	svg {
		width: 28px;
		height: 28px;
	}
}
:deep(.q-item.selected) {
	background: var(--selection);
}
.ic {
	font-size: 1.7rem;
	color: $primary;
}
</style>

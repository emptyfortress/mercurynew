<script setup lang="ts">
import { ref, computed, watch, type Component } from 'vue'
import { RouterLink } from 'vue-router'
import { useRouter, useRoute } from 'vue-router'
import { useStorage } from '@vueuse/core'
import AntDesignFormOutlined from '@/components/icons/AntDesignFormOutlined.vue'
import { useApps } from '@/stores/apps'
//
const iconModules: any = import.meta.glob('@/components/icons/list/*.vue')

const mini = useStorage('mini', true)
const app = useStorage('app', localStorage)
const myapps = useApps()

const router = useRouter()
const route = useRoute()

const pages = [
	{
		id: 1,
		title: 'Процесс',
		icon: 'mdi-shuffle-variant',
		url: '/process',
	},
	{
		id: 2,
		title: 'Формы',
		icon: 'mdi-list-box-outline',
		url: '/forms',
	},
	{
		id: 3,
		title: 'Роли',
		icon: 'mdi-account-tie',
		url: '/roles',
	},
	{
		id: 5,
		title: 'Поля, статусы',
		icon: 'mdi-nut',
		url: '/fields',
	},
	{
		id: 4,
		title: 'Папки',
		icon: 'mdi-folder-search-outline',
		url: '/lists',
	},
]

const draw = ref(true)

const back = computed(() => {
	return route.meta.back
})
const tool = computed(() => {
	return route.meta.toolbar
})

const calcWidth = computed(() => {
	return mini.value ? 60 : 130
})

const iconComp = ref<Component | null>(null)

async function loadIcon(iconName?: string) {
	if (!iconName) {
		iconComp.value = null
		return
	}

	// ключ формируется по имени файла, например IconTravel.vue
	const key = `/src/components/icons/list/${iconName}.vue`

	if (iconModules[key]) {
		iconComp.value = (await iconModules[key]()).default
	} else {
		console.warn(`Иконка "${iconName}" не найдена`)
		iconComp.value = null
	}
}

// Загружаем при первом рендере
loadIcon(app.value?.pic?.name)

// Следим за изменениями app
watch(
	() => app.value?.pic?.name,
	(newFile) => {
		loadIcon(newFile)
	}
)
const toHome = () => {
	router.push(`/${myapps.currentApp?.id}`)
}
</script>

<template lang="pug">
q-drawer(v-model='draw' side='left' behavior="desktop" :width="calcWidth")

	q-btn.back(v-if='back' round
		v-motion
		:initial='{ x: -200, opacity: 0 }'
		:enter='{ x: 0, opacity: 1, transition: { stiffness: 190, damping: 23, delay: 500 } }'
		@click="toHome" size="16px" color='primary') 
		component(:is="iconComp")

	q-btn.back1(
		v-if='route.meta.back1',
		round,
		color="white",
		text-color="primary"
		@click="router.back()",
		icon="mdi-arrow-left",
		) 

	.toolbar(v-if="tool"
		v-motion
		:initial='{ x: -200, opacity: 0 }'
		:enter='{ x: 0, opacity: 1, transition: { stiffness: 190, damping: 23, delay: 500 } }'
		)
		q-list()
			RouterLink(v-for="page in pages" :key="page.id" :to="page.url")
				q-item(clickable v-ripple )
					q-item-section(:side="!mini")
						AntDesignFormOutlined.ic(v-if='page.id == 2')
						q-icon(v-else :name="page.icon" color="primary" size="22px")
					q-tooltip(v-if='mini' anchor="center end" self="center start") {{ page.title }}
					q-item-section(v-if='!mini')
						q-item-label {{ page.title }}

	q-btn.mini(v-if='tool' flat round color="primary" @click="mini = !mini") 
		q-icon(v-if='mini' name="mdi-forwardburger" color="primary")
		q-icon(v-else name="mdi-backburger" color="primary")
</template>

<style scoped lang="scss">
:deep(.q-drawer) {
	background: transparent;
	height: 100%;
}

.mini {
	position: fixed;
	bottom: 6rem;
	left: 0.5rem;
}

:deep(.q-drawer__content) {
	display: flex;
	flex-direction: column;
	justify-content: start;
	align-items: center;
	position: relative;
}

.toolbar {
	width: calc(100% - 5px);
	background: #fff;
	box-shadow: 0 5px 5px rgba(0, 0, 0, 0.2);
	margin-top: 120px;
}

a {
	text-decoration: none;
	color: $primary;
}

a.router-link-active .q-item {
	background: $accent;
}

.back {
	position: absolute;
	top: 1.8rem;
	svg {
		width: 32px;
		height: 32px;
	}
}
.back1 {
	position: absolute;
	top: 1.8rem;
}
.house {
	position: absolute;
	top: 6.6rem;
	background: #fff;
	color: $primary;
	min-height: 48px;
}
.ic {
	width: 24px;
	height: 24px;
}
</style>

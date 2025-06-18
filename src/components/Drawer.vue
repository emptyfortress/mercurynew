<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useRouter, useRoute } from 'vue-router'
import { useStorage } from '@vueuse/core'
import AntDesignFormOutlined from '@/components/icons/AntDesignFormOutlined.vue'

const mini = useStorage('mini', true)

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
// TODO: move back batton in !mini mode
</script>

<template lang="pug">
q-drawer(v-model='draw' side='left' behavior="desktop" :width="calcWidth")
	q-btn.back(v-if='back'
		v-motion
		:initial='{ x: -200, opacity: 0 }'
		:enter='{ x: 0, opacity: 1, transition: { stiffness: 190, damping: 23, delay: 500 } }'
		icon="mdi-arrow-left" @click="router.back()" size="md") 

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
	bottom: 4rem;
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
	margin-top: 150px;
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
	background: #fff;
	color: $primary;
	min-height: 48px;
}
.ic {
	width: 24px;
	height: 24px;
}
</style>

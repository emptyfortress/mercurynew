<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const modelValue = defineModel<boolean>()

const pages = [
	{
		id: 1,
		title: 'Процесс',
		icon: 'mdi-shuffle-variant',
		url: 'process',
	},
	{
		id: 2,
		title: 'Формы',
		icon: 'mdi-list-box-outline',
		url: '/forms',
	},
	{
		id: 5,
		title: 'Статусы',
		icon: 'mdi-state-machine',
		url: '/statuses',
	},
	{
		id: 3,
		title: 'Роли',
		icon: 'mdi-account',
		url: '/roles',
	},
	{
		id: 4,
		title: 'Реестры',
		icon: 'mdi-script-text-outline',
		url: 'lists',
	},
]
</script>

<template lang="pug">
q-drawer(v-model='modelValue' side='left' behavior="desktop" :width="60")
	q-btn.back(v-if='route.name == "form"'
		v-motion
		:initial='{x: -200, opacity: 0}'
		:enter='{x: 0, opacity: 1, transition: {stiffness: 190, damping: 23, delay: 1500}}'
		icon="mdi-arrow-left" @click="router.back()" size="md") 
	.toolbar
		q-list()
			RouterLink(v-for="page in pages" :key="page.id" :to="page.url")
				q-item(clickable v-ripple )
					q-item-section
						q-icon(:name="page.icon" color="primary" size="22px")
</template>

<style scoped lang="scss">
:deep(.q-drawer) {
	background: transparent;
	height: 100%;
}
:deep(.q-drawer__content) {
	display: flex;
	flex-direction: column;
	justify-content: start;
	align-items: center;
	position: relative;
}
.toolbar {
	background: #fff;
	box-shadow: var(--shad0);
	margin-top: 150px;
}
a {
	text-decoration: none;
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
</style>

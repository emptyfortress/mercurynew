<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useSimpleStore } from '@/stores/simpleStore'
import { useRazmetStore } from '@/stores/razmet'

const route = useRoute()
const router = useRouter()
const store = useSimpleStore()
const razmetStore = useRazmetStore()

const getRouteTab = () => {
	const value = route.query.tab
	return Array.isArray(value) ? value[0] : value
}

const activeTab = computed({
	get: () => getRouteTab() || 'setup',
	set: (val: string) => {
		router.replace({
			query: {
				...route.query,
				tab: val,
			},
		})
	},
})

const active = ref('Документооборот')

const columns = [
	{ name: 'name', label: 'Название', field: 'name', align: 'left' },
	{ name: 'type', label: 'Тип', field: 'type', align: 'left' },
	{ name: 'author', label: 'Автор', field: 'author', align: 'left' },
	{ name: 'createdAt', label: 'Создано', field: 'createdAt', align: 'left' },
	{ name: 'isUsed', label: 'Используется', field: 'isUsed', align: 'center' },
]
</script>

<template lang="pug">
div
	.zg
		|Разметки для вида
		span {{ store.selectedElement?.text }}
	q-tabs(v-model="activeTab" align="left" activeColor="primary" indicatorColor="primary")
		q-tab(name="setup" label="Разметки")
		q-tab(name="condition" label="Условия выбора разметок")

	q-tab-panels(v-model="activeTab" animated)
		q-tab-panel(name="setup")
			q-list
				q-expansion-item.my-expansion(v-for="item in razmetStore.projects" :key="item.name" v-model="item.expanded" switchToggleSide)
					template(v-slot:header)
						q-item-section
							.project
								|Проект:
								span {{ item.name}}
						q-item-section
							.project
								|Разметок:
								span {{ item.views.length}}
						q-item-section
							q-radio(v-model="active" :val="item.name" label="Активный проект")
					q-table(:rows="item.views" :columns="columns" row-key="id" flat)
						template(v-slot:body-cell-isUsed="props")
							q-td(:props="props")
								q-badge(v-if="props.value" color="positive" label="Да")
								q-badge(v-else color="grey" label="Нет")
</template>

<style scoped lang="scss">
.project {
	span {
		font-weight: 600;
		margin-left: 0.5rem;
	}
}
.zg {
	font-size: 1.2rem;
	span {
		margin-left: 1rem;
		font-weight: 600;
	}
}
.q-tab-panels {
	background: transparent;
	border-top: 1px solid #999;
}
.q-expansion-item {
	background: var(--bgLight);
	border-radius: 0.25rem;
	margin-bottom: 0.5rem;
	cursor: pointer;
}

.my-expansion :deep(.q-expansion-item__container > .q-item .q-focus-helper) {
	display: none;
}
.my-expansion :deep(.q-expansion-item__container > .q-item:hover) {
	border-radius: 0.25rem;
	box-shadow: var(--shad0);
}
.q-expansion-item--expanded {
	background: #fff;
}
.inside {
	padding: 1rem;
}
</style>

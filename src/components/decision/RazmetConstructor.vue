<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useSimpleStore } from '@/stores/simpleStore'

const route = useRoute()
const router = useRouter()
const store = useSimpleStore()

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
			div fucck
</template>

<style scoped lang="scss">
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
</style>

<script setup lang="ts">
import { computed } from 'vue'
import { useApps } from '@/stores/apps'
import { useServers } from '@/stores/servers'
import { useStorage } from '@vueuse/core'
import { useTitle } from '@vueuse/core'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const title = useTitle()
title.value = 'Управление публикациями'

const myapps = useApps()
const server = useServers()

const db = [
	{
		id: 0,
		label: 'DV-Test',
	},
	{
		id: 1,
		label: 'DV-Main',
	},
	{
		id: 2,
		label: 'DV-Prod',
	},
]

// Текущий выбор из пути /publications/<type>/<id>
const current = computed(() => {
	const m = route.path.match(/^\/publications\/(apps|db)\/([^/]+)/)
	return { type: m?.[1] ?? null, id: m?.[2] ?? null }
})

function isSelected(type: 'apps' | 'db', id: string | number) {
	return current.value.type === type && String(current.value.id) === String(id)
}

function linkTo(type: 'apps' | 'db', id: string | number) {
	return `/publications/${type}/${id}`
}

function onItemClick(e: MouseEvent, to: string, type: 'apps' | 'db', id: string | number) {
	// Даем пользователю открыть в новой вкладке (Cmd/Ctrl или средняя кнопка)
	if (e.metaKey || e.ctrlKey || e.button === 1) {
		window.open(to, '_blank')
		return
	}

	// Переключатель: повторный клик — сброс на /publications
	if (isSelected(type, id)) {
		e.preventDefault()
		router.push('/publications')
	} else {
		// Берём навигацию на себя, чтобы не было двойного перехода
		e.preventDefault()
		router.push(to)
	}
}

const panels = useStorage('settings_expansion_state', {
	users: false,
	apps: false,
	db: false,
})
</script>

<template lang="pug">
q-page(padding)
	.cont()
		.grid
			q-list(separator)

				q-expansion-item(
					v-model="panels.apps"
					expand-separator
					header-class='exphd'
					label="Приложения")

					q-list
						q-item(clickable v-for="app in myapps.flatApps"
							:to="linkTo('apps', app.id)"
              @click="onItemClick($event, linkTo('apps', app.id), 'apps', app.id)"
							:class="{ selected: isSelected('apps', app.id) }"
							:key="`app-${app.id}`"
							)
							q-item-section(side)
								component.ic(:is="app.pic")
							q-item-section
								q-item-label {{ app.label }}

				q-expansion-item(
					v-model="panels.db"
					expand-separator
					header-class='exphd'
					label="Базы данных")
					q-list
						q-item(clickable v-for="server in db"
							:to="linkTo('db', server.id)"
							@click="onItemClick($event, linkTo('db', server.id), 'db', server.id)"
							:key="`db-${server.id}`"
							:class="{ selected: isSelected('db', server.id) }"
							)
							q-item-section(side)
								q-icon(name="mdi-database-outline" color="primary")
							q-item-section
								q-item-label {{ server.label }}


			div
				router-view(v-slot="{ Component, route }")
					transition(name='slide-right' mode='out-in')
						component(:is="Component" :key="route.fullPath")

</template>

<style scoped lang="scss">
.cont {
	max-width: 1440px;
	margin: 0 auto;
	// background: #ccc;
}
.hd {
	font-size: 1.5rem;
	text-align: center;
	margin-bottom: 1rem;
	.q-icon {
		margin-bottom: 4px;
		margin-right: 0.5rem;
	}
}
:deep(.exphd) {
	font-size: 1.1rem;
	color: $primary;
}
.ic {
	color: $primary;
	font-size: 1.5rem;
}
.grid {
	display: grid;
	grid-template-columns: 1fr 3fr;
	column-gap: 4rem;
	margin-top: 2rem;
}
.selected {
	border: 1px solid $primary;
}
</style>

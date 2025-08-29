<script setup lang="ts">
import { useRoute } from 'vue-router'
// import OcticonTools from '@/components/icons/OcticonTools.vue'
import { useApps } from '@/stores/apps'
import { useServers } from '@/stores/servers'
import { useStorage } from '@vueuse/core'
import { useTitle } from '@vueuse/core'
const title = useTitle()
title.value = 'Настройки конструктора'

const myapps = useApps()
const server = useServers()
const route = useRoute()

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

function isSelected(type: string, id: string | number) {
	return route.params.id == String(id) && route.path.includes(`/settings/${type}/`)
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
		// .hd
			OcticonTools.q-mr-md
			|Настройки конструктора приложений

		.grid
			q-list(separator)

				q-expansion-item(
					v-model="panels.users"
					expand-separator
					header-class='exphd'
					label="Группы пользователей")

					q-list
						q-item(clickable v-for="user in server.userGroups"
							:class="{ selected: isSelected('users', user.id) }"
							:to="`/settings/users/${user.id}`"
							:key="`user-${user.id}`"
							)

							q-item-section(side)
								q-icon(name="mdi-account-multiple" color="primary")
							q-item-section
								q-item-label {{ user.name }}

				q-expansion-item(
					v-model="panels.apps"
					expand-separator
					header-class='exphd'
					label="Приложения")

					q-list
						q-item(clickable v-for="app in myapps.flatApps"
							:to="`/settings/apps/${app.id}`"
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
							:to="`/settings/db/${server.id}`"
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
	max-width: 1400px;
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

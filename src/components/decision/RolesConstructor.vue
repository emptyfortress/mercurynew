<script setup lang="ts">
import { ref } from 'vue'
import type { QTableColumn } from 'quasar'
import RoleDialog from '@/components/decision/RoleDialog.vue'
import { useRouter } from 'vue-router'
import { useSimpleStore } from '@/stores/simpleStore'

const tab = ref('roles')
const dialog = ref(false)

const store = useSimpleStore()

const columns = ref<QTableColumn[]>([
	{ name: 'label', label: 'Название', field: 'label', align: 'left', sortable: true },
	{ name: 'common', label: 'Общая роль', field: 'common', align: 'center', sortable: true },
	{ name: 'action', label: '', field: 'action', align: 'right' },
])

const pagination = ref({
	rowsPerPage: 10,
})

const remove = (id: string) => {
	store.removeRole(id)
}

const add = (role: { label: string; common: boolean }) => {
	console.log(role)
	store.addRole(role)
}

const showDialog = () => {
	dialog.value = !dialog.value
}

const router = useRouter()

const goto = (id: string) => {
	const currentPath = router.currentRoute.value.path
	router.push(`${currentPath}/${id}`)
}
</script>

<template lang="pug">
.q-tabs
	q-tabs(
		v-model="tab"
		align="left"
	)
		q-tab(name="roles" label="Роли")
		q-tab(name="matrix" label="Матрица доступа")

	q-tab-panels(v-model="tab" animated)
		q-tab-panel(name="roles")
			q-table(
				:rows="store.roles"
				:columns="columns"
				:pagination="pagination"
				row-key="label"
				flat
			)
				template(v-slot:body-cell-common="props")
					q-td(:props="props")
						q-checkbox(v-model="props.row.common" dense disable)
				template(v-slot:body-cell-action="props")
					q-td(:props="props")
						q-btn(
							flat
							icon="mdi-pencil"
							dense
							color="primary"
							label='Настроить'
							size='sm'
							@click='goto(props.row.id)'
						)
						q-btn.q-ml-lg(
							icon="mdi-delete-outline"
							flat
							round
							dense
							color="primary"
						)
							q-menu
								q-list
									q-item(clickable @click="remove(props.row.id)" ).pink
										q-item-section Удалить


			q-btn.q-mt-md(
				fab
				round
				icon="mdi-plus"
				color="primary"
				@click="showDialog"
			)


		q-tab-panel(name="matrix")
			| Матрица доступа

RoleDialog(v-model="dialog" @add="add")
</template>

<style scoped lang="scss">
:deep(.q-tab-panels) {
	background: transparent;
	padding: 0;
}
:deep(.q-tab-panel) {
	padding-left: 0;
	padding-right: 0;
}
</style>

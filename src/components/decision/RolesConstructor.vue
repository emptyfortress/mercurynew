<script setup lang="ts">
import { ref } from 'vue'
import type { QTableColumn } from 'quasar'
import { uid } from 'quasar'
import RoleDialog from '@/components/decision/RoleDialog.vue'

interface Role {
	id: string
	label: string
	common: boolean
}

const tab = ref('roles')
const dialog = ref(false)

const roles = ref<Role[]>([
	{ id: '0', label: 'Все руководители', common: false },
	{ id: '1', label: 'Участник задания с отчетом', common: false },
	{ id: '2', label: 'Участник задания по документу', common: false },
	{ id: '3', label: 'Регистратор', common: false },
	{ id: '4', label: 'Ответственный', common: false },
	{ id: '5', label: 'Системная для WP', common: true },
	{ id: '6', label: 'Администратор УД', common: true },
	{ id: '7', label: 'Сотрудник ЛК КЭДО', common: true },
	{ id: '8', label: 'Все', common: true },
])

const columns = ref<QTableColumn[]>([
	{ name: 'label', label: 'Название', field: 'label', align: 'left', sortable: true },
	{ name: 'common', label: 'Общая роль', field: 'common', align: 'center', sortable: true },
	{ name: 'action', label: '', field: 'action', align: 'right' },
])

const pagination = ref({
	rowsPerPage: 10,
})

const remove = (id: string) => {
	roles.value = roles.value.filter((role) => role.id !== id)
}

const add = (role: { label: string; common: boolean }) => {
	console.log(role)
	roles.value.unshift({
		id: uid(),
		...role,
	})
}

const showDialog = () => {
	dialog.value = !dialog.value
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
				:rows="roles"
				:columns="columns"
				:pagination="pagination"
				row-key="label"
				flat
			)
				template(v-slot:body-cell-common="props")
					q-td(:props="props")
						q-checkbox(v-model="props.row.common" dense)
				template(v-slot:body-cell-action="props")
					q-td(:props="props")
						q-btn(
							icon="mdi-pencil"
							flat
							round
							dense
							color="primary"
						)
						q-btn.q-ml-md(
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

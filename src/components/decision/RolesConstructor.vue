<script setup lang="ts">
import { ref } from 'vue'
import type { QTableColumn } from 'quasar'
import RoleDialog from '@/components/decision/RoleDialog.vue'
import { useRouter } from 'vue-router'
import { useSimpleStore } from '@/stores/simpleStore'

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
const goto1 = () => {
	const currentPath = router.currentRoute.value.path
	router.push(`${currentPath}/matrix`)
}
</script>

<template lang="pug">
q-btn.q-my-md(unelevated color="primary" icon='mdi-plus-circle' label="Новая роль" @click="showDialog") 
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
			q-btn.q-mx-lg(
				flat
				icon="mdi-lock-smart"
				dense
				color="primary"
				label='Матрица доступа'
				size='sm'
				@click='goto1'
			)
			q-btn(
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

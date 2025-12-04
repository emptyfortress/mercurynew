<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { date } from 'quasar'
import type { QTableProps } from 'quasar'
import { storeToRefs } from 'pinia'
import { useLogEventsStore } from '@/stores/logevents'
import { useApps } from '@/stores/apps'
import { useRouter } from 'vue-router'

const props = defineProps({
	showAppColumn: {
		type: Boolean,
		default: false,
	},
	showDbColumn: {
		type: Boolean,
		default: true,
	},
})

const router = useRouter()
const myapps = useApps()

const logEventsStore = useLogEventsStore()
const { events } = storeToRefs(logEventsStore)

const isReady = ref(false)
onMounted(() => {
	setTimeout(() => {
		isReady.value = true
	}, 1500)
})

const tableRows = computed(() => {
	return isReady.value ? events.value : []
})

const goto = (name: string) => {
	let tmp = myapps.pathForEvent(name)
	if (tmp) {
		router.push(tmp)
	}
}

const allColumns: NonNullable<QTableProps['columns']> = [
	{
		name: 'date',
		required: true,
		label: 'Дата',
		align: 'left',
		field: 'date',
		sortable: true,
		format: (val) => (val ? date.formatDate(val, 'DD.MM.YY HH:mm') : ''),
	},
	{
		name: 'user',
		required: true,
		label: 'Пользователь',
		align: 'left',
		field: 'user',
		sortable: true,
	},
	{
		name: 'app',
		required: true,
		label: 'Приложение',
		align: 'left',
		field: 'app',
		sortable: true,
	},
	{
		name: 'db',
		required: true,
		label: 'База данных',
		align: 'left',
		field: 'db',
		sortable: true,
	},
	{
		name: 'event',
		required: true,
		label: 'Событие',
		align: 'left',
		field: 'event',
		sortable: true,
	},
	{
		name: 'result',
		required: true,
		label: 'Результат',
		align: 'center',
		field: 'result',
		sortable: true,
	},
	{
		name: 'action',
		required: true,
		label: '',
		align: 'left',
		field: 'action',
		sortable: false,
	},
]

const conditionalColumns: Record<string, keyof typeof props> = {
	app: 'showAppColumn',
	db: 'showDbColumn',
}

const cols = computed(() => {
	return allColumns.filter((col) => {
		const propName = conditionalColumns[col.name]
		return propName ? props[propName] : true
	})
})
const page = {
	rowsPerPage: 7,
}
</script>

<template lang="pug">
.h7 Журнал событий
q-table(flat,
	:columns="cols"
	:rows="tableRows"
	row-key="id"
	color="primary"
	:pagination="page"
	)
	template(v-slot:body-cell-result='props')
		q-td.text-center(:props='props')
			q-icon(
				:name="props.row.result ? 'mdi-check-bold' : 'mdi-close-octagon'"
				:color="props.row.result ? 'positive' : 'negative'"
				size="20px"
			)

	template(v-slot:body-cell-event='props')
		q-td(:props='props')
			span {{ props.row.event }}
			q-icon.q-ml-md(name="mdi-message-text-outline" color="primary" v-if='props.row.reason.length > 0' size='20px')
				q-tooltip {{ props.row.reason }}

	template(v-slot:body-cell-action='props')
		q-td.text-right(:props='props' auto-width)
			q-btn(flat round icon="mdi-dots-vertical" color="primary" dense)
				q-menu
					q-list
						q-item(clickable @click='goto(props.row.app)')
							q-item-section(side)
								q-icon(name="mdi-pencil" color="primary")
							q-item-section Открыть версию
</template>

<style scoped lang="scss">
:deep(.q-field__control:before) {
	background: #fff;
}
</style>

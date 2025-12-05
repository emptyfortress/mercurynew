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

const reasonDialog = ref(false)
const currentReason = ref('')
const currentRow = ref<any>(null)

const showReason = (row: any) => {
	currentRow.value = row
	currentReason.value = row.reason
	reasonDialog.value = true
}

const saveReason = () => {
	if (currentRow.value) {
		currentRow.value.reason = currentReason.value
	}
	reasonDialog.value = false
}

const onHide = () => {
	currentRow.value = null
	currentReason.value = ''
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
			q-icon.q-ml-md(
				v-if='props.row.reason'
				name="mdi-message-text-outline"
				color="primary"
				size='20px'
				@click="showReason(props.row)"
				style="cursor: pointer")

	template(v-slot:body-cell-action='props')
		q-td.text-right(:props='props' auto-width)
			q-btn(flat round icon="mdi-dots-vertical" color="primary" dense)
				q-menu
					q-list
						q-item(clickable @click='goto(props.row.app)')
							q-item-section(side)
								q-icon(name="mdi-pencil" color="primary")
							q-item-section Открыть версию
q-dialog(v-model="reasonDialog" @hide="onHide")
	q-card(style="min-width: 500px;")
		q-btn.close(round color="negative" icon="mdi-close" v-close-popup)
		q-card-section
			.text-h6 Причина отказа в публикации
		.q-mx-md
			q-input(v-model="currentReason" dense type="textarea" outlined autogrow)
		q-card-actions.q-mx-sm.q-mt-xl(align="right")
			q-btn(flat label="Отмена" color="primary" v-close-popup)
			q-btn(unelevated label="Сохранить" color="primary" @click="saveReason")
</template>

<style scoped lang="scss">
.close {
	position: absolute;
	top: 0.5rem;
	right: 0.5rem;
	z-index: 1;
}
</style>

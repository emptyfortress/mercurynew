<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import type { QTableProps } from 'quasar'
// import Draggable from 'vuedraggable'
import TablerCopyPlus from '@/components/icons/TablerCopyPlus.vue'
import { useQuasar } from 'quasar'
import Server from '@/components/Server.vue'
// import { servers } from '@/stores/servers'

// const router = useRouter()
// const route = useRoute()
// const $q = useQuasar()

const cols: QTableProps['columns'] = [
	{
		name: 'current',
		required: true,
		label: 'Текущая',
		align: 'center',
		field: 'current',
		sortable: true,
	},
	{
		name: 'ver',
		required: true,
		label: 'Версия',
		align: 'left',
		field: 'ver',
		sortable: true,
	},
	{
		name: 'author',
		required: true,
		label: 'Автор',
		align: 'left',
		field: 'author',
		sortable: true,
	},
	{
		name: 'created',
		required: true,
		label: 'Дата создания',
		align: 'left',
		field: 'created',
		sortable: true,
	},
	{
		name: 'server',
		required: true,
		label: 'Опубликовано',
		align: 'left',
		field: 'server',
		sortable: true,
	},
	{
		name: 'action',
		required: true,
		label: '',
		align: 'left',
		field: 'action',
		sortable: true,
	},
]
const source = ref([
	{
		id: 3,
		ver: 'Версия 3',
		author: 'Орлов П.С.',
		created: '23.07.25',
		val: 3,
		server: '--',
	},
	{
		id: 2,
		ver: 'Роза 1',
		author: 'Роза Львовна',
		created: '21.07.25',
		val: 2,
		server: 'DV-test',
	},
	{
		id: 1,
		ver: 'Базовая',
		author: 'Орлов П.С.',
		created: '11.06.25',
		val: 1,
		server: 'DV-test, DV-prod',
	},
])

const remove1 = (id: number) => {
	let index = source.value.findIndex((el) => el.id == id)
	if (index !== undefined) {
		source.value.splice(index, 1)
	}
	radio.value = source.value[0].val
}

const add = () => {
	source.value.unshift({
		id: Date.now(), // Лучше Date.now() вместо index
		ver: `Версия ${source.value.length + 1}`,
		author: 'Орлов П.С.',
		created: '23.07.25',
		val: source.value.length + 1,
		server: '',
	})
}

const radio = ref(3)
</script>

<template lang="pug">
q-table(flat
	:columns="cols"
	:rows='source'
	row-key="id"
	color="primary"
	dense
	hide-bottom
)
	template(v-slot:body-cell-current='props')
		q-td(:props='props')
			q-radio(v-model="radio" dense :val='props.row.val')

	template(v-slot:body-cell-action='props')
		q-td(:props='props')
			.text-secondary
				q-btn(flat round dense @click="add" size='md') 
					TablerCopyPlus.ic
				q-btn(flat round dense icon="mdi-delete-outline" @click="remove1(props.row.id)" size='md') 


</template>

<style scoped lang="scss">
.cont {
	max-width: 1400px;
	margin: 0 auto;
}
.current {
	background: var(--selection);
}

.hd {
	font-size: 1.3rem;
	text-align: center;
}
.hd1 {
	font-size: 1rem;
	text-align: center;
	margin-bottom: 0.5rem;
	img {
		margin-bottom: -2px;
	}
}
.grid {
	margin-top: 1rem;
	display: grid;
	grid-template-columns: 1fr 1fr;
	align-items: start;
	column-gap: 1rem;
	row-gap: 0.5rem;
	.constructor {
		padding: 1rem;
		background: #ffffff77;
		border-radius: 0.5rem;
		border: 1px solid white;
		margin-bottom: 0.5rem;
	}
}
.server.drag-over {
	border: 2px dashed $primary;
	background-color: #e3f2fd;
}
.dr {
	height: 100%;
}
.myitem {
	display: grid;
	align-items: center;
	grid-template-columns: auto 1fr 1fr auto;
	// min-height: 48px;
	cursor: pointer;
	padding: 0.5rem;
	&:hover {
		background: white;
	}
}
.myitem:not(:last-child) {
	border-bottom: 1px solid #ccc;
}
.ic {
	width: 20px;
	height: 20px;
}
.selected {
	background: var(--selection);
}
.plu {
	grid-column: 2/3;
}
.link {
	font-weight: 600;
	color: $primary;
	text-decoration: underline;
	&:hover {
		text-decoration: none;
	}
}
// .pare {
// 	display: grid;
// 	grid-template-columns: repeat(3, 1fr);
// 	// justify-items: start;
// 	// align-items: stretch;
// 	column-gap: 0.5rem;
// 	row-gap: 0.5rem;
// }
</style>

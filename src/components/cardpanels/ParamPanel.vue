<script setup lang="ts">
import { computed, ref } from 'vue'
import { useApproveStore } from '@/stores/approveStore'
import { animations } from '@formkit/drag-and-drop'
import { useDragAndDrop } from '@formkit/drag-and-drop/vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const approveStore = useApproveStore()
const name = computed(() => approveStore.selectedElement?.text)
const regim = ref('Согласование')
const type = ref('Параллельное')
const hide = ref(false)
const skip = ref(true)
const allow = ref(false)
const alpar = ref(false)
const altype = ref(false)

const typeoptions = ['Параллельное', 'Последовательное', 'Альтернативное']
const options = ['Согласование', 'Подписание', 'Консолидация']

const sogl = ref([
	{
		id: 1,
		label: 'Инициатор',
		type: 'тут тип',
	},
	{
		id: 2,
		label: 'Иванов П.С.',
		type: 'тут тип',
	},
])

const config = {
	plugins: [animations()],
	dragPlaceholderClass: 'ghost',
	sortable: true,
	draggable: (child: HTMLElement) => {
		return child.classList.contains('node')
	},
}

const [parent, tapes] = useDragAndDrop(sogl.value, config)

const remove = (id: number) => {
	tapes.value = tapes.value.filter((item) => item.id !== id)
}

const add = ref('')

const addSogl = () => {
	tapes.value.push({
		id: Date.now(),
		label: `Согласующий - ${tapes.value.length + 1}`,
		type: 'тут тип',
	})
}
const ier = ref('')
const semantic = ref('Положительная')
const zapr = ref(false)
const pere = ref(false)
const vid = ref('')
const vidoptions = ['Вид 1', 'Вид 2', 'Вид 3']

const semoptions = [
	'Положительная',
	'Отрицательная',
	'Условно-положительная',
	'Отмена',
	'Новый цикл',
	'Добавление согласующих',
	'Переход А',
	'Переход B',
	'Переход C',
	'Переход D',
	'Завершение',
	'Переход на новый цикл',
]

const marshList = computed(() => {
	return approveStore.getParentsInfo(approveStore.selectedElement?.parentId)
})

const goto = (id: string) => {
	router.push({
		name: 'start',
		params: { viewId: id },
	})
}
</script>

<template lang="pug">
fieldset
	legend Маршруты ({{ approveStore.selectedElement?.parentId?.length }})
	.emp(v-if='approveStore.selectedElement?.parentId?.length == 0')
		q-icon.q-mr-md(name="mdi-information-outline" color="secondary" size="md")
		|Данный этап не используется ни в одном маршруте.
	template(v-else)
		.warn()
			q-icon.q-mr-md(name="mdi-alert-outline" size="md")
			|Данный этап используется в  маршрутах: 
			.list(v-for="item in marshList" :key="item.id" @click='goto(item.id)') {{ item.name }}


fieldset
	legend Общие
	.grid2
		.grid
			label Название:
			q-input(v-model="name" dense outlined )
			label Режим:
			q-select(v-model="regim" dense outlined :options="options" )
			label Тип маршрутизации:
			q-select(v-model="type" dense outlined :options="typeoptions" )
		.column
			q-checkbox(v-model='hide' label='Скрыть этап' dense )
			q-checkbox(v-model='skip' label='Пропускать этап при повторе на новом цикле' dense )

fieldset
	legend Доступность редактирования
	.row
		.col
			q-checkbox(v-model='allow' label='Разрешить исключение этапа из маршрута' dense )
			q-checkbox(v-model='alpar' label='Разрешить изменение параметров этапа' dense )
		.col
			q-checkbox(v-model='altype' label='Разрешить редактирование типа маршрутизации' dense )

.grid2
	fieldset
		legend Согласующие
		.gridtable
			.tablehead Согласующий
			.tablehead Тип
		div(ref='parent')
			.node(v-for="item in tapes" :key="item.id")
				div {{ item.label }}
				div {{ item.type }}
				q-btn(flat round icon="mdi-close" color="secondary" size="sm" ) 
					q-menu
						q-list
							q-item.pink(clickable @click="remove(item.id)")
								q-item-section Удалить

		q-input.q-mt-sm(v-model="add" dense label="Добавить согласующего" outlined )
			template(v-slot:append)
				q-icon(name="mdi-star-outline" color="warning" @click='addSogl')
				q-icon(name="mdi-book-open-page-variant-outline" color="primary" @click='addSogl')
				q-icon(name="mdi-dots-horizontal" color="primary" @click='addSogl')

		q-select.q-mt-xs(v-model="ier" dense label="Уровень иерархии" outlined ) 

		q-input.q-mt-xs(v-model="add" dense label="Поле документа" outlined )
			template(v-slot:append)
				q-icon(name="mdi-dots-horizontal" color="primary")
		q-input.q-mt-xs(v-model="add" dense label="Бизнес-процесс" outlined )
			template(v-slot:append)
				q-icon(name="mdi-dots-horizontal" color="primary")

	fieldset
		legend Дополнительные согласующие
			// label Семантика завершения заданий при добавлении согласующего
		q-select(v-model="semantic" dense label='Семантика завершения заданий при добавлении согласующего' outlined :options="semoptions" )
		q-checkbox.che(v-model='zapr' label='Запрашивать подтверждение у инициатора, отправлять задание вида' dense )
		q-select(v-model="vid" dense label="Вид" outlined :options="vidoptions" )
		q-checkbox.q-mt-lg(v-model='pere' label='Отправить на пересогласование после доп.согласующих' dense )

	
</template>

<style scoped lang="scss">
.che {
	margin-top: 1rem;
	line-height: 1.1;
}
.tablehead {
	font-size: 0.75rem;
	color: #555;
}
.node {
	padding: 4px 0.5rem;
	background: var(--bgLight);
	margin-top: 1px;
	display: grid;
	grid-template-columns: 1fr 1fr auto;
	align-items: center;
	user-select: none;
	cursor: pointer;
	.q-btn {
		visibility: hidden;
	}
	&:hover {
		.q-btn {
			visibility: visible;
		}
	}
}
.gridtable {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	// justify-items: start;
	// align-items: stretch;
	column-gap: 1rem;
	row-gap: 0.5rem;
	background: var(--bgLight);
	padding: 3px;
}
.gridauto {
	display: grid;
	grid-template-columns: auto 1fr;
	justify-items: start;
	column-gap: 2rem;
	row-gap: 0.5rem;
}
.grid2 {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	justify-items: start;
	align-items: start;
	column-gap: 2rem;
	row-gap: 0.5rem;
}
.grid {
	width: 100%;
	display: grid;
	grid-template-columns: auto 1fr;
	align-items: center;
	column-gap: 1rem;
	row-gap: 0.5rem;
}
.q-input {
	width: 100%;
}
.ghost {
	height: 36px;
	background: hsl(213 38% 81% / 1) !important;
	box-shadow: none !important;
	border: none !important;

	* {
		display: none;
	}
}
.warn {
	color: darkred;
	font-weight: 600;
	display: flex;
	align-items: center;
	white-space: wrap;
	.list {
		color: $primary;
		margin-left: 1rem;
		cursor: pointer;
		text-decoration: underline;
	}
}
</style>

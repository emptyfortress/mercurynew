<script setup lang="ts">
import { computed, ref } from 'vue'
import { useApproveStore } from '@/stores/approveStore'
import { animations } from '@formkit/drag-and-drop'
import { useDragAndDrop } from '@formkit/drag-and-drop/vue'

const approveStore = useApproveStore()
const name = ref(approveStore.selectedElement?.text)
const regim = ref('Согласование')
const type = ref('Параллельное')
const hide = ref(false)
const skip = ref(true)
const allow = ref(false)
const alpar = ref(false)
const altype = ref(false)

const typeoptions = ['Параллельное', 'Последовательное', 'Альтернативное']
const options = ['Согласование', 'Подписание', 'Консолидация']

const typovoy = computed(() => {
	return approveStore.selectedElement?.template ? true : false
})

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
		return typovoy.value ? false : child.classList.contains('node')
	},
}

const [parent, tapes] = useDragAndDrop(sogl.value, config)

const remove = (id: number) => {
	tapes.value = tapes.value.filter((item) => item.id !== id)
}

const add = ref('')

const addSogl = () => {
	if (typovoy.value) return
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
</script>

<template lang="pug">
fieldset
	legend Общие
	.grid2
		.grid
			label Название:
			q-input(v-model="name" dense outlined :readonly='typovoy')
			label Режим:
			q-select(v-model="regim" dense outlined :options="options" :readonly='typovoy')
			label Тип маршрутизации:
			q-select(v-model="type" dense outlined :options="typeoptions" :readonly='typovoy')
		.column
			q-checkbox(v-model='hide' label='Скрыть этап' dense :disable='typovoy')
			q-checkbox(v-model='skip' label='Пропускать этап при повторе на новом цикле' dense :disable='typovoy')

fieldset
	legend Доступность редактирования
	.row
		.col
			q-checkbox(v-model='allow' label='Разрешить исключение этапа из маршрута' dense :disable='typovoy')
			q-checkbox(v-model='alpar' label='Разрешить изменение параметров этапа' dense :disable='typovoy')
		.col
			q-checkbox(v-model='altype' label='Разрешить редактирование типа маршрутизации' dense :disable='typovoy')

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
				q-btn(flat round icon="mdi-close" color="secondary" size="sm" :disable='typovoy') 
					q-menu
						q-list
							q-item.pink(clickable @click="remove(item.id)")
								q-item-section Удалить

		q-input.q-mt-sm(v-model="add" dense label="Добавить согласующего" outlined :readonly='typovoy')
			template(v-slot:append)
				q-icon(name="mdi-star-outline" color="warning" @click='addSogl')
				q-icon(name="mdi-book-open-page-variant-outline" color="primary" @click='addSogl')
				q-icon(name="mdi-dots-horizontal" color="primary" @click='addSogl')

		q-select.q-mt-xs(v-model="ier" dense label="Уровень иерархии" outlined :readonly='typovoy') 

		q-input.q-mt-xs(v-model="add" dense label="Поле документа" outlined :readonly='typovoy')
			template(v-slot:append)
				q-icon(name="mdi-dots-horizontal" color="primary")
		q-input.q-mt-xs(v-model="add" dense label="Бизнес-процесс" outlined :readonly='typovoy')
			template(v-slot:append)
				q-icon(name="mdi-dots-horizontal" color="primary")

	fieldset
		legend Дополнительные согласующие
			// label Семантика завершения заданий при добавлении согласующего
		q-select(v-model="semantic" dense label='Семантика завершения заданий при добавлении согласующего' outlined :options="semoptions" :readonly='typovoy')
		q-checkbox.che(v-model='zapr' label='Запрашивать подтверждение у инициатора, отправлять задание вида' dense :disable='typovoy')
		q-select(v-model="vid" dense label="Вид" outlined :options="vidoptions" :readonly='typovoy')
		q-checkbox.q-mt-lg(v-model='pere' label='Отправить на пересогласование после доп.согласующих' dense :disable='typovoy')

	
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
</style>

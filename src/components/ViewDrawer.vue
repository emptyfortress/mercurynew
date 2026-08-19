<script setup lang="ts">
import { ref, watch } from 'vue'
import { Kind } from '@/types/enum'
import CarbonDirectLink from '@/components/icons/CarbonDirectLink.vue'

const visible = defineModel<boolean>('visible')
const column = defineModel<Col | null>('column')

interface Col {
	id: string
	type: string
	text: string
	kind: null
	newkind: null
	children: []
	sort: false
	order: string
	hide: boolean
}

// локальный буфер редактирования
const draft = ref<Col | null>(null)

// пересоздаём буфер при каждом открытии/смене колонки
watch(
	() => [visible.value, column.value] as const,
	([isVisible, col]) => {
		if (isVisible && col) {
			draft.value = { ...col }
		}
	},
	{ immediate: true }
)

const save = () => {
	if (!draft.value || !column.value) return
	Object.assign(column.value, draft.value) // мутируем тот же объект, ссылка не рвётся
	visible.value = false
}

const options = [
	{ id: 1, label: 'Строка', value: Kind.String },
	{ id: 2, label: 'Текст', value: Kind.Text },
	{ id: 3, label: 'Дата', value: Kind.Date },
	{ id: 4, label: 'Организация', value: Kind.Org },
	{ id: 5, label: 'Сотрудник', value: Kind.Man },
	{ id: 6, label: 'Статус', value: Kind.Status },
	{ id: 7, label: 'Линк', value: Kind.Link },
	{ id: 8, label: 'Телефон', value: Kind.Phone },
	{ id: 9, label: 'Email', value: Kind.Email },
	{ id: 10, label: 'Число', value: Kind.Num },
	{ id: 11, label: 'Логический тип', value: Kind.Bool },
	{ id: 12, label: 'Таблица', value: Kind.Table },
	{ id: 13, label: 'Виртуальное поле', value: Kind.Virtual },
]

const source = ref('')
const sel = (n: string) => {
	source.value = n
}
const tabs = ref('cols')
</script>

<template lang="pug">
q-drawer(v-model='visible' side='right' :width="550" overlay persistent bordered behavior="desktop")
	.zg
		q-btn(flat round icon="mdi-close" color="primary" dense @click="visible = false") 
		div {{draft?.text}}
		div >
		div {{ tabs }}

	.vertgrid
		q-tabs(v-model="tabs" vertical class="text-primary")
			q-tab(name='cols' icon='mdi-tag-outline' color="primary")
			q-tab(name='data' icon="mdi-database-outline")
			q-tab(name='attach' icon="mdi-virtual-reality")
			q-tab(name='calc' icon="mdi-calculator-variant-outline")
			q-tab(name='sort' icon="mdi-sort")
			q-tab(name='group' icon="mdi-format-list-group")

		q-tab-panels(
			v-model="tabs",
			vertical,
			animated,
			transition-prev="jump-up"
			transition-next="jump-up"
		)
			q-tab-panel(name='cols')
				.grid2(v-if='draft')
					label Название:
					q-input(v-model="draft.text" dense outlined)
					label Тип данных:
					q-select(v-model="draft.kind" dense outlined :options="options" map-options emit-value)
					label
					q-checkbox(v-model='draft.hide' label='Скрытая колонка' dense)

				template(v-if='draft')
					label.q-mt-md.q-mb-sm Источник данных:
					.grid5
						.chose(@click="sel('1')" :class="{selected: source == '1'}")
							q-radio(v-model="source" val="1" label="Поле раздела" dense)
						.chose(@click="sel('2')" :class="{selected: source == '2'}")
							q-radio(v-model="source" val="2" label="Системное поле" dense)
						// .chose(@click="sel('3')" :class="{selected: source == '3'}")
						// 	q-radio(v-model="source" val="3" label="Свойство карточки" dense)
						.chose(@click="sel('4')" :class="{selected: source == '4'}")
							q-radio(v-model="source" val="4" label="Виртуальное поле" dense)
						.chose(@click="sel('5')" :class="{selected: source == '5'}")
							q-radio(v-model="source" val="5" label="Вычисляемое поле" dense)

					.q-mt-md.q-mb-sm Раздел
					q-input(v-model="razdel" dense outlined )
						template(v-slot:append)
							q-btn(flat round icon="mdi-dots-horizontal" color="secondary" dense @click="") 
							q-btn(flat round icon="mdi-close" color="secondary" dense @click="") 

					q-separator
					.row.items-center
						CarbonDirectLink.ic 
						q-btn(flat icon="mdi-plus" color="primary" label="Добавить присоединенный раздел" @click="") 

			q-tab-panel(name='data')


	.actions
		q-btn(flat color="primary" label="Отмена" @click="visible = false") 
		q-btn(unelevated color="primary" label="Сохранить" @click="save") 
</template>

<style scoped lang="scss">
.vertgrid {
	display: grid;
	grid-template-columns: auto 1fr;
	column-gap: 1rem;
	height: calc(100% - 64px);
}
.ic {
	font-size: 2.6rem;
	color: $secondary;
}
.ico {
	font-size: 2rem;
}
.zg {
	padding: 0.5rem 1rem;
	font-size: 0.9rem;
	border-bottom: 1px solid #cfdbec;
	display: flex;
	align-items: center;
	gap: 1rem;
	color: $primary;
	gap: 0.25rem;
}
.chose {
	cursor: pointer;
	border: 1px solid $grey-4;
	padding: 0.5rem;
	border-radius: 0.25rem;
	font-size: 0.8rem;
	line-height: 1.1;
	&:hover {
		border-color: $secondary;
	}
	&.selected {
		background: var(--selection);
		border: 1px solid $primary;
	}
}
.grid2 {
	display: grid;
	grid-template-columns: auto 1fr;
	// justify-items: start;
	align-items: center;
	column-gap: 1rem;
	row-gap: 0.5rem;
	margin-bottom: 2rem;
}
.actions {
	display: flex;
	width: 100%;
	justify-content: end;
	position: absolute;
	bottom: 1rem;
	right: 1rem;
}
.q-separator {
	margin-top: 1rem;
	margin-bottom: 1rem;
	background: $secondary;
}
:deep(.q-drawer__content) {
	position: relative;
}
:deep(.q-tabs) {
	border-right: 1px solid #cfdbec;
}
.grid5 {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	// justify-items: start;
	// align-items: stretch;
	gap: 0.25rem;
}
</style>

<script setup lang="ts">
import { ref } from 'vue'
import MenuCondition from '@/components/decision/MenuCondition.vue'
import { useSimpleStore } from '@/stores/simpleStore'
import { useRouter, useRoute } from 'vue-router'
import { uid } from 'quasar'
import LucideLayoutTemplate from '@/components/icons/LucideLayoutTemplate.vue'
import IconParkSolidPageTemplate from '@/components/icons/IconParkSolidPageTemplate.vue'

const simpleStore = useSimpleStore()
const route = useRoute()
const router = useRouter()

const list = ref([
	{ id: 1, label: 'Верхняя панель' },
	{ id: 0, label: 'Главное меню' },
	{ id: 2, label: 'Дашборд' },
	{ id: 3, label: 'Фон приложения' },
])

const select = (n: number) => {
	selectedListItem.value = n
}

const selectedListItem = ref<null | number>(0)

const tableColumns = [
	{
		name: 'name',
		label: 'Название разметки',
		field: 'name',
		align: 'left' as const,
		sortable: true,
	},
	{ name: 'author', label: 'Автор', field: 'author', align: 'left' as const, sortable: true },
	{ name: 'date', label: 'Дата создания', field: 'date', align: 'left' as const, sortable: true },
	{ name: 'app', label: 'Решение', field: 'app', align: 'left' as const, sortable: true },
	{ name: 'actions', label: '', field: 'actions', align: 'right' as const },
]

const tableData = ref([
	{
		uid: uid(),
		name: 'Меню по умолчанию',
		author: 'admin',
		date: '2024-01-15',
		app: 'По умолчанию',
	},
	{ uid: uid(), name: 'КЭДО меню', author: 'admin', date: '2024-01-20', app: 'кэдо' },
])

// const selectRow = (row: any) => {
// 	if (simpleStore.selectedMenuRow && simpleStore.selectedMenuRow.uid === row.uid) {
// 		simpleStore.selectedMenuRow = null
// 	} else {
// 		simpleStore.selectedMenuRow = row
// 	}
// }

const duplicateTableItem = (row: {
	uid: string
	name: string
	author: string
	date: string
	comment: string
}) => {
	const newItem = {
		uid: uid(),
		name: `${row.name} (копия)`,
		author: row.author,
		date: new Date().toISOString().split('T')[0],
		app: '',
	}
	tableData.value.push(newItem)
	simpleStore.selectedMenuRow = newItem
}

const deleteTableItem = (uid: string) => {
	tableData.value = tableData.value.filter((item) => item.uid !== uid)
}

const createDialog = ref(false)
const newMenuName = ref('')

const create = () => {
	newMenuName.value = ''
	createDialog.value = true
}

const createMenu = () => {
	if (newMenuName.value.trim()) {
		let tmp = {
			uid: uid(),
			name: newMenuName.value.trim(),
			author: 'admin',
			date: new Date().toISOString().split('T')[0],
			app: '',
		}
		tableData.value.push(tmp)
		createDialog.value = false
		simpleStore.selectedMenuRow = tmp
	}
}

const calcClass = (uid: string) => {
	if (simpleStore.selectedMenuRow && simpleStore.selectedMenuRow.uid == uid) {
		return 'selectedtr'
	}
	return ''
}
const mainMenu = (row: any) => {
	router.push('/dvmain/webframe/menu')
	simpleStore.selectedMenuRow = row
}
const tab = ref('condition')
</script>

<template lang="pug">
.container1
	.text-h5.text-center Настройка рабочей области

	.grid
		div
			q-list(separator)
				q-item(
					clickable,
					v-for="item in list",
					:key='item.id'
					:class="{selected : item.id == selectedListItem }"
					@click='select(item.id)'
					)
					q-item-section(side)
						IconParkSolidPageTemplate(v-if='item.id == 0')
						LucideLayoutTemplate(v-else)
					q-item-section {{ item.label }}

		div
			div(v-if='selectedListItem == 0')

				q-tabs(v-model="tab" align="left" activeColor="primary" indicatorColor="primary")
					q-tab(name='setup' label="Главное меню")
					q-tab(name='condition' label="Условия выбора")

				q-tab-panels(v-model="tab" animated)
					q-tab-panel(name='setup')
						q-btn(
							flat,
							color="primary",
							icon="mdi-plus-circle",
							label="Создать разметку",
							@click="create",
						) 
						q-table.q-mt-md(
							:rows="tableData"
							:columns="tableColumns"
							row-key="uid"
							flat
							hide-bottom
						)
							template(v-slot:body='props')
								q-tr(:props="props" @click='mainMenu(props.row)')
									q-td(:props='props' key="name")
										span.link(@click.stop) {{ props.row.name }}
											q-popup-edit(v-model="props.row.name" auto-save v-slot="scope")
												q-input(v-model="scope.value" dense autofocus counter @keyup.enter="scope.set")
									q-td(:props='props' key="author") {{ props.row.author }}
									q-td(:props='props' key="date") {{ props.row.date }}
									q-td(:props='props' key="app") {{ props.row.app }}

									q-td(:props="props" key='actions')
										q-btn.q-mr-md(flat round dense icon="mdi-content-duplicate" @click.stop="duplicateTableItem(props.row)") 
										q-btn(flat round dense color="negative" icon="mdi-delete-outline" @click.stop) 
											q-menu
												q-list
													q-item(clickable @click="deleteTableItem(props.row.uid)" v-close-popup).pink
														q-item-section Удалить

					q-tab-panel(name='condition')
						MenuCondition()

			div(v-if='selectedListItem && selectedListItem > 0')
				<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><!-- Icon from Material Symbols by Google - https://github.com/google/material-design-icons/blob/master/LICENSE --><path fill="currentColor" d="m18.9 21l-5.475-5.475l2.1-2.1L21 18.9zM5.1 21L3 18.9L9.9 12l-1.7-1.7l-.7.7l-1.275-1.275v2.05l-.7.7L2.5 9.45l.7-.7h2.05L4 7.5l3.55-3.55q.5-.5 1.075-.725T9.8 3t1.175.225t1.075.725l-2.3 2.3L11 7.5l-.7.7L12 9.9l2.25-2.25q-.1-.275-.162-.575t-.063-.6q0-1.475 1.013-2.488t2.487-1.012q.375 0 .713.075t.687.225L16.45 5.75l1.8 1.8l2.475-2.475q.175.35.238.687t.062.713q0 1.475-1.012 2.488t-2.488 1.012q-.3 0-.6-.05t-.575-.175z"/></svg>
				div Раздел в разработке


q-dialog(v-model="createDialog" persistent backdrop-filter="blur(4px) saturate(150%)")
	q-card(style="min-width: 350px")
		q-btn.close(round color="negative" icon="mdi-close" v-close-popup)
		q-card-section
			.text-h6 Создать разметку
			q-input.q-mt-md(
				v-model="newMenuName"
				label="Название"
				dense
				outlined
				autofocus
				@keyup.enter="createMenu"
			)
		q-card-actions(align="right")
			q-btn(flat label="Отмена" v-close-popup)
			q-btn(unelevated color="primary" label="Создать" @click="createMenu")
</template>

<style scoped lang="scss">
.grid {
	margin: 2rem auto;
	display: grid;
	grid-template-columns: 250px 1fr;
	column-gap: 3rem;
	row-gap: 1rem;
}
.selected {
	background: var(--selection);
}
.container1 {
	max-width: 1400px;
	margin: 0 auto;
}
.selectedtr {
	background: var(--selection);
}
.q-item,
.q-item__section--side {
	color: var(--dark);
	font-size: 1rem;
}
.q-tr {
	cursor: pointer;
}
.q-tab-panels {
	background: transparent;
	border-top: 1px solid #999;
}
.link {
	color: $primary;
	border-bottom: 1px dotted $primary;
}
</style>

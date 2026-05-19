<script setup lang="ts">
import { ref, computed } from 'vue'
import UnifiedTree from '@/components/decision/UnifiedTree.vue'
import { useElementSize } from '@vueuse/core'
import { useRouter, useRoute } from 'vue-router'
import LucideLayoutTemplate from '@/components/icons/LucideLayoutTemplate.vue'
import IconParkSolidPageTemplate from '@/components/icons/IconParkSolidPageTemplate.vue'

const route = useRoute()
const router = useRouter()

const splitterModel = ref(25)
const el = ref<HTMLElement | null>(null)
const { width, height } = useElementSize(el)

const hei = computed(() => `height: ${height.value}px;`)

const mainMenu = () => {
	router.push('/dvmain/webframe/menu')
}

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
	{ name: 'name', label: 'Название', field: 'name', align: 'left' as const, sortable: true },
	{ name: 'author', label: 'Автор', field: 'author', align: 'left' as const, sortable: true },
	{ name: 'date', label: 'Дата', field: 'date', align: 'left' as const, sortable: true },
	{ name: 'actions', label: '', field: 'actions', align: 'right' as const },
]

const tableData = [
	{ name: 'Элемент 1', author: 'admin', date: '2024-01-15' },
	{ name: 'Элемент 2', author: 'admin', date: '2024-01-20' },
]
</script>

<template lang="pug">
q-page(padding)
	.container(v-if='route.params.constructorId === "cards"')
		.text-h6.text-center Конструктор карточек
		q-splitter.q-mt-md(v-model="splitterModel" :limits="[0, 100]" :style="hei")
			template(v-slot:before)
				q-scroll-area.list(ref='el')
					UnifiedTree(
						sourceType="selectedBranch"
						filterField="text"
						:showTypeSelector="true"
						mode="vid"
					)

			template(v-slot:after)
				router-view(v-slot="{ Component }")
					transition(name="page" mode="out-in")
						component(:is="Component" :key="route.fullPath")

	.container(v-if='route.params.constructorId === "folders"')
		q-splitter.q-mt-md(v-model="splitterModel" :limits="[0, 100]" :style="hei")
			template(v-slot:before)
				q-scroll-area.list(ref='el')
					UnifiedTree(
						sourceType="folderData"
						filterField="text"
						:showTypeSelector="false"
						mode="folder"
					)

			template(v-slot:after)
				router-view(v-slot="{ Component }")
					transition(name="page" mode="out-in")
						component(:is="Component" :key="route.fullPath")


	.container1(v-if='route.params.constructorId === "webframe"')
		.text-h6.text-center Настройка рабочей области

		.grid
			q-list(dense separator)
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
				div(v-if='selectedListItem == null') Ничего не выбрано
				div(v-if='selectedListItem == 0')
					.text-bold Главное меню
					div Выберите меню для настройки или создайте новое
					q-table(
						:rows="tableData"
						:columns="tableColumns"
						row-key="name"
						flat
					)
						template(v-slot:body-cell-actions='props')
							q-td(:props="props")
								q-btn.q-mr-md(flat round dense icon="mdi-pencil" size='sm') 
								q-btn(flat round dense icon="mdi-dots-vertical" size='sm') 
									q-menu
										q-list
											q-item(clickable)
												q-item-section(side)
													q-icon(name="mdi-content-duplicate" color="primary")
												q-item-section Дублировать
											q-item(clickable)
												q-item-section(side)
													q-icon(name="mdi-delete-outline" color="negative")
												q-item-section Удалить

				div(v-if='selectedListItem && selectedListItem > 0')
					<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><!-- Icon from Material Symbols by Google - https://github.com/google/material-design-icons/blob/master/LICENSE --><path fill="currentColor" d="m18.9 21l-5.475-5.475l2.1-2.1L21 18.9zM5.1 21L3 18.9L9.9 12l-1.7-1.7l-.7.7l-1.275-1.275v2.05l-.7.7L2.5 9.45l.7-.7h2.05L4 7.5l3.55-3.55q.5-.5 1.075-.725T9.8 3t1.175.225t1.075.725l-2.3 2.3L11 7.5l-.7.7L12 9.9l2.25-2.25q-.1-.275-.162-.575t-.063-.6q0-1.475 1.013-2.488t2.487-1.012q.375 0 .713.075t.687.225L16.45 5.75l1.8 1.8l2.475-2.475q.175.35.238.687t.062.713q0 1.475-1.012 2.488t-2.488 1.012q-.3 0-.6-.05t-.575-.175z"/></svg>
					div Раздел в разработке

</template>

<style scoped lang="scss">
.grid {
	margin: 2rem auto;
	display: grid;
	grid-template-columns: 220px 1fr 1fr;
	column-gap: 3rem;
	row-gap: 1rem;
}
.q-item,
.q-item__section--side {
	color: var(--dark);
}
.selected {
	background: var(--selected);
}
.container {
	max-width: 1400px;
	margin: 0 auto;
}
.container1 {
	max-width: 1600px;
	margin: 0 auto;
}

.list {
	height: calc(100vh - 170px);
	padding: 0;
	margin: 0;
}

.page-enter-active,
.page-leave-active {
	transition: all 0.3s ease;
}

.page-enter-from {
	opacity: 0;
	transform: translateY(10px);
}

.page-leave-to {
	opacity: 0;
	transform: translateY(-10px);
}
</style>

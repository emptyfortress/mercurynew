<script setup lang="ts">
import { ref, computed } from 'vue'
import { useSimpleStore } from '@/stores/simpleStore'
import ChipModal from '@/components/decision/ChipModal-new.vue'
import CommonTab from '@/components/decision/CommonTab.vue'
import ColumnsTab1 from '@/components/decision/ColumnsTab1.vue'
import SortPanel from '@/components/decision/SortPanel.vue'
import GroupPanel from '@/components/decision/GroupPanel.vue'
import ViewFolder from '@/components/decision/ViewFolder.vue'
// import FilterPanel from '@/components/decision/FilterPanel.vue'
// import StylePanel from '@/components/decision/StylePanel.vue'

const props = defineProps({
	splitter: Number,
})

const tabs = defineModel<string>()

const store = useSimpleStore()

const emit = defineEmits(['maximize', 'reset'])
const switchSidebar = () => {
	if (props.splitter !== 0) {
		emit('maximize')
	} else emit('reset')
}

const dialogCreate = ref(false)
const toggleCreate = () => {
	dialogCreate.value = !dialogCreate.value
}

const isFolder = computed(() => {
	return store.selectedElement?.type == 0
})

const save = () => {
	store.currentNode.data.text = store.tempNode.text
	store.currentNode.data.text1 = store.tempNode.text1
}
</script>

<template lang="pug">
.all(v-if='!store.selectedElement')
	.empt
		div Выберите представление слева или создайте новое.
		br
		q-btn(unelevated color="primary" @click="toggleCreate") Создать представление

div(v-else)
	.row.items-start.justify-between
		.row.items-center
			q-btn(flat round dense @click="switchSidebar" color="primary")
				q-icon(name="mdi-forwardburger" v-if="props.splitter === 0")
				q-icon(name="mdi-backburger" v-else)

			.myblock
				.row.items-center
					q-icon.fold( name="mdi-folder-outline" color="secondary" v-if='store.selectedElement.type == 0')
					q-icon.fold( name="mdi-table" color="secondary" v-else)
				div
					.text-overline
						span(v-if='store.selectedElement.type == 0') Папка
						span(v-else) Представление
					.zg {{ store.selectedElement.text }}

		.btngroup(v-if='store.selectedElement && store.selectedElement.type !== 0')
			q-btn(unelevated color="primary" label="Сохранить" size="sm" @click="save") 
			q-btn(outline color="primary" label="Отмена" size="sm") 
			q-btn(round flat color="primary" icon="mdi-sync" size="sm") 
			q-chip(size='sm' color="amber") Есть изменения
			q-chip(size='sm' color="blue-grey-3" icon="mdi-lock") Заблокировано вами
			q-btn(flat round color="negative" icon="mdi-delete-outline" size="sm") 
				q-menu
					q-list
						q-item.pink(clickable @click="store.toggleDelete")
							q-item-section Удалить


	template( v-if='store.selectedElement' )
		ViewFolder(v-if='store.selectedElement.type == 0')

		template(v-else)
			q-tabs.q-mt-md(v-model="tabs" align="left" dense color="primary" class="text-primary")
				q-tab(name='common' label='Представление')
				q-tab(name='columns' label='Колонки')
				q-tab(name='group' label='Группировки')
				q-tab(name='sort' label='Сортировки')
				q-tab(name='appearance' label='Внешний вид')
				// q-tab(name='filter' label='Фильтрация' v-if='!isFolder')
				// q-tab(name='style' label='Стили' v-if='!isFolder')

			q-tab-panels(v-model="tabs" animated)
				q-tab-panel(name='common')
					CommonTab
				q-tab-panel(name='columns')
					ColumnsTab1
				q-tab-panel(name='group')
					GroupPanel
				q-tab-panel(name='sort')
					SortPanel
				q-tab-panel(name='appearance')
					div Внешний вид
				// q-tab-panel(name='filter')
					// FilterPanel
				// q-tab-panel(name='style')
					// StylePanel


ChipModal(v-model="dialogCreate" create mode="views")
</template>

<style scoped lang="scss">
.empt {
	position: absolute;
	top: 30%;
	left: 50%;
	transform: translateX(-50%);
	text-align: center;
}
.btngroup > * {
	margin-right: 0.25rem;
}
.fold {
	color: $secondary;
	font-size: 2.2rem;
}
.zg {
	font-size: 1rem;
	text-transform: uppercase;
	font-weight: 600;
}
.q-tabs {
	border-bottom: 1px solid var(--my-border-color);
}

:deep(.q-tab-panels) {
	background: transparent;
}
:deep(.q-tab-panel) {
	padding: 1rem 0;
}
.myblock {
	margin-left: 1rem;
	display: grid;
	grid-template-columns: auto 1fr;
	justify-items: start;
	align-items: stretch;
	column-gap: 0.7rem;
	.text-h6,
	.text-overline {
		line-height: 1;
	}
	.text-overline {
		color: $blue-grey-6;
	}
}
</style>

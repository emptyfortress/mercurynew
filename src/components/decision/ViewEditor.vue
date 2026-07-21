<script setup lang="ts">
import { ref, computed } from 'vue'
import { useSimpleStore } from '@/stores/simpleStore'
import ChipModal from '@/components/decision/ChipModal-new.vue'
import CommonTab from '@/components/decision/CommonTab.vue'
import ColumnsTab1 from '@/components/decision/ColumnsTab1.vue'
import SortPanel from '@/components/decision/SortPanel.vue'
import FilterPanel from '@/components/decision/FilterPanel.vue'
import StylePanel from '@/components/decision/StylePanel.vue'

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

div
	.row.items-start.justify-between
		.row.items-center
			q-btn(flat round dense @click="switchSidebar" color="primary")
				q-icon(name="mdi-forwardburger" v-if="props.splitter === 0")
				q-icon(name="mdi-backburger" v-else)

			.zg(v-if="store.selectedElement") {{ store.selectedElement.text }}
				q-popup-edit(v-model="store.selectedElement.text" auto-save v-slot="scope")
					q-input(v-model="scope.value" dense autofocus counter @keyup.enter="scope.set")

		.btngroup(v-if='store.selectedElement')
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
		q-tabs.q-mt-md(v-model="tabs" align="left" dense color="primary" class="text-primary")
			q-tab(name='common' label='Общие')
			q-tab(name='columns' label='Колонки' v-if='!isFolder')
			q-tab(name='group' label='Группировки' v-if='!isFolder')
			q-tab(name='sort' label='Сортировки' v-if='!isFolder')
			q-tab(name='filter' label='Фильтрация' v-if='!isFolder')
			q-tab(name='style' label='Стили' v-if='!isFolder')

		q-tab-panels(v-model="tabs" animated)
			q-tab-panel(name='common')
				CommonTab
			q-tab-panel(name='columns')
				ColumnsTab1
			q-tab-panel(name='sort')
				SortPanel
			q-tab-panel(name='filter')
				FilterPanel
			q-tab-panel(name='style')
				StylePanel


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
.zg {
	font-size: 1rem;
	text-transform: uppercase;
	margin-left: 1rem;
	font-weight: 600;
	color: $primary;
	padding-bottom: 0;
	border-bottom: 1px dotted var(--q-primary);
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
</style>

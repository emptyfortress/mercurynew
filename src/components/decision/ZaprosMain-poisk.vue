<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useSimpleStore } from '@/stores/simpleStore'
import { useEditor as useEditorMer } from '@/stores/useEditor-mercy'
import { useDrag as useDragMer } from '@/stores/useDrag-mercy'
import QueryItem from '@/components/decision/QueryItem-poisk.vue'
import PreviewDialog from '@/components/decision/PreviewDialog-poisk.vue'
import ChipModal from '@/components/decision/ChipModal-new.vue'
import CommonTab from '@/components/decision/CommonTab.vue'
import Safety from '@/components/decision/Safety.vue'
import AdditionTab from '@/components/decision/AdditionTab.vue'
import FolderTab from '@/components/decision/FolderTab.vue'
import XmlTree from '@/components/decision/XmlTree.vue'

const props = defineProps({
	splitter: Number,
})

const tabs = defineModel<string>()

const emit = defineEmits(['maximize', 'reset'])

const store = useSimpleStore()
const editor = useEditorMer()
const drag = useDragMer()

const switchSidebar = () => {
	if (props.splitter !== 0) {
		emit('maximize')
	} else emit('reset')
}

const remove = () => {
	store.toggleDelete()
}

const double = () => {
	store.toggleDuplicate()
}

const preview = ref(false)
const previewForm = ref(false)
const loading = ref(false)

const showPreview = () => {
	loading.value = true
	preview.value = true
	setTimeout(() => {
		loading.value = false
	}, 3000)
}
const togglePreviewForm = () => {
	drag.toggleFlag()
	previewForm.value = !previewForm.value
}

watch(
	() => editor.type,
	() => {
		editor.resetVid()
	}
)

const dialogCreate = ref(false)
const toggleCreate = () => {
	dialogCreate.value = !dialogCreate.value
}

const isFolder = computed(() => {
	return store.selectedElement?.type == 0
})

const testXml = `
<catalog>
  <book id="1">
    <title>Vue 3</title>
    <author>Evan You</author>
  </book>
  <book id="2">
    <title>TypeScript</title>
    <author>Anders</author>
  </book>
</catalog>
`
</script>

<template lang="pug">
.all(v-if='!store.selectedElement')
	.empt
		div Выберите запрос слева или создайте новый.
		br
		q-btn(unelevated color="primary" @click="toggleCreate") Создать новый запрос
.layout1
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
				q-btn(unelevated color="primary" label="Сохранить" size="sm") 
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
				q-tab(name='query' label='Запрос' v-if='!isFolder')
				q-tab(name='folders' label='Область поиска' v-if='!isFolder')
				q-tab(name='safety' label='Безопасность')
				q-tab(name='addition' label='Дополнительно' v-if='!isFolder')
				q-tab(name='xml' label='XML' v-if='!isFolder')

			q-tab-panels(v-model="tabs" animated)
				q-tab-panel(name='common')
					CommonTab
				q-tab-panel(name='query')
					QueryItem(:preview="previewForm" @closePreview="togglePreviewForm" @find="showPreview")
					.row.justify-center.q-mx-lg
						q-btn(unelevated color="primary" label="Превью" icon="mdi-check-bold" @click="togglePreviewForm")
				q-tab-panel(name='folders')
					FolderTab
				q-tab-panel(name='safety')
					Safety

				q-tab-panel(name='addition')
					AdditionTab
				q-tab-panel(name='xml')
					XmlTree(:xml="testXml")

	PreviewDialog(v-model="preview" :loading="loading")
	ChipModal(v-model="dialogCreate" create)

</template>

<style scoped lang="scss">
.layout1 {
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	position: relative;
}
.empt {
	position: absolute;
	top: 40%;
	left: 50%;
	transform: translateX(-50%);
	text-align: center;
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

.descr {
	margin: 0.5rem 1rem;
	padding: 0.5rem;
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
.btngroup > * {
	margin-right: 0.25rem;
}
</style>

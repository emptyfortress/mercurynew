<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue'
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
import QueryLocalization from '@/components/decision/QueryLocalization.vue'
import { supportedLocaleCodes } from '@/constants/locales'

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

const queryTree = computed({
	get: () => {
		if (!store.selectedElement) return []
		const query = store.selectedElement as any
		if (!query.queryTree) {
			query.queryTree = [{ type: 10, typ: false, drop: false, drag: false, children: [] }]
		}
		return query.queryTree
	},
	set: (value: any[]) => {
		if (store.selectedElement) (store.selectedElement as any).queryTree = value
	},
})

const normalizeLocalization = (query: any) => {
	if (!query.localization) {
		query.localization = { values: {} }
		return
	}

	query.localization.values ??= {}
	Object.values(query.localization.values).forEach((translations: any) => {
		Object.keys(translations).forEach((languageCode) => {
			if (!supportedLocaleCodes.has(languageCode)) delete translations[languageCode]
		})
	})
	delete query.localization.languages
	delete query.localization.languageOrder
}

watch(
	() => store.selectedElement,
	(query) => {
		if (query && query.type !== 0) normalizeLocalization(query)
	},
	{ immediate: true }
)

const queryLocalization = computed(
	() => (store.selectedElement as any)?.localization ?? { values: {} }
)

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

const save = () => {
	store.currentNode.data.text = store.tempNode.text
	store.currentNode.data.text1 = store.tempNode.text1
	store.currentNode.data.nameTranslations = { ...store.tempNode.nameTranslations }
	store.currentNode.data.descriptionTranslations = { ...store.tempNode.descriptionTranslations }
}

const cancel = () => {
	if (!store.currentNode) return
	store.tempNode.text = store.currentNode.data.text
	store.tempNode.text1 = store.currentNode.data.text1
	store.tempNode.nameTranslations = { ...(store.currentNode.data.nameTranslations ?? {}) }
	store.tempNode.descriptionTranslations = {
		...(store.currentNode.data.descriptionTranslations ?? {}),
	}
}
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

				.myblock(v-if="store.selectedElement")
					.row.items-center
						q-icon.fold(name="mdi-folder-outline" color="secondary" v-if="isFolder")
						q-icon.fold(name="mdi-magnify" color="secondary" v-else)
					div
						.text-overline
							span(v-if="isFolder") Папка
							span(v-else) Запрос
						.zg {{ store.selectedElement.text }}

			.btngroup(v-if='store.selectedElement')
				q-btn(unelevated color="primary" label="Сохранить" size="sm" @click="save") 
				q-btn(outline color="primary" label="Отмена" size="sm" @click="cancel")
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
				q-tab(name='lang' label='Локализация параметров' v-if='!isFolder')
				q-tab(name='safety' label='Безопасность')
				q-tab(name='addition' label='Дополнительно' v-if='!isFolder')
				q-tab(name='xml' label='XML' v-if='!isFolder')

			q-tab-panels(v-model="tabs" animated)
				q-tab-panel(name='common')
					CommonTab(localize-name localize-description)
					.row.q-gutter-sm.q-mt-md.q-ml-md
						q-btn(outline color="primary" icon="mdi-file-import-outline" label="Импорт xml")
						q-btn(outline color="primary" icon="mdi-file-export-outline" label="Экспорт xml")
				q-tab-panel(name='query')
					QueryItem(v-model:treeData="queryTree" :preview="previewForm" @closePreview="togglePreviewForm" @find="showPreview")
					// .row.justify-center.q-mx-lg
					// 	q-btn(unelevated color="primary" label="Превью" icon="mdi-check-bold" @click="togglePreviewForm")
				q-tab-panel(name='folders')
					FolderTab
				q-tab-panel(name='lang')
					QueryLocalization(:tree-data="queryTree" :localization="queryLocalization")
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

.myblock {
	margin-left: 1rem;
	display: grid;
	grid-template-columns: auto 1fr;
	justify-items: start;
	align-items: stretch;
	column-gap: 0.7rem;
	.text-overline {
		line-height: 1;
		color: $blue-grey-6;
	}
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

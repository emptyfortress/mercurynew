<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import PartitionTree1 from '@/components/decision/PartitionTree1.vue'
import BuildConditionDialog from '@/components/view/BuildConditionDialog.vue'
import { usePartitionStore } from '@/stores/partition'

const visible = defineModel<boolean>('visible')
const partition = defineModel<Par | null>('partition')

defineProps<{
	mode: 'add' | 'edit'
}>()

const part = usePartitionStore()
const conditionDialog = ref(false)

interface Par {
	id: string
	type: string
	text: string
	kind: null
	newkind: null
	parents?: string[]
	children: Par[]
	childs: []
	hide: boolean
	main: boolean
	psevdo?: string
}
//
// локальный буфер редактирования
const draft = ref<Par>({
	id: 'start',
	type: 'start',
	text: 'start',
	kind: null,
	newkind: null,
	children: [],
	childs: [],
	hide: false,
	main: true,
})

const isSwitching = ref(false)
let timer: ReturnType<typeof setTimeout> | null = null

watch(partition, (next, prev) => {
	if (!prev || !next) return // не показываем оверлей при открытии/закрытии панели
	isSwitching.value = true
	clearTimeout(timer!)
	timer = setTimeout(() => (isSwitching.value = false), 180)
})

const showTree = ref(false)
const field = ref()

const selectOptions = computed<string[]>(() => {
	if (!draft.value.childs || draft.value.childs.length == 0) return []
	return draft.value.childs.map((child: any) => child.text)
})

const insert = (nodes: Par[]) => {
	if (draft.value) {
		draft.value.children = [...nodes]
	}
}

const clearId = ref<null | string>(null)

const emit = defineEmits(['add', 'remove'])

const removedIds = ref<Set<string>>(new Set())

// то, что реально присоединено — берём из дерева (partition), минус то, что помечено на удаление
const attachedSections = computed(() => {
	if (!partition.value?.children) return []
	return partition.value.children.filter((c: any) => !removedIds.value.has(c.id))
})

const removeAttached = (chip: any) => {
	removedIds.value.add(chip.id) // не трогаем дерево — только помечаем, применится по кнопке
}

const removeDraftField = (index: number, chip: any) => {
	clearId.value = chip.id
	draft.value?.children.splice(index, 1)
}

// клонируем draft при открытии; children — чистая area для НОВЫХ добавлений, не копия старых
watch(
	() => [visible.value, partition.value] as const,
	([isVisible, par]) => {
		if (isVisible && par) {
			draft.value = { ...par, children: [] }
			removedIds.value = new Set()
		}
	},
	{ immediate: true }
)

watch(visible, (isVisible) => {
	if (!isVisible) {
		showTree.value = false
		field.value = undefined
		clearId.value = null
		part.selectedIds.clear()
	}
})

const save = () => {
	if (!draft.value || !partition.value) return
	const { children, ...rest } = draft.value
	Object.assign(partition.value, rest) // structural children не трогаем — этим владеет he-tree
	visible.value = false
	if (children.length) emit('add', children)
	if (removedIds.value.size) emit('remove', [...removedIds.value])
}
</script>

<template lang="pug">
q-drawer(v-model='visible' side='right' :width="480" overlay persistent bordered behavior="desktop")
	.panel(v-if="partition")
		transition(name="skeleton-fade")
			.panel-skeleton-overlay(v-if="isSwitching" key="skeleton")

		.zg
			q-btn(flat round icon="mdi-close" color="primary" dense @click="visible = false") 
			div {{ partition.text }}

		q-scroll-area(ref="scrollAreaRef" style="height: 100%")

			.grid2(v-if="draft && mode !== 'add'")
				label Псевдоним:
				q-input(v-model="draft.psevdo" dense outlined)
				label Раздел:
				.txt1
					template(v-for="item in draft.parents" :key="item")
						div {{ item }}
						.q-mx-sm >
					div {{ draft.text }}
				.sec Пусто как-то. Может еще что-то сюда добавить? <br /> Список полей раздела?

			template(v-if="mode === 'add'")
				.text-h6.text-center.q-mb-md Присоединить раздел

				.section
					span Оригинальный раздел
				.grid2
					label Оригинальный раздел:
					q-input(v-model="draft.text" dense outlined)
					label Оригинальное поле:
					q-select(v-model="field" dense optionsDense outlined :options="selectOptions")
				.section
					span Присоединяемый раздел / поле
				.q-ma-md()
					.column.items-start.q-gutter-y-sm
						.mai(v-for="(chip, index) in draft.children" :key="chip.id")
							.txt
								template(v-for="item in chip.parents" :key="item")
									div {{ item }}
									.q-mx-sm >
								div {{ chip.text }}
								q-btn.q-ml-sm(flat round icon="mdi-close" color="blue-grey-5" @click="removeDraftField(index, chip)" size="sm") 
					.tree
						PartitionTree1(@update:selected="insert" v-model:clear='clearId')

				.section
					span Условие

				.text-center
					q-btn(outline color="primary" label="Задать условие" size='sm' @click="conditionDialog = true") 
					br
					br
					br

	.actions
		q-btn(flat color="primary" label="Отмена" @click="visible = false") 
		q-btn(unelevated color="primary" label="Применить" @click="save") 

	BuildConditionDialog(v-model="conditionDialog")
</template>

<style scoped lang="scss">
.panel-content {
	height: 100%;
}
.panel {
	height: calc(100% - 95px);
}
.tree {
	background: var(--bgLight);
	width: 100%;
	padding: 0.5rem;
	border-radius: 0.5rem;
	border: var(--border);
	margin-bottom: 2rem;
}
.actions {
	display: flex;
	width: 100%;
	justify-content: end;
	position: absolute;
	bottom: 0;
	right: 0;
	padding: 0.5rem 1rem;
	box-shadow: 0 -2px 7px rgba($color: #000000, $alpha: 0.2);
	z-index: 2;
}
.zg {
	padding: 0.25rem 1rem;
	font-size: 0.7rem;
	border-bottom: 1px solid #cfdbec;
	display: flex;
	align-items: center;
	color: $primary;
	gap: 0.25rem;
	.q-btn {
		margin-top: -3px;
	}
}
:deep(.q-drawer__content) {
	position: relative;
}
.panel-skeleton-overlay {
	position: absolute;
	inset: 0;
	background: var(--bgLight);
	z-index: 1;
}
.skeleton-fade-enter-active,
.skeleton-fade-leave-active {
	transition: opacity 0.45s ease;
}
.skeleton-fade-enter-from,
.skeleton-fade-leave-to {
	opacity: 0;
}
.grid2 {
	display: grid;
	grid-template-columns: auto 1fr;
	align-items: center;
	column-gap: 1rem;
	row-gap: 0.5rem;
	margin: 1rem;
}
.section {
	background: $secondary;
	color: white;
	font-size: 1.1rem;
	padding-left: 0.5rem;
	margin-bottom: 0.5rem;
	display: flex;
	align-items: center;
	.q-icon {
		font-size: 1.4rem;
	}
	span {
		margin-left: 0.5rem;
	}
}
.mai {
	display: flex;
	justify-content: start;
	align-items: center;
	background: var(--selection);
	padding: 2px 16px;
	padding-right: 2px;
	border-radius: 5rem;
	margin-bottom: 0.5rem;
}
.txt {
	display: flex;
	align-items: center;
	justify-self: start;
	flex-wrap: wrap;
	font-size: 0.9rem;
	background: var(--selection);
	// padding: 0.5rem 1rem;
	border-radius: 2rem;
}
.txt1 {
	display: flex;
	align-items: center;
	justify-self: start;
	flex-wrap: wrap;
	font-size: 0.9rem;
	background: var(--selection);
	padding: 0.5rem 1rem;
	border-radius: 2rem;
}
.sec {
	margin-top: 2rem;
	color: $secondary;
	grid-column: 1/-1;
}
</style>

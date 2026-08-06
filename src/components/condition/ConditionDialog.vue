<script setup lang="ts">
import { computed, ref } from 'vue'
import { Draggable } from '@he-tree/vue'
import '@he-tree/vue/style/default.css'
import '@he-tree/vue/style/material-design.css'
import type {
	ConditionNode,
	ConditionGroupNode,
	ConditionLeafNode,
} from '@/components/condition/conditionTypes'
import { ConditionResult } from '@/components/condition/conditionTypes'

interface List {
	id: string
	text: string
	text1: string
	selected: boolean
	hidden: boolean
	type: number
	author: string
}

const modelValue = defineModel<boolean>()
const treeRef = ref()

const props = defineProps<{
	etapList: List[]
	goalStageId: string | null
	tree: ConditionGroupNode
}>()

const emit = defineEmits<{
	'update:tree': [value: ConditionGroupNode]
}>()

const goalStage = computed(() => {
	return props.etapList.find((el: List) => el.id == props.goalStageId)
})

// Локальная копия дерева для редактирования в модалке
// localTree остаётся единственным источником правды — объект
const localTree = ref<ConditionGroupNode>(JSON.parse(JSON.stringify(props.tree)))

// А для he-tree — обёртка в массив
const treeData = computed({
	get: () => [localTree.value],
	set: (value) => {
		localTree.value = value[0]
	},
})

// Список этапов минус целевой
const stageOptions = computed(() => props.etapList.filter((etap) => etap.id !== props.goalStageId))

// Сохранение и закрытие
const handleSave = () => {
	// emit('update:tree', localTree.value)
	emit('update:tree', treeRef.value)
	modelValue.value = false
}

// Добавление группы/листа в корень (потом будет и для вложенных групп)
const addCondition = (kind: 'leaf' | 'group') => {
	if (kind === 'leaf') {
		const item: ConditionLeafNode = {
			id: crypto.randomUUID(),
			kind: 'leaf',
			stageId: null,
			result: ConditionResult.Positive,
		}
		treeRef.value.add(
			item,
			treeRef.value.rootChildren[0],
			treeRef.value.rootChildren[0].children.length
		)
	} else {
		const item: ConditionGroupNode = {
			id: crypto.randomUUID(),
			kind: 'group',
			type: 'AND',
			children: [],
		}
		treeRef.value.add(
			item,
			treeRef.value.rootChildren[0],
			treeRef.value.rootChildren[0].children.length
		)
	}
}

// Достаём текст этапа по id, с fallback на случай, если ещё не выбран
const stageLabel = (stageId: string | null): string => {
	if (!stageId) return '(этап не выбран)'
	const stage = props.etapList.find((el) => el.id === stageId)
	return stage ? stage.text : stageId
}

const serializeCondition = (node: ConditionNode): string => {
	if (node.kind === 'leaf') {
		return `${stageLabel(node.stageId)} = ${node.result}`
	}

	// group
	if (node.children.length === 0) {
		return '[нет условий]'
	}

	const operatorText = node.type === 'AND' ? ' И ' : ' ИЛИ '

	const parts = node.children.map((child) => {
		const childStr = serializeCondition(child)
		// Оборачиваем в скобки вложенную группу с несколькими детьми,
		// чтобы не терялся приоритет операторов
		if (child.kind === 'group' && child.children.length > 1) {
			return `(${childStr})`
		}
		return childStr
	})

	return parts.join(operatorText)
}

// Для реактивного отображения в шаблоне
const conditionPreview = computed(() => serializeCondition(localTree.value))

const next = (e: any) => {
	e.data.type == 'OR' ? (e.data.type = 'AND') : (e.data.type = 'OR')
}
const toggle = (e: Stat) => {
	e.open = !e.open
}

const remove = (e: Stat) => {
	treeRef.value.remove(e)
}

const isDrop = (e: any) => {
	if (e.data.kind == 'group') return true
	else return false
}
const isDrag = (e: any) => {
	if (e.data.id == 'root') return false
	return true
}
// const etap = ref('')
// const semant = ref('')
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
q-dialog(v-model="modelValue" backdrop-filter="blur(4px) saturate(150%)")
	q-card(style='min-width: 700px;')
		q-btn.close(icon="mdi-close" color="negative" round dense v-close-popup)
		q-card-section
			.text-h6 Условие старта этапа "{{ goalStage?.text }}"

		.scroll
			div
				Draggable(ref="treeRef"
					treeLine
					v-model="treeData"
					:indent="30"
					:eachDroppable="isDrop"
					:eachDraggable="isDrag"
					:root-droppable="false"
					class='mtl-tree'
					)

					template(#default="{ node, stat }")
						.zero(v-if='stat.data.kind == "group"')
							q-icon.trig(name="mdi-chevron-down" v-if="stat.children.length" @click.stop="toggle(stat)" :class="{ 'closed': !stat.open }")
							.root
								.icon(:class="{or : stat.data.type === 'OR'}" @click.stop="next(stat)")
								.q-ml-md Оператор
								.text-weight-bold.q-ml-sm {{stat.data.type == 'AND' ? 'И' : 'ИЛИ'}}
							q-btn.closing(v-if='stat.data.id !== "root"' dense flat round color="secondary" icon="mdi-close" size='sm' @click='remove(stat)') 

						.node(v-else)
							.myrow
								q-select(outlined label='Этап' :options='stageOptions' dense v-model='node.stageId' map-options emit-value option-label='text' option-value='id')
								q-select(outlined label='Семантика завершения' :options='semoptions' dense v-model='node.result')
							q-btn.closing(v-if='!node.root' dense flat round color="secondary" icon="mdi-close" size='sm' @click='remove(stat)') 

			.q-mt-md
				.text-caption Условие:
				pre.text-caption {{ conditionPreview }}

		q-card-actions(align="right")
			q-btn(flat color="primary" icon='mdi-plus-circle-outline' label="Условие" @click="addCondition('leaf')") 
			q-btn(flat color="primary" icon='mdi-plus-circle-outline' label="Оператор" @click="addCondition('group')") 
			q-space
			q-btn(flat color="primary" label="Отмена" v-close-popup) 
			q-btn(unelevated color="primary" label="Сохранить" @click="handleSave" v-close-popup) 
</template>

<style scoped lang="scss">
.node {
	width: 100%;
	display: flex;
	align-items: center;
	background: var(--bgLight);
	position: relative;
	padding: 2px 10px;
	border-radius: 0.25rem;
	border: 1px solid var(--bgLight);
	.closing {
		position: absolute;
		right: 0.5rem;
		display: none;
	}
	&:hover {
		border-color: $secondary;
		.closing {
			display: block;
		}
	}
}
.root {
	display: flex;
	justify-content: start;
	align-items: center;
}
.zero {
	width: 100%;
	display: flex;
	justify-content: start;
	align-items: center;
	margin-bottom: 4px;
	margin-top: 4px;
	position: relative;
	.closing {
		position: absolute;
		right: 0.5rem;
		display: none;
	}
	&:hover {
		.closing {
			display: block;
		}
	}
}
.trig {
	font-size: 1.3rem;
	transition: 0.2s ease all;
	margin-right: 0.25rem;

	&.closed {
		transform: rotate(-90deg);
	}
}
.scroll {
	min-height: 100px;
	max-height: 500px;
	margin: 0 1rem;
}
pre {
	background: #f5f5f5;
	padding: 8px;
	border-radius: 4px;
	font-size: 12px;
	white-space: pre-wrap; // ← добавить
	word-break: break-word; // ← на случай очень длинных слов/имён этапов
}
.icon {
	width: 49px;
	height: 36px;
	background-image: url('@/assets/img/andor.svg');
	transition: 0.2s ease-out all;
	background-position: top left;
	cursor: pointer;
	&.or {
		background-position: bottom left;
	}
}
.empty {
	display: flex;
	justify-content: center;
	align-items: center;
	text-align: center;
	color: $grey;
	margin-top: 1rem;
	margin-bottom: 1rem;
	gap: 1rem;
}
.myrow {
	display: grid;
	grid-template-columns: 1fr 1fr 48px;
	column-gap: 1rem;
	width: 100%;
	row-gap: 0.5rem;
}
:deep(.drag-placeholder) {
	min-height: 48px;
	border-radius: 0.25rem;
	background: $blue-grey-3;
}
</style>

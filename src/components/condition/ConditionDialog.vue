<script setup lang="ts">
import { computed, ref } from 'vue'
import type {
	ConditionNode,
	ConditionGroupNode,
	ConditionLeafNode,
} from '@/components/condition/conditionTypes'
import { ConditionResult } from '@/components/condition/conditionTypes'
import ConditionGroup from '@/components/condition/ConditionGroup.vue'

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
const localTree = ref<ConditionGroupNode>(JSON.parse(JSON.stringify(props.tree)))

// Список этапов минус целевой
const stageOptions = computed(() => props.etapList.filter((etap) => etap.id !== props.goalStageId))

// Сохранение и закрытие
const handleSave = () => {
	emit('update:tree', localTree.value)
	modelValue.value = false
}

// Добавление группы/листа в корень (потом будет и для вложенных групп)
const addConditionToRoot = (kind: 'leaf' | 'group') => {
	if (kind === 'leaf') {
		const newLeaf: ConditionLeafNode = {
			id: crypto.randomUUID(),
			kind: 'leaf',
			stageId: null,
			result: ConditionResult.Positive,
		}
		localTree.value.children.push(newLeaf)
	} else {
		const newGroup: ConditionGroupNode = {
			id: crypto.randomUUID(),
			kind: 'group',
			type: 'AND',
			children: [],
		}
		localTree.value.children.push(newGroup)
	}
}

const serializeCondition = (tree: any) => {
	return 'fuuuuck'
}
</script>

<template lang="pug">
q-dialog(v-model="modelValue" backdrop-filter="blur(4px) saturate(150%)")
	q-card
		q-btn.close(icon="mdi-close" color="negative" round dense v-close-popup)
		q-card-section
			.text-h6 Условие старта этапа "{{ goalStage?.text }}"

		.scroll
			.text-caption.text-grey Целевой этап: <strong>{{ goalStageId }}</strong>
			.q-mt-md
				ConditionGroup(
					v-model="localTree"
					:stage-options="stageOptions"
					@add-leaf="addConditionToRoot('leaf')"
					@add-group="addConditionToRoot('group')"
				)
			.q-mt-md
				.text-caption Условие (текстовое превью):
				pre.text-caption {{ serializeCondition(localTree) || 'fuck' }}

		q-card-actions(align="right")
			q-btn(flat color="primary" label="Отмена" v-close-popup) 
			q-btn(unelevated color="primary" label="OK" @click="handleSave" v-close-popup) 
</template>

<style scoped lang="scss">
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
}
</style>

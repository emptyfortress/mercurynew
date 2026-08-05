<script setup lang="ts">
import { computed, ref } from 'vue'
import ConditionDialog from '@/components/condition/ConditionDialog.vue'
import type {
	ConditionNode,
	ConditionGroupNode,
	ConditionLeafNode,
} from '@/components/condition/conditionTypes'

const etaps = ref([
	{
		id: 'dogovor-1-1-1',
		text: 'Получение документа',
		text1: '',
		selected: false,
		hidden: false,
		type: 3,
		author: 'admin',
		template: true,
		fields: [],
		children: [],
	},
	{
		id: 'dogovor-1-1-2',
		text: 'Правовая экспертиза',
		text1: '',
		selected: false,
		hidden: false,
		type: 3,
		author: 'admin',
		template: true,
		fields: [],
		children: [],
	},
	{
		id: 'dogovor-1-1-3',
		text: 'Формирование заключения',
		text1: '',
		selected: false,
		hidden: false,
		type: 3,
		author: 'admin',
		template: true,
		fields: [],
		children: [],
	},
	{
		id: 'dogovor-1-2-1',
		text: 'Проверка бюджета',
		text1: '',
		selected: false,
		hidden: false,
		type: 3,
		author: 'admin',
		fields: [],
		children: [],
	},
	{
		id: 'dogovor-1-2-2',
		text: 'Расчёт условий оплаты',
		text1: '',
		selected: false,
		hidden: false,
		type: 3,
		author: 'admin',
		fields: [],
		children: [],
	},
])

const dialog = ref(false)
const goal = ref('dogovor-1-1-3')

function createEmptyGroup() {
	return {
		id: crypto.randomUUID(),
		type: 'AND',
		children: [],
	}
}

const tree = ref(createEmptyGroup())

const options = computed(() => etaps.value)

const stageOptions = computed(() => {
	return options.value.filter((el: any) => el.id !== goal.value)
})
</script>

<template lang="pug">
.row
	ul
		li(v-for="etap in etaps" :key="etap.id") {{ etap.text }}
	ul
		li(v-for="etap in stageOptions" :key="etap.id") {{ etap.text}}

br
.row.items-center.q-gutter-x-sm
	q-select(
		v-model="goal",
		dense,
		outlined,
		label="Целевой этап",
		:options="options",
		option-label="text",
		option-value="id",
		emit-value,
		map-options,
	)
	q-btn(unelevated color="primary" label="Настроить" @click="dialog = !dialog") 


pre {{ JSON.stringify(tree, null, 2) }}

// here is text preview of condition
div

ConditionDialog(v-model="dialog"
	:etap-list="etaps"
	:goal-stage-id="goal"
	:tree="tree"
	@update:tree="tree = $event"
)
</template>

<style scoped lang="scss">
.q-select {
	width: 400px;
}
</style>

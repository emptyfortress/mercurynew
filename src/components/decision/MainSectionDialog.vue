<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { usePartitionStore } from '@/stores/partition'
import { fields } from '@/stores/fields-poisk'
import FieldTree3 from '@/components/decision/FieldTree3.vue'
import { filterByCommon, filterByLabel } from '@/utils/utils'

const modelValue = defineModel<boolean>()

const part = usePartitionStore()
const type = ref()

const data = computed(() => {
	return filterByCommon(fields, true)
})

const localSelectedIds = ref<Set<string>>(new Set())
localSelectedIds.value = new Set(part.selectedIds)

const emit = defineEmits(['save'])

const selection = ref()

const save = () => {
	// console.log(selection.value)

	part.selectedIds = new Set(localSelectedIds.value)
	modelValue.value = false
	emit('save', {
		card: type.value,
		part: selection.value,
		psev: psevdo.value,
	})
}
const options = ['Документ', 'Задание', 'Группа заданий', 'Квартальная цель', 'Командировка']
const psevdo = ref('')

const nodeMap = computed(() => {
	const map = {} as any
	const walk = (node: any) => {
		map[node.id] = node
		if (node.children) {
			node.children.forEach(walk)
		}
	}
	data.value.forEach(walk)
	return map
})

watch(
	localSelectedIds,
	(val) => {
		const nodes = [...val].map((id) => nodeMap.value[id])
		const node = nodes[0]
		psevdo.value = 'Ведущий -> ' + node.text
		selection.value = node
	},
	{ deep: true }
)
</script>

<template lang="pug">
q-dialog(v-model="modelValue")
	q-card(style="min-width: 500px")
		q-btn.close(icon="mdi-close" unelevated round dense color="negative" v-close-popup)
		q-card-section
			.text-h6 Ведущий раздел

		q-card-section
			.text-bold 1. Выберите тип карточки
			q-select(v-model="type" dense label="Тип карточки" outlined :options="options")

		q-card-section(v-if='type')
			.text-bold 2. Выберите раздел
			.ogr
				FieldTree3(v-model:localSelectedIds='localSelectedIds' v-model:data='data' :type='type')

		q-card-section(v-if='localSelectedIds && type')
			.text-bold 3. Введите псевдоним
			q-input(v-model="psevdo" dense outlined hint="Поле не обязательно")

		q-card-actions(align="right")
			q-btn(flat color="primary" label="Отмена" v-close-popup) 
			q-btn(unelevated color="primary" label="OK" @click="save") 
</template>

<style scoped lang="scss">
.ogr {
	max-height: 460px;
	overflow-y: auto;
}
</style>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDiagram } from '@/stores/diagram'
import IconAttribute from '@/components/icons/IconAttribute.vue'
import IconFlag from '@/components/icons/IconFlag.vue'
import DiagRootProps from '@/components/panels/DiagRootProps.vue'
import DiagRoleProps from '@/components/panels/DiagRoleProps.vue'
import DiagEtapProps from '@/components/panels/DiagEtapProps.vue'
import DiagVariantProps from '@/components/panels/DiagVariantProps.vue'

const mydiagram = useDiagram()

const next = () => {
	emit('next')
}

const emit = defineEmits(['next'])

const showEtap = computed(() => {
	if (
		mydiagram.selection == 'Старт' ||
		mydiagram.selection == 'Создание заявления' ||
		mydiagram.selection == 'Согласование' ||
		mydiagram.selection == 'Доработка' ||
		mydiagram.selection == 'Завершение'
	)
		return true
})

const showRoot = computed(() => {
	if (mydiagram.selection == 'Заявление') return true
})

const showRole = computed(() => {
	if (
		mydiagram.selection == 'Инициатор' ||
		mydiagram.selection == 'Руководитель' ||
		mydiagram.selection == 'Кадровик'
	)
		return true
})
const item1 = ref(true)
const item2 = ref(true)
</script>

<template lang="pug">
div
	q-list
		q-expansion-item(v-model="item1")
			template(v-slot:header)
				q-item-section(side)
					IconAttribute.ic
				q-item-section.zg Атрибуты

			DiagRootProps(v-if='mydiagram.selection && showRoot' separator)

			DiagRoleProps(v-if='mydiagram.selection && showRole' separator)

			DiagEtapProps(v-if='mydiagram.selection && showEtap' separator)

		q-expansion-item.q-mt-md(v-model="item2" v-if='mydiagram.selection && showEtap')
			template(v-slot:header)
				q-item-section(side)
					IconFlag.ic
				q-item-section.zg Варианты завершения
			DiagVariantProps(separator)

</template>

<style scoped lang="scss">
:deep(area) {
	cursor: pointer;
}
.ic {
	font-size: 1.5rem;
	margin-right: 0.5rem;
	color: $secondary;
}
.zg {
	text-transform: uppercase;
	color: $secondary;
	text-align: left;
}
</style>

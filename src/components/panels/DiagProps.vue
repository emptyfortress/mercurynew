<script setup lang="ts">
import { computed } from 'vue'
import { useDiagram } from '@/stores/diagram'
import IcBaselineDriveFileRenameOutline from '@/components/icons/IcBaselineDriveFileRenameOutline.vue'
import LineiconsFlag2 from '@/components/icons/LineiconsFlag2.vue'
import DiagRootProps from '@/components/panels/DiagRootProps.vue'
import DiagRoleProps from '@/components/panels/DiagRoleProps.vue'
import DiagEtapProps from '@/components/panels/DiagEtapProps.vue'
import DiagVariantProps from '@/components/panels/DiagVariantProps.vue'
import ExpansionItem from '@/components/ExpansionItem.vue'

const mydiagram = useDiagram()

const next = () => {
	emit('next')
}

const emit = defineEmits(['next'])

const showEtap = computed(() => {
	if (
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
</script>

<template lang="pug">
div
	q-list
		ExpansionItem(title="Атрибуты" :icon="IcBaselineDriveFileRenameOutline")
			DiagRootProps(v-if='mydiagram.selection && showRoot' separator)
			DiagRoleProps(v-if='mydiagram.selection && showRole' separator)
			DiagEtapProps(v-if='mydiagram.selection && showEtap' separator)

		ExpansionItem.q-mt-md(title="Варианты завершения" :icon="LineiconsFlag2" v-if='mydiagram.selection && showEtap')
			DiagVariantProps(separator)

</template>

<style scoped lang="scss">
:deep(area) {
	cursor: pointer;
}
</style>

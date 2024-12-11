<script setup lang="ts">
import { computed } from 'vue'
import etapProps from '@/assets/img/etap.png'
import roleProps from '@/assets/img/role.png'
import { useDiagram } from '@/stores/diagram'

const mydiagram = useDiagram()

const next = () => {
	emit('next')
}

const emit = defineEmits(['next'])

const showEtap = computed(() => {
	if (mydiagram.selection == 'Создание заявления' ||
		mydiagram.selection == 'Согласование' ||
		mydiagram.selection == 'Доработка' ||
		mydiagram.selection == 'Завершение') return true
})

const showRole = computed(() => {
	if (mydiagram.selection == 'Инициатор' ||
		mydiagram.selection == 'Руководитель' ||
		mydiagram.selection == 'Кадровик') return true
})

</script>

<template lang="pug">
div
	div Свойства
	template(v-if='showEtap')
		img(:src="etapProps" usemap="#image-map" width="335")
		map(name="image-map")
			area(target="_self" alt="next" title="next" @click="next" coords="299,154,346,197" shape="rect")

	template(v-if='showRole')
		img(:src="roleProps" usemap="#image-map" width="335")
		map(name="image-map")
			area(target="_self" alt="next" title="next" @click="next" coords="275,209,330,248" shape="rect")

</template>

<style scoped lang="scss">
:deep(area) {
	cursor: pointer;
}
</style>

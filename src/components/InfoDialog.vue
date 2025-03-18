<script setup lang="ts">
import start from '@/assets/img/start.png'
import and from '@/assets/img/and.png'
import or from '@/assets/img/or.png'

const modelValue = defineModel<boolean>()

const emit = defineEmits(['remove'])

const remove = (() => {
	emit('remove')
	modelValue.value = false
})
</script>

<template lang="pug">
q-dialog(v-model="modelValue" backdrop-filter="blur(4px) saturate(150%)")
	q-card
		q-btn.close(icon="mdi-close" color="negative" round dense v-close-popup)
		q-card-section.row.items-center.q-pb-none
			.text-h6 Настройка сложных запросов

		q-card-section
			ul
				li Вы можете свободно добавлять, перестаскивать,  ресайзить и удалять условия
				li Условия оцениваются сверху-вниз, слева направо
					q-img(:src='start' width="200px")
				li Условия, находящиеся друг под другом, оцениваются по И
					q-img(:src='and' width="200px")
				li Условия, находящиеся рядом, оцениваются по ИЛИ
					q-img(:src='or' width="200px")

		q-card-actions(align="right")
			q-btn(unelevated color="primary" label="Понятно" v-close-popup) 
</template>

<style scoped lang="scss">
ul {
	// margin-left: 0;
	padding-left: 1rem;
}
</style>

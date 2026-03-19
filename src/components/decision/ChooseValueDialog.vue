<script setup lang="ts">
import { ref, watch } from 'vue'
import '@he-tree/vue/style/default.css'
import '@he-tree/vue/style/material-design.css'

const modelValue = defineModel<boolean>()
const props = defineProps({
	type: {
		type: Number,
		required: true,
		default: 0,
	},
})
</script>

<template lang="pug">
q-dialog(v-model="modelValue" backdrop-filter="blur(4px) saturate(150%)")
	q-card(style="min-width: 400px;")
		q-btn.close(round color="negative" icon="mdi-close" v-close-popup)
		q-card-section.q-py-md
			.text-h6(v-if='props.type == 0') Справочник
			.text-h6(v-if='props.type == 1') Справочник сотрудников
			.text-h6(v-if='props.type == 2') Выбор времени

		q-card-section
			div Здесь содержимое окна.

		q-card-actions(align='right')
			q-btn(flat label="Отмена" v-close-popup color="primary")
			q-btn(unelevated label="Подтвердить" color="primary" v-close-popup)
</template>

<style scoped lang="scss">
:deep(.q-card__actions) {
	margin-right: 0.5rem;
	margin-bottom: 0.5rem;
}
</style>

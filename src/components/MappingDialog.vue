<script setup lang="ts">
import Mapping from '@/components/Mapping.vue'

const props = defineProps({
	bd: {
		type: String,
		required: true,
		default: '',
	},
})

const modelValue = defineModel<boolean>()

const close = () => {
	modelValue.value = false
}

const reset = () => {}

const emit = defineEmits(['publish'])

const publish = () => {
	emit('publish')
	close()
	reset()
}
</script>

<template lang="pug">
q-dialog(v-model="modelValue")
	q-card(style="min-width: 680px;")
		q-btn.close(round color="negative" icon="mdi-close" v-close-popup)
		q-card-section
			.text-h6 Настройте маппинг справочников

		q-form(@submit="publish")
			.q-mx-md
				Mapping(:bd="props.bd")

			q-card-actions.q-mx-sm.q-mt-xl(align="right")
				q-btn(flat color="primary" label="Сбросить" @click="reset")
				q-space
				q-btn(flat color="primary" label="Отмена" @click="close")
				q-btn(unelevated color="primary" label="Подтвердить" type="submit")
</template>

<style scoped lang="scss">
.q-chip--selected {
	background: $primary;
	color: white;
}

:deep(.q-chip__icon) {
	color: white;
}
</style>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
	row: {
		type: Object,
		required: true,
	},
})

const modelValue = defineModel<boolean>()
const emit = defineEmits(['reject'])

const reason = ref('')

const onHide = () => {
	reason.value = ''
}

const close = () => {
	modelValue.value = false
}

const reject = () => {
	if (props.row) {
		emit('reject', props.row, reason.value)
		close()
	}
}
</script>

<template lang="pug">
q-dialog(v-model="modelValue" @hide="onHide")
	q-card(style="min-width: 500px;")
		q-btn.close(round color="negative" icon="mdi-close" v-close-popup)
		q-card-section
			.text-h6 Отклонить публикацию

		.q-mx-md
			div Укажите причину отклонения:
			q-input.q-mt-md(v-model="reason" dense type="textarea" outlined autogrow)

		q-card-actions.q-mx-sm.q-mt-xl(align="right")
			q-btn(flat color="primary" label="Отмена" v-close-popup)
			q-btn(unelevated color="primary" label="Отклонить" @click='reject')
</template>

<style scoped lang="scss">
:deep(.q-field__control:before) {
	// background: #fff;
}
.close {
	position: absolute;
	top: 0.5rem;
	right: 0.5rem;
	z-index: 1;
}
</style>

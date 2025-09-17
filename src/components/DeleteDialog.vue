<script setup lang="ts">
import { ref } from 'vue'
const modelValue = defineModel<boolean>()

const props = defineProps({
	field: {
		type: String,
		required: true,
		default: '',
	},
})
const emit = defineEmits(['remove'])
const remove = () => {
	emit('remove')
}
const check = ref(false)
</script>

<template lang="pug">
q-dialog(v-model="modelValue")
	q-card(style="min-width: 400px;")
		q-btn.close(round color="negative" icon="mdi-close" v-close-popup)
		q-card-section
			.text-h6
				|Удалить поле
				span "{{ props.field }}"?
		q-card-section Поле может использоваться в разных формах. При удалении его из библиотеки оно будет удалено повсеместно.
		q-card-actions(align='right')
			q-checkbox(v-model="check" label="Больше не спрашивать")
			q-space
			q-btn(flat color="primary" label="Отмена" v-close-popup) 
			q-btn(unelevated color="primary" label="Удалить" @click="remove" v-close-popup) 

</template>

<style scoped lang="scss">
span {
	color: $primary;
	margin-left: 1rem;
}
</style>

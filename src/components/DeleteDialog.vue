<script setup lang="ts">
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
</script>

<template lang="pug">
q-dialog(v-model="modelValue")
	q-card(style="min-width: 400px;")
		q-btn.close(round color="negative" icon="mdi-close" v-close-popup)
		q-card-section
			.text-h6
				|Удалить поле
				span "{{ props.field }}"?
		q-card-section Поле может использоваться в других формах. При удалении его из библиотеки оно будет удалено повсеместно.
		q-card-actions(align='right')
			q-btn(flat color="primary" label="Отмена" v-close-popup) 
			q-btn(unelevated color="primary" label="Удалить" @click="remove" v-close-popup) 

</template>

<style scoped lang="scss">
span {
	color: $primary;
	margin-left: 1rem;
}
</style>

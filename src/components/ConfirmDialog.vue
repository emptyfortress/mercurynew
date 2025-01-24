<script setup lang="ts">

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
			.text-h6 Вы уверены?

		q-card-section
			ul
				li Удаление группы одновременно удалит все приложения, входящие в данную группу.
				li Данное действие нельзя отменить.

		q-card-actions(align="right")
			q-btn(flat color="primary" label="Отмена" v-close-popup) 
			q-btn(unelevated color="primary" label="Удалить группу и приложения" @click="remove") 
</template>

<style scoped lang="scss"></style>

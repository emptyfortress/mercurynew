<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
	mode: {
		type: String,
		required: true,
		default: '',
	},
})
const modelValue = defineModel<boolean>()

const emit = defineEmits(['remove'])

const remove = () => {
	emit('remove')
	modelValue.value = false
}
const serv = ref('1')
</script>

<template lang="pug">
q-dialog(v-model="modelValue" backdrop-filter="blur(4px) saturate(150%)")
	q-card
		q-btn.close(icon="mdi-close" color="negative" round dense v-close-popup)
		q-card-section.row.items-center.q-pb-none
			.text-h6(v-if='props.mode == "version"') Приложение опубликовано
			.text-h6(v-if='props.mode == "publ"') Опубликовать приложение
			// .text-h6(v-else) Вы уверены?

		q-card-section
			div(v-if='props.mode == "publ"')
				div Выберите сервер для публикации:
				.column
					q-radio(v-model="serv" val="1" label="DV-test (тестовый)")
					q-radio(v-model="serv" val="2" label="DV-test1 (предбовевой)")
					q-radio(v-model="serv" val="3" label="DV-prod (production)")

			ul(v-if='props.mode == "version"')
				li Приложение опубликовано на сервере DV-prod и не может быть удалено.

			// ul(v-else)
			// 	li Удаление группы одновременно удалит все приложения, входящие в данную группу.
			// 	li Данное действие нельзя отменить.

		q-card-actions(align="right")
			q-btn(flat color="primary" label="Отмена" v-close-popup) 
			q-btn(v-if='props.mode == "publ"' unelevated color="primary" label="Опубликовать" v-close-popup) 
</template>

<style scoped lang="scss"></style>

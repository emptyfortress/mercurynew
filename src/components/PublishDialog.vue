<script setup lang="ts">
import { computed, ref } from 'vue';

interface Props {
	newversion: boolean
}
const props = defineProps<Props>()

const modelValue = defineModel<boolean>()
const comment = defineModel<string>('comment')

const emit = defineEmits(['create', 'publish'])


const create = () => {
	emit('create', com.value)
	com.value = ''
}

const publish = () => {
	emit('publish', comment.value)
}

const word = computed(() => {
	return props.newversion == true ? 'Создать' : 'Опубликовать'
})

const calcAction = computed(() => {
	return props.newversion == true ? create : publish
})
const com = ref('')

</script>

<template lang="pug">
q-dialog(v-model="modelValue")
	q-card(style="min-width: 400px;")
		q-btn.close(round color="negative" icon="mdi-close" v-close-popup)
		q-card-section
			.text-h6 {{ word }} версию
		q-card-section
			FormKit(type="form" id="newapp" :submit-label="word" @submit="calcAction")
				FormKit(v-if='newversion' type="text" autofocus v-model="com" label="Комментарий" help="Краткое описание версии" validation="required|length:3")
				FormKit(v-else type="text" autofocus v-model="comment" label="Комментарий" help="Краткое описание версии" validation="required|length:3")

</template>

<style scoped lang="scss"></style>

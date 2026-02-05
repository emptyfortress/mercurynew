<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
	razmet: {
		type: String,
		required: true,
	},
})

const con = computed(() => {
	switch (props.razmet) {
		case '0':
			return 'Конструктор разметок'
		case '1':
			return 'Конструктор состояний'
		case '2':
			return 'Конструктор ролей'
		case '5':
			return 'Конструктор разметок для типа'
		case '4':
			return 'Конструктор расширенных полей'
		case '6':
			return 'Метаданные'
		default:
			return 'error'
	}
})
</script>

<template lang="pug">
q-page(padding)
	.container
		.text-h6 {{ con }}
</template>

<style scoped lang="scss">
.container {
	max-width: 1200px;
	margin: 0 auto;
}
</style>

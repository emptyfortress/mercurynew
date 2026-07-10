<script setup lang="ts">
import { computed } from 'vue'
import RolesConstructor from '@/components/decision/RolesConstructor.vue'
import Matrix from '@/components/decision/Matrix.vue'
import RazmetConstructor from '@/components/decision/RazmetConstructor.vue'

const props = defineProps({
	razmet: {
		type: String,
		required: true,
	},
})

const con = computed(() => {
	switch (props.razmet) {
		case '0':
			return 'Конструктор полей'
		case '1':
			return 'Конструктор состояний'
		case '102':
			return 'Конструктор ролей'
		case '12':
			return 'Конструктор разметок'
		case '103':
			return 'Матрица доступа'
		case '5':
			return 'Конструктор расширенных полей'
		case '6':
			return 'Метаданные'
		default:
			return 'error'
	}
})
</script>

<template lang="pug">
div
	Matrix(v-if='razmet == "103"')
	q-page(padding v-else)
		.container
			.text-h6(v-if='razmet !== "12"') {{ con }}
			RolesConstructor(v-if='razmet == "102"')
			RazmetConstructor(v-if='razmet == "12"')

			// div {{ simpleStore.selectedElement }}
</template>

<style scoped lang="scss">
.container {
	max-width: 1200px;
	margin: 0 auto;
}
</style>

<script setup lang="ts">
import { ref } from 'vue'
import MySelect from '@/components/common/MySelect.vue'

const main = ref('Подготовка')
</script>

<template lang="pug">
q-markup-table.tbl(flat)
	thead
		tr
			th.text-left Вариант завершения
			th.text-left Статус по завершению
	tbody
		tr
			td
				.link Кнопка
			td
				MySelect(v-model:main="main")
</template>

<style scoped lang="scss">
.tbl {
	margin-left: 1rem;
	margin-right: 1rem;
	td,
	th {
		padding-left: 0.5rem;
		padding-right: 0.5rem;
		text-align: left;
	}
}
th {
	border-bottom: 1px solid #ccc;
	padding-bottom: 0;
}
.link {
	color: $primary;
	text-decoration: underline;
}
</style>

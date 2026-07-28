<script setup lang="ts">
import { ref } from 'vue'

const imp = ref('')
const com = ref('')
</script>

<template lang="pug">
fieldset
	legend Специальный сервис логики этапа
	.grid2
		q-input(v-model="imp" dense label="Имя сервиса" outlined)
			template(v-slot:append)
				q-icon(name="mdi-dots-horizontal" color="primary")
		.info
			q-icon.q-mr-sm(name="mdi-information-outline" color="secondary" size="18px")
			|Используется только в усовершенствованном согласовании

		q-input(v-model="com" dense label="Комментарий" type='textarea' outlined)

</template>

<style scoped lang="scss">
.info {
	color: $secondary;
}
.grid2 {
	// margin-top: 1rem;
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	justify-items: stretch;
	align-items: start;
	column-gap: 2rem;
	row-gap: 0.5rem;
}
</style>

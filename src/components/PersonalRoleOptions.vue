<script setup lang="ts">
import { ref } from 'vue'

const pers = defineModel()

const options = [
	{ label: 'Руководитель инициатора', value: 'Руководитель инициатора' },
	{ label: 'Конкретный сотрудник', value: 'Конкретный сотрудник' },
	{ label: 'Сотрудник из поля в приложении', value: 'Сотрудник из поля в приложении' },
	{ label: 'Руководитель подразделения', value: 'Руководитель подразделения' },
	{ label: 'Руководитель персональной роли', value: 'Руководитель персональной роли' },
]
const sotrZam = ref(false)
const sotr = ref('one')
const item = ref()
</script>

<template lang="pug">
.grid
	q-option-group(
		:options="options"
		type="radio"
		v-model="pers")

	.desc
		div(v-if='pers == "Руководитель инициатора"')
			.des Руководитель сотрудника, создавшего заявление на отпуск

		div(v-if='pers == "Конкретный сотрудник"')
			.des Любой сотрудник из справочника сотрудников
			q-select(dense filled label="Сотрудник" v-model="item")
				template(v-slot:prepend)
					q-icon(name="mdi-account" color="primary")
			q-checkbox.q-mt-md(v-model="sotrZam" dense label='Включая заместителей')

		div(v-if='pers == "Сотрудник из поля в приложении"')
			.des Сотрудник из поля в приложении
			q-select(dense filled label="Поле" v-model="item")
				template(v-slot:prepend)
					q-icon(name="mdi-account" color="primary")
			q-checkbox.q-mt-md(v-model="sotrZam" dense label='Включая заместителей')

		div(v-if='pers == "Руководитель подразделения"')
			.des Руководитель любого подразделения из справочника
			q-select(dense filled label="Подразделение" v-model="item")
				template(v-slot:prepend)
					q-icon(name="mdi-office-building" color="primary")
			q-checkbox.q-mt-md(v-model="sotrZam" dense label='Включая заместителей')

		div(v-if='pers == "Руководитель персональной роли"')
			.des Руководитель выбранной роли
			q-select(dense filled label="Роль" v-model="item")
				template(v-slot:prepend)
					q-icon(name="mdi-guy-fawkes-mask" color="primary")
			q-checkbox.q-mt-md(v-model="sotrZam" dense label='Включая заместителей')
			q-select(dense filled label="Роль" v-model="item")
				template(v-slot:prepend)
					q-icon(name="mdi-guy-fawkes-mask" color="primary")
</template>

<style scoped lang="scss">
.grid {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	justify-items: start;
	align-items: start;
	column-gap: 2rem;
}

.desc {
	border-left: 1px solid #ccc;
	height: 100%;
	padding-left: 1rem;
}

.des {
	font-weight: 600;
	margin-bottom: 1rem;
}

.sma {
	font-size: 0.8rem;
}
</style>

<script setup lang="ts">
import { is } from 'quasar'
import { computed, ref, watch } from 'vue'

const modelValue = defineModel<boolean>()

const expanded = ref(false)
const user = ref('')
const card = ref('')

const userOptions = [
	'Иванов И. И.',
	'Петрова А. С.',
	'Сидоров Д. А.',
	'Кузнецова М. В.',
	'Смирнов А. Н.',
]
const cardOptions = ['Заявка', 'Договор', 'Задание', 'Служебная записка']

const isRuleDisabled = computed(() => !user.value || !card.value)

watch([user, card], ([newUser, newCard]) => {
	if (!newUser || !newCard) {
		modelValue.value = false
	}
})

const label = computed(() => {
	return modelValue.value ? 'Сбросить' : 'Применить'
})
</script>

<template lang="pug">
q-expansion-item(icon='mdi-account-tie' header-class="text-primary" v-model='expanded')
	template(v-slot:header)
		q-item-section(side)
			q-checkbox(dense v-model="modelValue" @click.stop :disable="isRuleDisabled")
		q-item-section
			span.text-primary(@click.stop='expanded = !expanded') Фильтр ролей
	q-card
		p Для просмотра прав доступа сотрудника к конкретной карточке  - выберите его из справочника и укажите карточку.
		.selector
			q-select(v-model="user" label='Сотрудник' outlined dense :options="userOptions" clearable)
			q-select(v-model="card" label='Карточка' outlined dense :options="cardOptions" clearable)
			q-btn(unelevated color="primary" :label="label" @click="modelValue = !modelValue" :disable="isRuleDisabled") 
</template>

<style scoped lang="scss">
:deep(.q-expansion-item--expanded) {
	border: 1px solid $secondary;
	border-radius: 4px;
	background: #e3eaf2;
}
.q-card {
	background: transparent;
	padding: 0.5rem;
	.selector {
		display: grid;
		max-width: 800px;
		grid-template-columns: 1fr 1fr 170px;
		align-items: center;
		column-gap: 0.5rem;
	}
}
</style>

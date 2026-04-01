<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useMatrixStore } from '@/stores/matrix'

type ChipType = 'role' | 'operation' | 'state'

const props = defineProps<{
	type: ChipType
}>()

const modelValue = defineModel()

const matrixStore = useMatrixStore()

const chips = computed(() => {
	if (props.type === 'role') return matrixStore.roles
	if (props.type === 'state') return matrixStore.states
	return matrixStore.operations
})

const useSelect = computed(() => chips.value.length > 10)

const selectedChip = computed(() => chips.value.find((c) => c.selected) ?? chips.value[0])

const filteredChips = ref(chips.value)

function filterChips(val: string, update: (fn: () => void) => void) {
	update(() => {
		const needle = val.toLowerCase()
		filteredChips.value = chips.value.filter((c) => c.label.toLowerCase().includes(needle))
	})
}

function handleChipClick(clickedId: string) {
	chips.value.forEach((c) => {
		c.selected = c.id === clickedId
	})
}

function handleSelectChange(selected: { id: string; label: string }) {
	chips.value.forEach((c) => {
		c.selected = c.id === selected.id
	})
}

const expanded = ref(false)
const rule = ref(false)
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
</script>

<template lang="pug">
.chips-container

	.right(v-if='props.type == "role"')
		q-expansion-item(icon='mdi-account-tie' header-class="text-primary" v-model='expanded')
			template(v-slot:header)
				q-item-section(side)
					q-checkbox(dense v-model="modelValue" @click.stop :disable="isRuleDisabled")
				q-item-section
					span.text-primary(@click.stop='expanded = !expanded') Фильтр ролей
			q-card
				q-select(v-model="user" label='Сотрудник' outlined dense :options="userOptions" clearable)
				q-select(v-model="card" label='Карточка' outlined dense :options="cardOptions" clearable)

	//- Режим селектора (> 10 элементов)

	q-select(
		v-if='useSelect'
		:model-value='selectedChip'
		:options='filteredChips'
		option-label='label'
		option-value='id'
		dense
		outlined
		use-input
		hide-selected
		fill-input
		input-debounce='0'
		style='max-width: 320px'
		@update:model-value='handleSelectChange'
		@filter='filterChips'
	)

	//- Режим чипов (≤ 10 элементов)
	template(v-else)
		q-chip(
			clickable
			v-for='chip in chips'
			:key='chip.id'
			:selected='chip.selected'
			@click='handleChipClick(chip.id)'
		) {{ chip.label }}

	.multi(v-if='modelValue')
		span Отображаются объединённые права доступа для данного сотрудника и карточки. Редактирование в этом режиме невозможно.


	.clear
</template>

<style scoped lang="scss">
:deep(.q-chip) {
	background: hsl(211 34% 79% / 1);
}
:deep(.q-chip--selected) {
	background: $primary;
	color: white;
	i {
		color: white;
	}
}
.right {
	float: right;
	width: 500px;
	margin-top: -8px;
	.q-card {
		background: transparent;
		padding: 0.5rem;
		display: grid;
		grid-template-columns: 1fr 1fr;
		column-gap: 0.5rem;
	}
	:deep(.q-expansion-item--expanded) {
		border: 1px solid $secondary;
		border-radius: 4px;
		background: #e3eaf2;
	}
}
.clear {
	clear: both;
}

.multi {
	margin-top: 1rem;
	span {
		display: inline-block;
		border: 1px solid red;
		background: pink;
		padding: 3px 1rem;
	}
}
</style>

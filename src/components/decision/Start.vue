<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSimpleStore } from '@/stores/simpleStore'
import { storeToRefs } from 'pinia'

const simpleStore = useSimpleStore()
const { selectedElement } = storeToRefs(simpleStore)
const router = useRouter()

const goto = (id: number) => {
	router.push(`/constructor/${id}`)
}

const constr = [
	{ id: 0, label: 'Разметки' },
	{ id: 1, label: 'Состояния' },
	{ id: 2, label: 'Роли' },
]

const constr0 = [
	{ id: 5, label: 'Разметки' },
	{ id: 4, label: 'Расширенные поля' },
	{ id: 6, label: 'Метаданные' },
]
</script>

<template lang="pug">
.q-ml-md(v-if='selectedElement')
	h6
		span.edit {{ selectedElement.text }}
			q-popup-edit(v-model=" simpleStore.selectedElement.text " buttons title="Название приложения" auto-save v-slot="scope")
				q-input(v-model="scope.value" dense autofocus counter @keyup.enter="scope.set")

	.grid(v-if='selectedElement.type == 0')
		.it(v-for="item in constr0" :key='item.id' @click='goto(item.id)')
			.text-bold {{ item.label }}

	template(v-else)
		.grid
			.it(v-for="item in constr" :key='item.id' @click='goto(item.id)')
				.text-bold {{ item.label }}
				.text-caption.q-mt-md Этот конструктор делает конструкции.


</template>

<style scoped lang="scss">
.big {
	font-size: 1.2rem;
	color: $primary;
	cursor: pointer;
}

.text-overline {
	line-height: 1;
}

.grid {
	margin-top: 1rem;
	display: grid;
	grid-template-columns: repeat(5, auto);
	// align-items: center;
	column-gap: 1rem;
	row-gap: 0.5rem;
	.it {
		width: 100%;
		height: 150px;
		background: #fff;
		// border-radius: 0.5rem;
	}
}

.grid1 {
	margin-top: 1rem;
	display: grid;
	grid-template-columns: auto 1fr;
	column-gap: 1rem;
}

.edit {
	border-bottom: 1px dotted $primary;
}

.q-tab-panels {
	background: transparent;
}

.rd {
	grid-column: 1 / -1;
	color: $negative;
	font-weight: 600;
}
</style>

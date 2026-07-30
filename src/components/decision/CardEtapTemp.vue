<script setup lang="ts">
import { ref, computed } from 'vue'
import { useApproveStore } from '@/stores/approveStore'

const approveStore = useApproveStore()

const makeLocal = () => {
	if (!!approveStore.selectedElement) {
		approveStore.selectedElement.text = approveStore.selectedElement.text + '-copy'
		approveStore.selectedElement.template = false
	}
}

const toTemplate = () => {
	approveStore.selectChip(1)
}
const show = ref(true)

const isEditable = computed(() => {
	if (approveStore.selectedChip?.id == 0) return true
	return false
})
</script>

<template lang="pug">
.q-ma-md
	.info(v-if='isEditable')
		q-icon(name="mdi-information-outline" color="secondary")
		div Это типовой этап. Он используется в разных маршруртах.<br />Для редактирования - перейдите в "Типовые образцы".
		.column.q-gutter-y-xs
			q-btn(unelevated size="sm" color="primary" label="Типовые образцы" @click="toTemplate") 
			q-btn(unelevated size="sm" color="primary" label="Локальная копия" @click="makeLocal") 

	.info1(v-if='!isEditable && show')
		q-icon(name="mdi-information-outline" color="secondary")
		div Это типовой этап. Он используется в разных маршруртах. Редактируйте с осторожностью.
		q-btn(unelevated size="sm" color="primary" label="Понятно" @click="show = false") 
</template>

<style scoped lang="scss">
.info {
	padding: 1rem;
	border: 1px solid var(--my-border-color);
	margin-top: 1rem;
	border-radius: 0.5rem;
	background: var(--bgLight);
	display: grid;
	align-items: center;
	width: 760px;
	grid-template-columns: 64px 430px 200px;
	svg {
		width: 50px;
		height: 50px;
		color: $secondary;
	}
	.q-icon {
		font-size: 3rem;
	}
}
.info1 {
	padding: 0.5rem;
	border: 1px solid var(--my-border-color);
	margin-top: 1rem;
	border-radius: 0.5rem;
	background: var(--bgLight);
	display: flex;
	gap: 1rem;
	justify-content: start;
	align-items: center;
	.q-icon {
		font-size: 1.5rem;
	}
}
</style>

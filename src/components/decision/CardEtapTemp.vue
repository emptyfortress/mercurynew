<script setup lang="ts">
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
</script>

<template lang="pug">
.q-ma-md
	.info
		q-icon(name="mdi-information-outline" color="secondary")
		div Это типовой этап. Он используется в разных маршруртах.<br />Для редактирования - перейдите в "Типовые образцы".
		.column.q-gutter-y-xs
			q-btn(unelevated size="sm" color="primary" label="Типовые образцы" @click="toTemplate") 
			q-btn(unelevated size="sm" color="primary" label="Локальная копия" @click="makeLocal") 
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
</style>

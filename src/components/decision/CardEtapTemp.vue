<script setup lang="ts">
import MaterialIconThemeTemplate from '@/components/icons/MaterialIconThemeTemplate.vue'
import { computed, ref } from 'vue'
// import ParamPanel from '@/components/cardpanels/ParamPanel.vue'
// import TaskPanel from '@/components/cardpanels/TaskPanel.vue'
// import AdditionalPanel from '@/components/cardpanels/AdditionalPanel.vue'
// import LogicPanel from '../cardpanels/LogicPanel.vue'

// const activeTab = ref('param')
</script>

<template lang="pug">
.q-ma-md
	.info
		// q-icon(name="mdi-share-variant" color="secondary")
		q-icon(name="mdi-information-outline" color="secondary")
		div Это типовой этап. Он используется в разных маршруртах.<br />Для редактирования - перейдите в "Типовые образцы".
		.column.q-gutter-y-xs
			q-btn(unelevated size="sm" color="primary" label="Типовые образцы") 
			q-btn(unelevated size="sm" color="primary" label="Локальная копия") 
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

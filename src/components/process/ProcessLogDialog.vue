<script setup lang="ts">
import ProcessLogPanel from './ProcessLogPanel.vue'

const visible = defineModel<boolean>({ required: true })
</script>

<template lang="pug">
q-dialog(v-model="visible" backdrop-filter="blur(4px) saturate(150%)")
	q-card.process-log-dialog(style="width: 1100px; max-width: calc(100vw - 32px)")
		q-btn.close(round color="negative" icon="mdi-close" v-close-popup)
		q-card-section.q-pb-sm
			.text-h6 Журнал процесса
		q-card-section.q-pt-none
			ProcessLogPanel
				template(v-slot:actions)
					q-btn(
						unelevated
						dense
						color="primary"
						label="Закрыть"
						v-close-popup
					)
</template>

<style scoped lang="scss">
.process-log-dialog :deep(.process-log-panel) {
	height: auto;
	padding: 0;
}

.process-log-dialog :deep(.q-table__middle) {
	max-height: min(60vh, 540px);
}
</style>

<script setup lang="ts">
import type { DockviewPanelApi } from 'dockview-vue'

const props = defineProps<{ params: { api: DockviewPanelApi } }>()

function reloadRows() {
	const parameters = props.params.api.getParameters<{ reloadRequest?: number }>()
	props.params.api.updateParameters({ reloadRequest: (parameters.reloadRequest ?? 0) + 1 })
}
</script>

<template lang="pug">
.row.items-center.no-wrap.full-width.full-height.q-px-sm
	.text-subtitle2 Журнал процесса
	q-btn.q-ml-md(
		unelevated
		dense
		size="sm"
		color="primary"
		icon="mdi-refresh"
		label="Обновить"
		@pointerdown.stop
		@click.stop="reloadRows"
	)
	q-space
	q-btn(
		flat
		round
		dense
		size="sm"
		color="primary"
		icon="mdi-close"
		@pointerdown.stop
		@click.stop="props.params.api.close()"
	)
		q-tooltip Закрыть панель
</template>

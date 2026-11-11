<script setup lang="ts">
import { ref } from 'vue'

const props = withDefaults(
	defineProps<{
		panels: ReadonlyArray<{ id: string; title: string }>
		visiblePanelIds: readonly string[]
		disabled?: boolean
		showReset?: boolean
	}>(),
	{
		disabled: false,
		showReset: true,
	}
)

const emit = defineEmits<{
	toggle: [panelId: string]
	reset: []
}>()

const expanded = ref(true)
</script>

<template lang="pug">
.dockview-panel-controls(
	v-if="props.panels.length"
)
	q-btn(
		flat
		size="sm"
		color="primary"
		icon="mdi-view-dashboard-outline"
		:label="expanded ? 'ПАНЕЛИ:' : 'ПАНЕЛИ'"
		:aria-expanded="expanded"
		@click="expanded = !expanded"
	)
	.dockview-panel-controls__options(v-show="expanded")
		q-chip.q-ma-none(
			v-for="panel in props.panels"
			:key="panel.id"
			size="sm"
			:color="props.visiblePanelIds.includes(panel.id) ? 'primary' : 'white'"
			:selected="props.visiblePanelIds.includes(panel.id)"
			:text-color="props.visiblePanelIds.includes(panel.id) ? 'white' : 'primary'"
			icon-selected="mdi-check"
			:label="panel.title"
			:disable="props.disabled"
			@update:selected="emit('toggle', panel.id)"
		)
		template(v-if="props.showReset")
			q-separator(vertical)
			q-btn( flat, round, dense,
				size="sm",
				color="primary",
				icon="mdi-restore",
				:disable="props.disabled",
				@click="emit('reset')"
			)
				q-tooltip Сброс
</template>

<style scoped lang="scss">
.dockview-panel-controls {
	display: flex;
	flex: 0 0 auto;
	flex-wrap: wrap;
	align-items: center;
	gap: 0.5rem;
	max-width: 100%;
	margin-bottom: 3px;
	padding: 0 0.25rem;
	// border: 1px solid var(--q-primary);
	border: 1px solid var(--q-secondary);
	border-radius: 4px;
}

.dockview-panel-controls__options {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: 0.5rem;
	min-width: 0;
}
</style>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { animations } from '@formkit/drag-and-drop'
import { useDragAndDrop } from '@formkit/drag-and-drop/vue'
import type { ProcessGateway } from '../processGateways'
import {
	connectedGateways,
	instance,
	removeProcessGateway,
	setProcessGateways,
} from '../singleMonitorLayoutState'
import GatewaySelectionDialog from './GatewaySelectionDialog.vue'
import ProcessGatewayIcon from '../ProcessGatewayIcon.vue'

const selectionOpen = ref(false)
const connectedIds = computed(() => connectedGateways.value.map((gateway) => gateway.id))
const [gatewayList, gateways] = useDragAndDrop<ProcessGateway>([...connectedGateways.value], {
	plugins: [animations()],
	draggable: (element) => element.classList.contains('gateway-row'),
	dragPlaceholderClass: 'ghost',
	synthDragPlaceholderClass: 'ghost',
	onSort: ({ values }) => setProcessGateways(values.map((gateway) => gateway.id)),
})

watch(connectedGateways, (items) => {
	gateways.value = [...items]
})
watch(
	() => instance.value.id,
	() => {
		selectionOpen.value = false
	}
)
</script>

<template lang="pug">
.gateways-settings-tab
	.text-caption.text-grey-9 Настройка подключённых шлюзов процесса.
	q-markup-table.gateways-table(flat dense wrap-cells)
		thead
			tr
				th.text-left Название
				th.gateway-actions
		tbody(ref="gatewayList")
			tr.gateway-row(v-for="gateway in gateways" :key="gateway.id")
				td
					.row.no-wrap.items-center.q-gutter-x-sm
						ProcessGatewayIcon(:gateway-id="gateway.id" :icon="gateway.icon")
						span {{ gateway.label }}
				td.gateway-actions.text-right(@pointerdown.stop)
					q-btn(flat round dense size="sm" color="secondary" icon="mdi-close" title="Удалить шлюз" @click.stop="removeProcessGateway(gateway.id)")
						q-tooltip Удалить шлюз
			tr(v-if="!gateways.length")
				td.text-center.text-grey-7.q-pa-lg(colspan="2") Шлюзы не подключены. Добавьте шлюз из списка доступных.
	.row.justify-center
		q-btn(flat dense color="primary" icon="mdi-plus" label="Добавить шлюз" @click="selectionOpen = true")
	GatewaySelectionDialog(v-model="selectionOpen" :connected-ids="connectedIds" @apply="setProcessGateways")
</template>

<style scoped lang="scss">
.gateways-settings-tab {
	display: flex;
	flex-direction: column;
	gap: 1rem;
	min-width: 0;
	padding-bottom: 1rem;
	color: var(--q-primary);
}

.gateways-table {
	background: #fff;

	th,
	td {
		padding-left: 6px;
		padding-right: 6px;
	}

	th {
		background: var(--bgLight);
	}

	.gateway-actions {
		width: 36px;
		padding: 0 4px;
	}
}

.gateway-row {
	cursor: grab;
	user-select: none;

	&:active {
		cursor: grabbing;
	}
}

.gateway-row.ghost > td {
	display: table-cell;
	background: inherit;
	color: transparent;

	&::before,
	&::after {
		display: none;
	}
}
</style>

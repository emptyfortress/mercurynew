<script setup lang="ts">
import { computed, ref } from 'vue'
import { processGatewayCatalog } from '../processGateways'
import ProcessGatewayIcon from '../ProcessGatewayIcon.vue'

const visible = defineModel<boolean>({ required: true })
const props = defineProps<{ connectedIds: string[] }>()
const emit = defineEmits<{ apply: [ids: string[]] }>()
const tickedIds = ref<string[]>([])
const expandedIds = ref<string[]>([])

const gatewayNodes = computed(() =>
	processGatewayCatalog.map((gateway) => ({
		id: gateway.id,
		label: gateway.label,
		icon: gateway.icon,
		selectable: false,
		children: gateway.variables.map((variable) => ({
			id: `${gateway.id}/${variable.id}`,
			label: variable.label,
			noTick: true,
			selectable: false,
		})),
	}))
)

const selectedIds = computed(() =>
	[...new Set(tickedIds.value)].filter((id) =>
		processGatewayCatalog.some((gateway) => gateway.id === id)
	)
)
const hasChanges = computed(
	() =>
		selectedIds.value.length !== props.connectedIds.length ||
		selectedIds.value.some((id) => !props.connectedIds.includes(id))
)

function applySelection() {
	if (!hasChanges.value) return
	emit('apply', [
		...props.connectedIds.filter((id) => selectedIds.value.includes(id)),
		...selectedIds.value.filter((id) => !props.connectedIds.includes(id)),
	])
	visible.value = false
}
</script>

<template lang="pug">
q-dialog(v-model="visible" backdrop-filter="blur(4px) saturate(150%)" @before-show="tickedIds = [...connectedIds]")
	q-card.gateway-selection-dialog
		q-btn.close(round color="negative" icon="mdi-close" v-close-popup)
		q-card-section
			.text-h6 Доступные шлюзы
			.text-caption.text-grey-7 Отметьте подключённые шлюзы. Снимите отметку, чтобы отключить шлюз. Раскройте шлюз, чтобы посмотреть его переменные.
		q-card-section.q-pt-none.gateway-tree-section
			q-tree(v-model:ticked="tickedIds" v-model:expanded="expandedIds" :nodes="gatewayNodes" node-key="id" tick-strategy="strict" icon="mdi-chevron-right" color="primary" dense)
				template(v-slot:default-header="{ node }")
					.gateway-tree-header
						.row.items-center.q-gutter-x-sm
							ProcessGatewayIcon(v-if="node.icon" :gateway-id="node.id" :icon="node.icon")
							span {{ node.label }}
		q-card-actions(align="right")
			q-btn(flat color="primary" label="Отмена" v-close-popup)
			q-btn(unelevated color="primary" label="Применить" :disable="!hasChanges" @click="applySelection")
</template>

<style scoped lang="scss">
.gateway-selection-dialog {
	width: 560px;
	max-width: calc(100vw - 32px);
}

.gateway-tree-section {
	max-height: 60vh;
	overflow-y: auto;
}

.gateway-tree-header {
	min-width: 0;
	overflow-wrap: anywhere;
}
</style>

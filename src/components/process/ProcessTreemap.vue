<script setup lang="ts">
import { computed } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import type { ApexOptions } from 'apexcharts'
import type { ProcessZone } from '@/composables/useProcessExplorer'
const props = withDefaults(defineProps<{ title: string; zones: ProcessZone[]; expandable?: boolean; expanded?: boolean }>(), {
	expandable: false,
	expanded: false,
})
const emit = defineEmits<{ select: [id: string]; selectChild: [groupId: string, childId: string]; list: []; clear: []; toggleExpand: [] }>()
const nested = computed(() => props.zones.some((zone) => zone.children?.length))
const count = computed(() => props.zones.reduce((sum, zone) => sum + zone.count, 0))
const palette = ['#396b9c', '#578873', '#82699b', '#9b7652', '#537f95', '#a76773']
function zoneColor(zone: ProcessZone) {
	let hash = 0
	for (const char of zone.id) hash = (hash * 31 + char.charCodeAt(0)) | 0
	return zone.color ?? palette[Math.abs(hash) % palette.length]!
}
const series = computed(() => nested.value
	? props.zones.map((zone) => ({
		name: `${zone.label} · ${zone.count}`,
		data: (zone.children ?? []).map((child) => ({
			x: child.label,
			y: child.other ? 1 : child.count,
			fillColor: child.color ?? zoneColor(zone),
		})),
	}))
	: [{ name: props.title, data: props.zones.map((zone) => ({ x: zone.label, y: zone.count })) }])
function selectedZone(seriesIndex: number, dataPointIndex: number) {
	return nested.value ? props.zones[seriesIndex]?.children?.[dataPointIndex] : props.zones[dataPointIndex]
}
function selectSingleGroup() {
	const zone = props.zones[0]
	if (zone) emit('select', zone.id)
}

const options = computed<ApexOptions>(() => ({
	chart: {
		type: 'treemap', toolbar: { show: false }, animations: { enabled: false },
		events: { dataPointSelection: (_event, _chart, selection) => {
			const zone = selectedZone(selection.seriesIndex, selection.dataPointIndex)
			if (!zone) return
			if (nested.value) {
				const parent = props.zones[selection.seriesIndex]
				if (parent) emit('selectChild', parent.id, zone.id)
			} else if (selection.seriesIndex === 0) emit('select', zone.id)
		}, click: (event) => {
			const target = event.target as Element | null
			if (!nested.value || !target?.closest?.('.process-group-title')) return
			const index = Number(target.closest('.apexcharts-treemap-series')?.getAttribute('data:realIndex'))
			const zone = props.zones[index]
			if (zone) emit('select', zone.id)
		} },
	},
	colors: props.zones.map(zoneColor),
	legend: { show: false },
	plotOptions: { treemap: {
		distributed: !nested.value, enableShades: false, dataLabels: { format: 'scale' },
		seriesTitle: { show: nested.value, offsetX: 4, offsetY: 4, borderWidth: 0,
			style: { background: 'rgba(20, 35, 50, 0.85)', color: '#fff', fontSize: '12px', fontWeight: 600,
				cssClass: 'process-group-title', padding: { left: 6, right: 6, top: 4, bottom: 4 } },
		},
	} },
	dataLabels: {
		enabled: true, style: { fontSize: '14px' },
		formatter: (label, context) => {
			const zone = selectedZone(context.seriesIndex, context.dataPointIndex)
			return zone?.other ? [String(label)] : [String(label), String(zone?.count ?? '')]
		},
	},
	tooltip: { y: { formatter: (_value, context) => {
		const zone = selectedZone(context.seriesIndex, context.dataPointIndex)
		return zone ? `${zone.count} объектов` : ''
	} } },
	stroke: { width: 3, colors: ['#fff'] },
}))
</script>

<template lang="pug">
q-card.flat.bordered.process-map
	q-card-section.row.items-center.justify-between.q-gutter-sm
		div
			q-btn.expand-heading(v-if="expandable" flat dense no-caps :label="title" @click="emit('toggleExpand')")
			.text-h6(v-else) {{ title }}
			.text-caption.text-grey-7 {{ count }} объектов · нажмите на зону, чтобы открыть
		q-btn(flat dense color="primary" icon="list" label="Показать список" @click="emit('list')")
	slot(name="controls")
	.chart(v-if="zones.length")
		VueApexCharts(:key="expanded ? 'expanded' : 'normal'" type="treemap" :height="nested ? 460 : 380" :options="options" :series="series")
		q-btn.single-group-title(v-if="nested && zones.length === 1" dense flat no-caps :label="`${zones[0]?.label} · ${zones[0]?.count}`" @click="selectSingleGroup")
	.column.items-center.justify-center.empty-map.text-grey-7(v-else)
		q-icon(name="search_off" size="36px")
		.q-mt-sm По выбранным условиям ничего не найдено
		q-btn.q-mt-sm(flat color="primary" label="Очистить фильтры" @click="emit('clear')")
</template>

<style scoped>
.process-map { background: var(--bg-panel); border-color: var(--my-border-color); }
.empty-map { min-height: 380px; }
.chart { position: relative; }
.expand-heading { min-height: 32px; padding: 0; font-size: 1.25rem; font-weight: 500; }
.single-group-title { position: absolute; top: 34px; left: 24px; padding: 2px 6px; background: rgba(20, 35, 50, 0.85); color: white; font-size: 12px; font-weight: 600; }
:deep(.apexcharts-treemap-rect), :deep(.process-group-title) { cursor: pointer; }
</style>

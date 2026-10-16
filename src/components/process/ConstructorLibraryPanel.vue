<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import WordHighlighter from 'vue-word-highlighter'
import LucideArrowLeftRight from '@/components/icons/LucideArrowLeftRight.vue'
import LucideCalendarClock from '@/components/icons/LucideCalendarClock.vue'
import LucideCirclePlay from '@/components/icons/LucideCirclePlay.vue'
import LucideCircleStop from '@/components/icons/LucideCircleStop.vue'
import LucideCodeXml from '@/components/icons/LucideCodeXml.vue'
import LucideFileCode2 from '@/components/icons/LucideFileCode2.vue'
import LucideGitFork from '@/components/icons/LucideGitFork.vue'
import LucideGitMerge from '@/components/icons/LucideGitMerge.vue'
import LucideLayers2 from '@/components/icons/LucideLayers2.vue'
import LucideListFilter from '@/components/icons/LucideListFilter.vue'
import LucideListOrdered from '@/components/icons/LucideListOrdered.vue'
import LucideListTree from '@/components/icons/LucideListTree.vue'
import LucideShieldAlert from '@/components/icons/LucideShieldAlert.vue'
import LucideShuffle from '@/components/icons/LucideShuffle.vue'
import LucideSplit from '@/components/icons/LucideSplit.vue'
import LucideTrash2 from '@/components/icons/LucideTrash2.vue'

const search = ref<string | null>('')
const basicFunctionsExpanded = ref(false)
const gatewayExpansion = reactive<Record<string, boolean>>({})
const gateways = [
	{ id: 'simple-types', label: 'Шлюз к простым типам' },
	{ id: 'docsvision', label: 'Шлюз к Docsvision' },
	{ id: 'mail', label: 'Шлюз к почте' },
	{ id: 'file-system', label: 'Шлюз к файловой системе' },
]

const groups = [
	[
		{ id: 'start', label: 'Начальная функция', icon: LucideCirclePlay },
		{ id: 'end', label: 'Конечная функция', icon: LucideCircleStop },
		{ id: 'function', label: 'Универсальная функция', icon: LucideCodeXml },
		{ id: 'scenario', label: 'Сценарий', icon: LucideFileCode2 },
	],
	[
		{ id: 'and', label: "Объединение 'И'", icon: LucideGitMerge },
		{ id: 'or', label: "Объединение 'Или'", icon: LucideGitFork },
		{ id: 'branch', label: 'Разветвление', icon: LucideSplit },
	],
	[
		{ id: 'subprocess', label: 'Подпроцесс', icon: LucideLayers2 },
		{ id: 'condition', label: 'Условие', icon: LucideListFilter },
		{ id: 'counter', label: 'Счетчик', icon: LucideListOrdered },
		{ id: 'schedule', label: 'Расписание', icon: LucideCalendarClock },
	],
	[
		{ id: 'collection', label: 'Обработка коллекции', icon: LucideListTree },
		{ id: 'delete', label: 'Удаление объекта', icon: LucideTrash2 },
	],
	[
		{ id: 'exchange', label: 'Обмен данными между переменными', icon: LucideArrowLeftRight },
		{ id: 'universal-exchange', label: 'Универсальный обмен данными', icon: LucideShuffle },
		{ id: 'error-handler', label: 'Обработчик ошибок', icon: LucideShieldAlert },
	],
]

const normalizedSearch = computed(() => (search.value ?? '').trim().toLocaleLowerCase())

const filteredGroups = computed(() => {
	const query = normalizedSearch.value
	if (!query) return groups

	return groups
		.map((group) => group.filter((item) => item.label.toLocaleLowerCase().includes(query)))
		.filter((group) => group.length > 0)
})

const filteredGateways = computed(() => {
	if (!normalizedSearch.value) return gateways
	return gateways.filter((gateway) =>
		gateway.label.toLocaleLowerCase().includes(normalizedSearch.value)
	)
})

watch(normalizedSearch, (query) => {
	if (!query) return

	basicFunctionsExpanded.value = filteredGroups.value.length > 0
	for (const gateway of gateways) {
		gatewayExpansion[gateway.id] = filteredGateways.value.some((item) => item.id === gateway.id)
	}
})

function startNodeDrag(event: DragEvent, item: { id: string; label: string }) {
	if (!event.dataTransfer) return
	const payload = JSON.stringify({ id: item.id, label: item.label })
	event.dataTransfer.effectAllowed = 'copy'
	event.dataTransfer.setData('application/x-mercury-process-node', payload)
	event.dataTransfer.setData('text/plain', payload)
}
</script>

<template lang="pug">
.library-panel
	q-input.q-mb-sm(v-model="search" dense filled clearable placeholder="Найти элемент")
		template(v-slot:prepend)
			q-icon(name="mdi-magnify" color="primary")
	q-list(dense separator)
		q-expansion-item.gateway-expansion.basic-functions-expansion(v-if="filteredGroups.length > 0" v-model="basicFunctionsExpanded" label="Базовые функции" expand-separator)
			q-list(dense)
				template(v-for="(group, groupIndex) in filteredGroups" :key="groupIndex")
					q-separator.q-my-xs(v-if="groupIndex > 0")
					q-item.library-item(v-for="item in group" :key="item.id" clickable :draggable="true" @dragstart="startNodeDrag($event, item)")
						q-item-section(side)
							component.library-item-icon(:is="item.icon")
						q-item-section
							WordHighlighter(:query="normalizedSearch") {{ item.label }}
		q-expansion-item.gateway-expansion(
			v-for="gateway in filteredGateways"
			:key="gateway.id"
			v-model="gatewayExpansion[gateway.id]"
			expand-separator
			:label="gateway.label"
		)
			.gateway-content.text-grey-7 Здесь будут элементы шлюза.
		.text-caption.text-grey-7.q-mt-md(v-if="filteredGroups.length === 0 && filteredGateways.length === 0") Ничего не найдено
</template>

<style scoped lang="scss">
.library-panel {
	height: 100%;
	overflow: auto;
	padding: 1rem 0;
	background: var(--bg-panel);
	color: var(--q-dark);
}

.library-panel :deep(.q-separator) {
	background: var(--my-border-color);
}

.library-panel :deep(.q-list--separator > .q-item-type + .q-item-type) {
	border-top-color: var(--my-border-color);
}

.library-item {
	user-select: none;
}

.library-item-icon {
	flex: 0 0 auto;
	color: var(--q-primary);
	font-size: 1.1rem;
}

.gateway-content {
	padding: 0.75rem 1rem;
	font-size: 0.875rem;
}
</style>

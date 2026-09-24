<script setup lang="ts">
import { ref, watch } from 'vue'
import CommonInfo from '@/components/view/CommonInfo.vue'
import Data from '@/components/view/Data.vue'

const visible = defineModel<boolean>('visible')
const column = defineModel<Col | null>('column')
const expanded = ref(false)

interface Col {
	id: string
	type: string
	text: string
	kind: null
	newkind: null
	children: any[]
	sort: boolean
	order: string
	hide: boolean
	source?: string
}

const draft = ref<Col>({
	id: 'start',
	type: 'start',
	text: 'start',
	kind: null,
	newkind: null,
	children: [],
	sort: false,
	order: '',
	hide: false,
	source: undefined,
})

const calcDirty = ref(false)

watch(
	() => [visible.value, column.value] as const,
	([isVisible, col]) => {
		if (isVisible && col) {
			draft.value = { ...col }
			calcDirty.value = false
		}
	},
	{ immediate: true }
)

const save = () => {
	if (!draft.value || !column.value) return
	Object.assign(column.value, draft.value)
}

const isSwitching = ref(false)
let timer: ReturnType<typeof setTimeout> | null = null

watch(column, (next, prev) => {
	if (!prev || !next) return
	isSwitching.value = true
	if (timer) clearTimeout(timer)
	timer = setTimeout(() => (isSwitching.value = false), 180)
})

watch(visible, (isVisible) => {
	if (!isVisible) expanded.value = false
})
</script>

<template lang="pug">
q-drawer(v-model='visible' side='right' :width="expanded ? 760 : 480" overlay persistent bordered behavior="desktop")
	.panel(v-if="column")
		transition(name="skeleton-fade")
			.panel-skeleton-overlay(v-if="isSwitching" key="skeleton")

		.hd
			span {{ draft.text || 'Настройка колонки' }}
			q-btn(
				flat round dense color="primary"
				:icon="expanded ? 'mdi-arrow-collapse-horizontal' : 'mdi-arrow-expand-horizontal'"
				:aria-label="expanded ? 'Свернуть панель' : 'Расширить панель'"
				@click="expanded = !expanded"
			)
			q-btn(flat round icon="mdi-close" color="primary" dense aria-label="Закрыть" @click="visible = false")

		q-scroll-area.panel-scroll
			.drawer-section
				.section-title
					span Общая информация
				CommonInfo(v-model:draft="draft")
			.drawer-section
				.section-title
					span Данные
				Data(v-model:draft="draft" v-model:calc-dirty="calcDirty")

		.actions
			q-btn(flat icon="mdi-virtual-reality" color="primary" label="Сохранить как виртуальное поле" size="12px")
			q-space
			q-btn(flat color="primary" label="Отмена" @click="visible = false")
			q-btn(unelevated color="primary" label="Применить" @click="save")
</template>

<style scoped lang="scss">
.panel {
	height: 100%;
	display: flex;
	flex-direction: column;
	min-width: 0;
}
.panel-scroll {
	flex: 1;
	min-height: 0;
}
.drawer-section {
	padding: 1rem;
	border-bottom: 1px solid #cfdbec;
}
.section-title {
	span {
		font-size: 1.1rem;
		font-weight: 600;
	}
	margin-bottom: 0.75rem;
}
.hd {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	padding: 0.5rem 1rem;
	border-bottom: 1px solid #cfdbec;
	font-size: 1.05rem;
	font-weight: 600;
	line-height: 1.3;
	span {
		flex: 1;
	}
}
.actions {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	padding: 0.5rem 1rem;
	background: white;
	box-shadow: 0 -2px 7px rgba($color: #000000, $alpha: 0.2);
	flex: none;
}
:deep(.q-drawer__content) {
	position: relative;
}
:deep(.q-drawer) {
	max-width: 90vw;
}
.panel-skeleton-overlay {
	position: absolute;
	inset: 0;
	background: var(--bgLight);
	z-index: 1;
}
.skeleton-fade-enter-active,
.skeleton-fade-leave-active {
	transition: opacity 0.45s ease;
}
.skeleton-fade-enter-from,
.skeleton-fade-leave-to {
	opacity: 0;
}
</style>

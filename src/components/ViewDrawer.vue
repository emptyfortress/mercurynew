<script setup lang="ts">
import { ref, watch, computed, markRaw } from 'vue'
import { QScrollArea } from 'quasar'
import type { ComponentPublicInstance } from 'vue'
import CommonInfo from '@/components/view/CommonInfo.vue'
import Data from '@/components/view/Data.vue'

const visible = defineModel<boolean>('visible')
const column = defineModel<Col | null>('column')
const CommonInfoComp = markRaw(CommonInfo)
const DataComp = markRaw(Data)

interface Col {
	id: string
	type: string
	text: string
	kind: null
	newkind: null
	children: []
	sort: false
	order: string
	hide: boolean
	source?: string
}

// локальный буфер редактирования
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

// пересоздаём буфер при каждом открытии/смене колонки
watch(
	() => [visible.value, column.value] as const,
	([isVisible, col]) => {
		if (isVisible && col) {
			draft.value = { ...col }
		}
	},
	{ immediate: true }
)

const save = () => {
	if (!draft.value || !column.value) return
	Object.assign(column.value, draft.value) // мутируем тот же объект, ссылка не рвётся
}

const sections = ref([
	{
		name: 'info',
		label: 'Общая информация',
		icon: 'mdi-information-outline',
		component: CommonInfoComp,
	},
	{
		name: 'data',
		label: 'Данные',
		icon: 'mdi-code-braces',
		component: DataComp,
	},
])

const calcIcon = (str: any) => {
	if (str == 'field') return 'mdi-form-textbox'
	if (str == 'system') return 'mdi-tools'
	if (str == 'calc') return 'mdi-calculator-variant-outline'
}

watch(
	draft,
	(val) => {
		if (val.source) {
			let tmp = {
				name: 'test',
				label: 'Fuck',
				icon: calcIcon(val.source),
			}
			// sections.value.push(tmp)
		}
	},
	{ deep: true }
)

const activeTab = ref('info')
const scrollAreaRef = ref<QScrollArea | null>(null)
const sectionRefs: Record<string, HTMLElement> = {}

function setSectionRef(el: Element | ComponentPublicInstance | null, name: string) {
	if (el instanceof HTMLElement) {
		sectionRefs[name] = el
	}
}

const isProgrammaticScroll = ref(false)
let scrollTimeout: ReturnType<typeof setTimeout> | null = null

function scrollToSection(name: string) {
	const target = sectionRefs[name]
	if (!target || !scrollAreaRef.value) return

	isProgrammaticScroll.value = true
	activeTab.value = name // выставляем сразу, не ждём scroll-событий

	scrollAreaRef.value.setScrollPosition('vertical', target.offsetTop, 300)

	if (scrollTimeout) clearTimeout(scrollTimeout)
	scrollTimeout = setTimeout(() => {
		isProgrammaticScroll.value = false
	}, 320) // чуть больше длительности анимации
}

function onScroll(info: { verticalPosition: number }) {
	if (isProgrammaticScroll.value) return // игнорируем во время программного скролла

	const pos = info.verticalPosition
	let current = sections.value[0].name

	for (const section of sections.value) {
		const el = sectionRefs[section.name]
		if (el && el.offsetTop - 8 <= pos) {
			current = section.name
		}
	}

	activeTab.value = current
}

const currentLabel = computed(() => {
	let temp = sections.value.find((el: any) => el.name == activeTab.value)
	if (temp) return temp.label
})

const isSwitching = ref(false)
let timer: ReturnType<typeof setTimeout> | null = null

watch(column, (next, prev) => {
	if (!prev || !next) return // не показываем оверлей при открытии/закрытии панели
	isSwitching.value = true
	clearTimeout(timer!)
	timer = setTimeout(() => (isSwitching.value = false), 180)
})
</script>

<template lang="pug">
q-drawer(v-model='visible' side='right' :width="550" overlay persistent bordered behavior="desktop")
	.panel(v-if="column")
		transition(name="skeleton-fade")
			.panel-skeleton-overlay(v-if="isSwitching" key="skeleton")

		.zg
			q-btn(flat round icon="mdi-close" color="primary" dense @click="visible = false") 
			.q-ml-sm {{draft?.text}}
			.q-mx-xs >
			div {{ currentLabel }}

		.vertgrid
			q-tabs(
				v-model="activeTab"
				vertical
				class="col-auto"
				@update:model-value="scrollToSection"
			)
				q-tab(
					v-for="section in sections"
					:key="section.name"
					:name="section.name"
					:icon="section.icon"
				)

			q-scroll-area(ref="scrollAreaRef" style="height: 100%" @scroll="onScroll")
				.q-my-md.q-mr-md(
					v-for="section in sections"
					:key="section.name"
					:ref="el => setSectionRef(el, section.name)"
				)
					.section
						q-icon.q-mr-sm(:name="section.icon")
						span {{ section.label }}
					component(:is="section.component" v-model:draft='draft')

	.actions
		q-btn(flat color="primary" label="Отмена" @click="visible = false") 
		q-btn(unelevated color="primary" label="Применить" @click="save") 
</template>

<style scoped lang="scss">
.panel-content {
	height: 100%;
}
.vertgrid {
	display: grid;
	grid-template-columns: auto 1fr;
	grid-template-rows: 1fr;
	column-gap: 0.5rem;
	height: calc(100% - 110px);
	min-height: 0;
}

.ic {
	font-size: 2.6rem;
	color: $secondary;
}
.ico {
	font-size: 2rem;
}
.zg {
	padding: 0.25rem 1rem;
	font-size: 0.7rem;
	border-bottom: 1px solid #cfdbec;
	display: flex;
	align-items: center;
	color: $primary;
	gap: 0.25rem;
	.q-btn {
		margin-top: -3px;
	}
}
.chose {
	cursor: pointer;
	border: 1px solid $grey-4;
	padding: 0.5rem;
	border-radius: 0.25rem;
	font-size: 0.8rem;
	line-height: 1.1;
	&:hover {
		border-color: $secondary;
	}
	&.selected {
		background: var(--selection);
		border: 1px solid $primary;
	}
}
.grid2 {
	display: grid;
	grid-template-columns: auto 1fr;
	// justify-items: start;
	align-items: center;
	column-gap: 1rem;
	row-gap: 0.5rem;
	margin-bottom: 2rem;
}
.actions {
	display: flex;
	width: 100%;
	justify-content: end;
	position: absolute;
	bottom: 1rem;
	right: 1rem;
}
.q-separator {
	margin-top: 1rem;
	margin-bottom: 1rem;
	background: $secondary;
}
:deep(.q-drawer__content) {
	position: relative;
}
:deep(.q-tabs) {
	border-right: 1px solid #cfdbec;
}
.grid5 {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	// justify-items: start;
	// align-items: stretch;
	gap: 0.25rem;
}
.section {
	font-size: 1.3rem;
	background: $secondary;
	color: white;
	padding-left: 0.5rem;
	margin-bottom: 0.5rem;
}

.panel {
	height: 100%;
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

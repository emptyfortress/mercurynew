<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

type SearchResult = {
	label: string
	section: string
	to: string
}

const visible = defineModel<boolean>()
const router = useRouter()
const searchInput = ref<{ focus: () => void }>()
const query = ref<string | null>('')
const activeIndex = ref(0)

const history = [
	{ label: 'роли' },
	{ label: 'разметки' },
	{ label: 'мониторинг' },
	{ label: 'колонки' },
]

const demoResults: { terms: string[]; results: SearchResult[] }[] = [
	{
		terms: ['роль', 'роли'],
		results: [
			{ label: 'Роли и права', section: 'Конструктор карточек', to: '/dvmain/cards' },
		],
	},
	{
		terms: ['разметки'],
		results: [
			{ label: 'Разметки карточек', section: 'Конструктор карточек', to: '/dvmain/cards' },
			{
				label: 'Проекты переноса разметок',
				section: 'Дополнительно',
				to: '/dvmain/projects',
			},
		],
	},
	{
		terms: ['мониторинг'],
		results: [
			{
				label: 'Мониторинг процессов',
				section: 'Согласования и процессы',
				to: '/dvmain/process/monitor',
			},
		],
	},
	{
		terms: ['колонки'],
		results: [
			{
				label: 'Колонки представлений',
				section: 'Конструктор представлений',
				to: '/dvmain/views',
			},
		],
	},
]

const normalizedQuery = computed(() => query.value?.trim().toLowerCase() ?? '')
const rows = computed(() => {
	if (!normalizedQuery.value) return history

	const match = demoResults.find(({ terms }) =>
		terms.some((term) => term.startsWith(normalizedQuery.value))
	)
	return match?.results ?? []
})

watch(query, () => {
	activeIndex.value = 0
})

function resetSearch() {
	query.value = ''
	activeIndex.value = 0
}

function selectRow(row: (typeof rows.value)[number]) {
	if ('to' in row) {
		visible.value = false
		void router.push(row.to)
		return
	}

	query.value = row.label
	searchInput.value?.focus()
}

async function handleSearchKey(event: KeyboardEvent) {
	if (event.isComposing) return

	if (event.key === 'Enter') {
		event.preventDefault()
		const row = rows.value[activeIndex.value]
		if (row) selectRow(row)
		return
	}

	if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
	if (!rows.value.length) return

	event.preventDefault()
	const step = event.key === 'ArrowDown' ? 1 : -1
	activeIndex.value = Math.max(0, Math.min(activeIndex.value + step, rows.value.length - 1))
	await nextTick()
	document.getElementById(`settings-search-row-${activeIndex.value}`)?.scrollIntoView({
		block: 'nearest',
	})
}
</script>

<template lang="pug">
q-dialog(
	v-model='visible'
	position='top'
	backdrop-filter='blur(4px) saturate(150%)'
	@before-show='resetSearch'
)
	q-card.settings-search
		q-card-section.q-pa-sm
			span#settings-search-input-label(hidden) Поиск по настройкам
			q-input.settings-search__input(
				ref='searchInput'
				v-model='query'
				placeholder='Поиск по настройкам'
				borderless
				clearable
				autofocus
				role='combobox'
				aria-labelledby='settings-search-input-label'
				aria-autocomplete='list'
				:aria-expanded='rows.length > 0'
				aria-controls='settings-search-rows'
				:aria-activedescendant="rows.length ? 'settings-search-row-' + activeIndex : undefined"
				@keydown='handleSearchKey'
			)
				template(#prepend)
					q-icon(name='mdi-magnify' size='24px')

		q-separator
		.settings-search__results
			#settings-search-list-title.text-caption.text-weight-medium.text-primary.q-px-sm.q-pb-xs(
				v-show='rows.length'
			) {{ normalizedQuery ? 'Результаты' : 'Недавние запросы' }}
			q-list#settings-search-rows(
				v-show='rows.length'
				role='listbox'
				aria-labelledby='settings-search-list-title'
			)
				q-item.settings-search__row(
					v-for='(row, index) in rows'
					:id="'settings-search-row-' + index"
					:key='row.label'
					:active='index === activeIndex'
					:aria-selected='index === activeIndex'
					role='option'
					tabindex='-1'
					clickable
					@mousedown.prevent
					@click='selectRow(row)'
				)
					q-item-section(side)
						q-icon(:name="normalizedQuery ? 'mdi-tune-variant' : 'mdi-history'" size='20px')
					q-item-section
						q-item-label.ellipsis {{ row.label }}
					q-item-section.settings-search__section(v-if="'section' in row" side)
						q-item-label.ellipsis(caption :title='row.section') {{ row.section }}
			.q-pa-sm(v-if='!rows.length' role='status') Ничего не найдено
</template>

<style scoped lang="scss">
.settings-search,
.q-dialog__inner--top > .settings-search {
	border-radius: var(--rad);
}

.settings-search {
	width: min(560px, calc(100vw - 56px));
	margin-top: clamp(24px, 10vh, 72px);
}

.settings-search__input :deep(.q-field__control) {
	padding-inline: 12px;
}

.settings-search__input :deep(.q-field__native) {
	font-size: clamp(1.25rem, 4vw, 1.5rem);
	line-height: 1.4;
}

.settings-search__results {
	max-height: min(50dvh, 280px);
	overflow-y: auto;
	padding: 8px;
}

.settings-search__row {
	min-height: 40px;
	padding-inline: 8px;
	border-radius: var(--rad);
}

.settings-search__section {
	max-width: 50%;
}

.settings-search__row.q-item--active {
	background: var(--selection);
}
</style>

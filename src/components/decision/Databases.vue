<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import background1 from '@/assets/img/bg/var1.png'
import background3 from '@/assets/img/bg/var3.png'
import background5 from '@/assets/img/bg/var5.png'
import KeylineIconsDesk from '@/components/icons/KeylineIconsDesk.vue'
import LucideBookOpen from '@/components/icons/LucideBookOpen.vue'
import LucideLayers2 from '@/components/icons/LucideLayers2.vue'
import LucideLayoutTemplate from '@/components/icons/LucideLayoutTemplate.vue'
import LucideWorkflow from '@/components/icons/LucideWorkflow.vue'

const router = useRouter()

const selectedBackground = ref(background1)
const backgroundOpacity = ref(70)
const backgroundOptions = [
	{ label: 'Фон 1', value: background1 },
	{ label: 'Фон 3', value: background3 },
	{ label: 'Фон 5', value: background5 },
]
const backgroundStyle = computed(() => ({
	'--databases-background': `url('${selectedBackground.value}')`,
	'--databases-background-opacity': backgroundOpacity.value / 100,
}))

const sections = [
	{ id: 0, label: 'Конструктор карточек', to: 'cards' },
	{ id: 1, label: 'Каталог папок', to: 'folders' },
	{ id: 2, label: 'Конструктор поисковых запросов', to: 'search' },
	{ id: 3, label: 'Настройка представлений', to: 'views' },
	{ id: 4, label: 'Рабочая область', to: 'webframe' },
	{ id: 5, label: 'Конструктор согласований', to: 'approve' },
	{ id: 6, label: 'Процессы', to: '/dvmain/process' },
	{ id: 7, label: 'Справочники', to: '' },
	{ id: 8, label: 'Правила нумерации', to: '/dvmain/numerators' },
	{ id: 9, label: 'Типы папок', to: '/dvmain/folder-types' },
	{ id: 10, label: 'Проекты', to: '/dvmain/projects' },
]

const goto = (e: string) => {
	if (!e) return
	if (e.startsWith('/dvmain/')) {
		void router.push(e)
		return
	}
	router.push({ name: 'Emp', params: { constructorId: e } })
}
</script>

<template lang="pug">
mixin structure-tile(label, to)
	li.database-structure__item
		#{to ? 'router-link' : 'span'}.database-structure__item-label.text-primary(
			class=to ? 'database-structure__link' : null
			to=to
		)
			= label
		q-icon.database-structure__chevron(name='mdi-chevron-right' size='1.25rem')

q-page.databases(padding :style='backgroundStyle')
	.databases__content
		.box.row.items-center
			h1.text-h5.text-weight-medium.q-ma-none
				q-icon.q-mr-md(name="mdi-database-outline" color="primary")
				|База данных DV-Main
			.databases__background-controls.row.no-wrap.items-center.q-ml-auto
				.databases__opacity-control
					span#databases-opacity-label.text-caption Непрозрачность
					q-slider(
						v-model='backgroundOpacity'
						aria-labelledby='databases-opacity-label'
						:aria-valuetext="`${backgroundOpacity}%`"
						:label-value="`${backgroundOpacity}%`"
						label
						dense
					)
				q-btn-toggle(
					v-model='selectedBackground'
					:options='backgroundOptions'
					color='white'
					text-color='primary'
					toggle-color='primary'
					unelevated
					dense
					no-caps
				)
			q-btn.system-settings(
				label='Системные настройки'
				icon='mdi-cog-outline'
				icon-right='mdi-chevron-right'
				text-color='primary'
				padding='12px 16px'
				unelevated
				no-caps
			)
		section.database-structure
			section.database-structure__group_cards.q-mb-md
				h2.database-structure__title.row.no-wrap.items-center.text-h6.q-ma-none
					LucideLayoutTemplate.database-structure__title-icon(aria-hidden='true')
					router-link.database-structure__link(
						:to="{ name: 'Emp', params: { constructorId: 'cards' } }"
					) Конструктор карточек
				ul.database-structure__list.database-structure__list_inline
					li Виды и поля
					li Роли и права
					li Состояния и переходы
					li Разметки
				q-icon.database-structure__chevron(name='mdi-chevron-right' size='1.25rem')

			.database-structure__columns
				section.database-structure__group_workspace
					h2.database-structure__title.row.no-wrap.items-center.text-h6.q-ma-none
						KeylineIconsDesk.database-structure__title-icon(aria-hidden='true')
						|Рабочее место
					ul.database-structure__list
						+structure-tile('Каталог папок', '/dvmain/folders')
						+structure-tile('Рабочая область', '/dvmain/webframe')
						+structure-tile('Конструктор поисковых запросов', '/dvmain/search')
						+structure-tile('Конструктор представлений', '/dvmain/views')
						+structure-tile('Типы\u00a0папок', '/dvmain/folder-types')

				.database-structure__stack
					section.database-structure__group_directories
						h2.database-structure__title.row.no-wrap.items-center.text-h6.q-ma-none
							LucideBookOpen.database-structure__title-icon(aria-hidden='true')
							|Справочники
						ul.database-structure__list
							+structure-tile('Разметки справочников')
							+structure-tile('Справочник ссылок')
							+structure-tile('Правила нумерации', '/dvmain/numerators')
					section.database-structure__group_resources
						h2.database-structure__title.row.no-wrap.items-center.text-h6.q-ma-none
							LucideLayers2.database-structure__title-icon(aria-hidden='true')
							|Дополнительно
						ul.database-structure__list
							+structure-tile('Проекты переноса разметок', '/dvmain/projects')
							+structure-tile('Локализации разметок')

				section.database-structure__group_workflows
					h2.database-structure__title.row.no-wrap.items-center.text-h6.q-ma-none
						LucideWorkflow.database-structure__title-icon(aria-hidden='true')
						|Согласования | процессы
					// h3.text-subtitle2.q-mt-sm.q-mb-none Согласования
					ul.database-structure__list
						+structure-tile('Конструктор согласований', '/dvmain/approve')
						+structure-tile('Мониторинг согласований')
					q-separator(spaced='md')
					// h3.text-subtitle2.q-ma-none Процессы WF
					ul.database-structure__list
						+structure-tile('Настройка шаблонов процессов', '/dvmain/process/constructor')
						+structure-tile('Мониторинг процессов', '/dvmain/process/monitor')

			// q-separator(spaced='lg')

		// .container
			.it.constr(
				v-for="item in sections",
				:key='item.id',
				:class="{dis : item.id === 7}"
				v-on="item.id === 6 ? {} : { click: () => goto(item.to) }"
			)
				div {{ item.label }}
				.process-links(v-if="item.id === 6")
					router-link(to="/dvmain/process/constructor" @click.stop) Конструктор
					router-link(to="/dvmain/process/monitor" @click.stop) Мониторинг

</template>

<style scoped lang="scss">
.databases {
	--variant-panel-bg: color-mix(in srgb, var(--bg-panel) 72%, transparent);

	position: relative;
}

.databases::before {
	content: '';
	position: absolute;
	inset: 0;
	background-image: var(--databases-background);
	background-position: center;
	background-repeat: no-repeat;
	// background-size: contain;
	background-size: cover;
	// mix-blend-mode: multiply;
	pointer-events: none;
	opacity: var(--databases-background-opacity);
}

.databases__content {
	--variant-content-width: 1068px;

	position: relative;
	width: min(100%, var(--variant-content-width));
	margin-inline: auto;
}

.box {
	margin: 0 auto 1rem;
	gap: 8px;
}

.databases__background-controls {
	gap: 12px;
}

.databases__opacity-control {
	width: 108px;
}

.system-settings {
	border-radius: 0.5rem;
	border: 1px solid transparent;
}
.database-structure {
	margin: 0 auto;
}

.database-structure__columns {
	display: grid;
	grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr) minmax(0, 1.1fr);
	gap: 1rem;
}

.database-structure__stack {
	display: grid;
	grid-auto-rows: 1fr;
	gap: 1rem;
}

.database-structure__group_cards {
	position: relative;
	isolation: isolate;
	border: 1px solid var(--my-border-color);
	border-radius: var(--rad);
	padding: 1rem;
	background: var(--variant-panel-bg);
	min-height: 102px;

	.no-touch &:hover {
		cursor: pointer;
		background: rgb(255 255 255 / 0.82);
		box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.2);
	}

	.no-touch &:hover > .database-structure__chevron {
		visibility: visible;
	}

	.database-structure__link::after {
		position: absolute;
		z-index: 1;
		inset: 0;
		content: '';
	}
}

.database-structure__group_workspace {
	position: relative;
	isolation: isolate;
	border: 1px solid var(--my-border-color);
	border-radius: var(--rad);
	padding: 1rem;
	padding-bottom: 117.5px;
	background: var(--variant-panel-bg);

	@media (width > 50rem) {
		padding-bottom: 80px;
	}
}

.database-structure__group_directories {
	position: relative;
	isolation: isolate;
	border: 1px solid var(--my-border-color);
	border-radius: var(--rad);
	padding: 1rem;
	padding-bottom: 75.5px;
	background: var(--variant-panel-bg);

	@media (width > 50rem) {
		padding-bottom: 63px;
	}
}

.database-structure__group_resources {
	position: relative;
	isolation: isolate;
	border: 1px solid var(--my-border-color);
	border-radius: var(--rad);
	padding: 1rem;
	padding-bottom: 75.5px;
	background: var(--variant-panel-bg);

	@media (width > 50rem) {
		padding-bottom: 63px;
	}
}

.database-structure__group_workflows {
	position: relative;
	isolation: isolate;
	border: 1px solid var(--my-border-color);
	border-radius: var(--rad);
	padding: 1rem;
	padding-bottom: 117.5px;
	background: var(--variant-panel-bg);

	@media (width > 50rem) {
		padding-bottom: 80px;
	}
}

.database-structure__title {
	gap: 0.5rem;
}

.database-structure__title > .database-structure__link {
	color: inherit;
	font-weight: inherit;
	text-decoration: none;
}

.database-structure__title-icon {
	flex: none;
	font-size: 1.25rem;
	color: var(--icon);
}

.database-structure__list {
	display: grid;
	gap: 0.5rem;
	margin: 0.5rem 0 0;
	padding: 0;
	list-style: none;
}

.database-structure__columns .database-structure__list {
	gap: 0;
}

.database-structure__list_inline {
	display: flex;
	flex-wrap: wrap;
	column-gap: 1rem;
	font-size: 0.8rem;
}

.database-structure__item {
	position: relative;
	border-radius: var(--rad);
	padding: 0.75rem;
	padding-inline-end: 2.25rem;
	// background: #fff;
	border: 1px solid transparent;
}

.database-structure__item-label {
	text-decoration: none;
}

.database-structure__item > .database-structure__link::after {
	position: absolute;
	z-index: 1;
	inset: 0;
	content: '';
}

.database-structure__chevron {
	position: absolute;
	top: 50%;
	inset-inline-end: 0.75rem;
	transform: translateY(-50%);
	visibility: hidden;
}

.no-touch .database-structure__item:hover,
.no-touch .system-settings:hover {
	cursor: pointer;
	border-color: #ccc;
	background: #fff;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.14);
}

.no-touch .system-settings:hover:not(:focus-visible) > :deep(.q-focus-helper) {
	opacity: 0;
}

.no-touch .database-structure__item:hover > .database-structure__chevron {
	visibility: visible;
}

@media (max-width: 50rem) {
	.database-structure__columns {
		grid-template-columns: 1fr;
	}
}

.container {
	margin: 0 auto;
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	column-gap: 1rem;
	row-gap: 1rem;
}
.constr {
	width: 100%;
	height: 100px;
	background: #fff;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	&.dis {
		opacity: 0.5;
	}
}
.process-links {
	display: flex;
	gap: 1rem;
	margin-top: 0.5rem;
}
</style>

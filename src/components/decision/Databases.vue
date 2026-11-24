<script setup lang="ts">
import { useRouter } from 'vue-router'
import LucideBookOpen from '@/components/icons/LucideBookOpen.vue'
import LucideFolderOpen from '@/components/icons/LucideFolderOpen.vue'
import LucideLayers2 from '@/components/icons/LucideLayers2.vue'
import LucideLayoutTemplate from '@/components/icons/LucideLayoutTemplate.vue'
import LucideWorkflow from '@/components/icons/LucideWorkflow.vue'

const router = useRouter()

const sections = [
	{ id: 0, label: 'Конструктор карточек', to: 'cards' },
	{ id: 1, label: 'Каталог папок', to: 'folders' },
	{ id: 2, label: 'Конструктор поисковых запросов', to: 'search' },
	{ id: 3, label: 'Настройка представлений', to: 'views' },
	{ id: 4, label: 'Рабочая область', to: 'webframe' },
	{ id: 5, label: 'Конструктор согласований', to: 'approve' },
	{ id: 6, label: 'Процессы', to: '/dvmain/process' },
	{ id: 7, label: 'Справочники', to: '' },
	{ id: 8, label: 'Нумераторы', to: '/dvmain/numerators' },
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
mixin structure-tile(label)
	li.database-structure__item
		span.database-structure__item-label.text-primary= label
		q-icon.database-structure__chevron(name='mdi-chevron-right' size='1.25rem')

q-page(padding)
	.box.row.items-center
		h1.text-h5.text-weight-medium.q-ma-none
			q-icon.q-mr-md(name="mdi-database-outline" color="primary")
			|База данных DV-Main
		q-btn.system-settings.q-ml-auto(
			label='Системные настройки'
			icon='mdi-cog-outline'
			icon-right='mdi-chevron-right'
			text-color='primary'
			padding='12px 16px'
			unelevated
			no-caps
			size="sm"
		)
	section.database-structure
		section.database-structure__group.database-structure__group_cards.q-mb-md
			h2.database-structure__title.row.no-wrap.items-center.text-h6.q-ma-none
				LucideLayoutTemplate.database-structure__title-icon(aria-hidden='true')
				|Конструктор карточек
			ul.database-structure__list.database-structure__list_inline
				li Виды и поля
				li Роли и права
				li Состояния и переходы
				li Разметки
			q-icon.database-structure__chevron(name='mdi-chevron-right' size='1.25rem')

		.database-structure__columns
			section.database-structure__group.database-structure__group_workspace
				h2.database-structure__title.row.no-wrap.items-center.text-h6.q-ma-none
					LucideFolderOpen.database-structure__title-icon(aria-hidden='true')
					|Рабочее место
				ul.database-structure__list.database-structure__list_two-columns
					+structure-tile('Каталог папок')
					+structure-tile('Рабочая область')
					+structure-tile('Конструктор поисковых запросов')
					+structure-tile('Управление локациями')
					+structure-tile('Конструктор представлений')
					+structure-tile('Типы папок')

			.database-structure__stack
				section.database-structure__group.database-structure__group_directories
					h2.database-structure__title.row.no-wrap.items-center.text-h6.q-ma-none
						LucideBookOpen.database-structure__title-icon(aria-hidden='true')
						|Справочники
					ul.database-structure__list
						+structure-tile('Разметки справочников')
						+structure-tile('Справочник ссылок')
				section.database-structure__group.database-structure__group_resources
					h2.database-structure__title.row.no-wrap.items-center.text-h6.q-ma-none
						LucideLayers2.database-structure__title-icon(aria-hidden='true')
						|Ресурсы разметок
					ul.database-structure__list
						+structure-tile('Управление решениями')
						+structure-tile('Локализации разметок')

			section.database-structure__group.database-structure__group_workflows
				h2.database-structure__title.row.no-wrap.items-center.text-h6.q-ma-none
					LucideWorkflow.database-structure__title-icon(aria-hidden='true')
					|Согласования и процессы
				// h3.text-subtitle2.q-mt-sm.q-mb-none Согласования
				ul.database-structure__list
					+structure-tile('Конструктор согласований')
					+structure-tile('Мониторинг согласований')
				q-separator(spaced='md')
				// h3.text-subtitle2.q-ma-none Процессы WF
				ul.database-structure__list
					+structure-tile('Настройка шаблонов процессов')
					+structure-tile('Мониторинг процессов')

		q-separator(spaced='lg')

	.container
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
.box,
.database-structure,
.container {
	max-width: 1200px;
}

.box {
	margin: 0 auto 1rem;
	gap: 8px;
}
.system-settings {
	border-radius: 0.5rem;
	background: hsl(210 51% 84% / 1);
	border: 1px solid hsl(210 51% 84% / 1);
	&:hover {
		border: 1px solid #fff;
	}
	// box-shadow: var(--shad0);
}
.database-structure {
	margin: 0 auto;
}

.database-structure__columns {
	--illustration-overlap: 12.5px;

	display: grid;
	grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr) minmax(0, 1.1fr);
	gap: 1rem;
}

.database-structure__stack {
	display: grid;
	grid-auto-rows: 1fr;
	gap: 1rem;
}

.database-structure__group,
.database-structure__item {
	border-radius: var(--rad);
}

.database-structure__group {
	--illustration-width: 200px;
	--illustration-height: 84px;
	--illustration-bottom: 4px;

	position: relative;
	isolation: isolate;
	border: 1px solid var(--my-border-color);
	padding: 1rem;
	background: var(--bg-panel);
}

.database-structure__columns .database-structure__group {
	padding-bottom: calc(
		var(--illustration-height) + var(--illustration-bottom) - var(--illustration-overlap)
	);
}

.database-structure__group::before {
	position: absolute;
	z-index: -1;
	inset: auto 1rem var(--illustration-bottom) auto;
	width: min(var(--illustration-width), calc(100% - 2rem));
	height: var(--illustration-height);
	background-image: var(--illustration);
	background-position: right bottom;
	background-size: contain;
	background-repeat: no-repeat;
	pointer-events: none;
	content: '';
}

.database-structure__group_cards {
	--illustration: url('@/assets/img/bg/01_card_constructor-1.png');

	min-height: 102px;
}

.database-structure__group_cards::before {
	inset: 0 72px 0 0;
	width: auto;
	height: auto;
	background-position: right center;
	background-size: min(800px, 100%) auto;
}

.database-structure__group_workspace {
	--illustration: url('@/assets/img/bg/02_workspace.png');
}

.database-structure__group_directories {
	--illustration: url('@/assets/img/bg/03_directories.png');
}

.database-structure__group_resources {
	--illustration: url('@/assets/img/bg/04_layout_resources.png');
}

.database-structure__group_directories::before,
.database-structure__group_resources::before {
	right: calc(1rem - 15px);
}

.database-structure__group_workflows {
	--illustration: url('@/assets/img/bg/05_workflows.png');
}

.database-structure__group_workspace,
.database-structure__group_workflows {
	--illustration-width: 300px;
	--illustration-height: 126px;
}

.database-structure__title {
	gap: 0.5rem;
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

.database-structure__list_two-columns {
	grid-template-columns: repeat(2, minmax(0, 1fr));
}

.database-structure__item {
	position: relative;
	padding: 0.75rem;
	padding-inline-end: 2.25rem;
	// background: #fff;
	border: 1px solid transparent;
}

.database-structure__item-label {
	text-decoration: underline;
}

.database-structure__chevron {
	position: absolute;
	top: 50%;
	inset-inline-end: 0.75rem;
	transform: translateY(-50%);
	visibility: hidden;
}

.no-touch .database-structure__item:hover {
	cursor: pointer;
	border-color: #ccc;
	background: #fff;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.14);
}

.no-touch .database-structure__group_cards:hover {
	background: #fff;
	box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.2);
}

.no-touch .database-structure__item:hover > .database-structure__chevron,
.no-touch .database-structure__group_cards:hover > .database-structure__chevron {
	visibility: visible;
}

@media (width > 50rem) {
	.database-structure__columns > .database-structure__group {
		--illustration-overlap: 50px;
	}

	.database-structure__stack {
		--illustration-overlap: 25px;
	}
}

@media (max-width: 50rem) {
	.database-structure__columns {
		grid-template-columns: 1fr;
	}
}

@media (max-width: 26rem) {
	.database-structure__list_two-columns {
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

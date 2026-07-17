<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDndStore } from '@/stores/dnd'
import { Kind } from '@/types/enum'

const props = defineProps<{
	item: any
}>()

interface Dropped {
	id: string
	parents: string[]
	text: string
	kind: number
	type: number
	hidden: boolean
	selected: boolean
	drag: boolean
	inp: boolean
}

const expanded = ref(false)
const dndStore = useDndStore()

const isDropTarget = computed(() => {
	return (
		dndStore.externalDragPayload != null && dndStore.externalDragPayload.kind === props.item.kind
	)
})

// счётчик, чтобы dragenter/dragleave от вложенных элементов не сбивали подсветку
const dragDepth = ref(0)
const isHovering = computed(() => dragDepth.value > 0)
const isHoverTarget = computed(() => isDropTarget.value && isHovering.value)

const onDragEnter = () => {
	if (!isDropTarget.value) return
	dragDepth.value++
}
const onDragLeave = () => {
	if (!isDropTarget.value) return
	dragDepth.value = Math.max(0, dragDepth.value - 1)
}

// const field = ref<Dropped | null>(null)
const onDrop = () => {
	dragDepth.value = 0
	// тут же логика приёма дропа
	// field.value = dndStore.externalDragPayload
	emit('drop')
}

const emit = defineEmits(['kill', 'drop'])
const kill = () => {
	emit('kill')
}

const options = [
	{ id: 1, label: 'Строка', value: Kind.String },
	{ id: 2, label: 'Текст', value: Kind.Text },
	{ id: 3, label: 'Дата', value: Kind.Date },
	{ id: 4, label: 'Организация', value: Kind.Org },
	{ id: 5, label: 'Сотрудник', value: Kind.Man },
	{ id: 6, label: 'Статус', value: Kind.Status },
	{ id: 7, label: 'Линк', value: Kind.Link },
	{ id: 8, label: 'Телефон', value: Kind.Phone },
	{ id: 9, label: 'Email', value: Kind.Email },
	{ id: 10, label: 'Число', value: Kind.Num },
	{ id: 11, label: 'Логический тип', value: Kind.Bool },
	{ id: 12, label: 'Таблица', value: Kind.Table },
	{ id: 13, label: 'Виртуальное поле', value: Kind.Virtual },
]

const hidden = ref(false)
const html = ref(false)
const sort = ref(false)
const format = ref('Стандартный формат')
</script>

<template lang="pug">
q-expansion-item.my-expansion(
	v-model="expanded",
	switchToggleSide,
	expandIconToggle
	:ripple='false'
	:class="{ drop: isDropTarget, 'drop-hover': isHoverTarget }",
	@dragenter.stop="onDragEnter"
	@dragleave.stop="onDragLeave"
	@dragover.prevent.stop
	@drop.stop="onDrop"
)
	template(v-slot:header)
		q-item-section
			.project
				q-icon(v-if='!props.item.children.length' name="mdi-alert-outline" color="warning" size='sm')
					q-tooltip Колонка не настроена
				span(@click.prevent) {{ props.item.text || 'Колонка'}}
					q-popup-edit(v-model="props.item.text" auto-save v-slot="scope")
						q-input(v-model="scope.value" dense autofocus counter @keyup.enter="scope.set")
		q-item-section()
			.row.items-center.q-gutter-x-sm
				q-select(dense filled v-model="props.item.kind" label="Тип данных" :options='options' map-options emit-value)
				q-checkbox.q-ml-md(v-model='hidden' label='Скрыть' dense)
		q-item-section(side)
			.but
				q-btn.close(flat round color="primary" icon="mdi-close" size="sm")
					q-menu
						q-list
							q-item.pink(clickable @click="kill")
								q-item-section(side)
									q-icon(name="mdi-delete-outline" color="negative")
								q-item-section Удалить
	.inside
		.row.items-center.justify-between
			.row.items-center
				div Раздел карточки / поле:
				.txt(v-if='props.item.children.length')
					template(v-for="item in props.item.children[0]?.parents" :key="item")
						div {{ item }}
						.q-mx-sm >
					div {{ props.item.children[0]?.text }}
				.empty(v-else)
					q-icon(name="mdi-alert-outline" color="warning" size='sm')
					|Не задано (Перетащите сюда поле из дерева справа)

			q-btn(unelevated color="secondary" label="Вычисляемое поле" size="sm") 
		.row.items-center.q-mt-md
			q-checkbox.q-ml-md(v-model='html' label='Отображать содержимое колонки как HTML' dense)
			q-select.q-ml-xl(dense filled v-model='format' label="Формат вывода" :disable='!html')
			q-checkbox.q-ml-md(v-model='sort' label='Сортировать по колонке с учетом формата' dense)
</template>

<style scoped lang="scss">
.txt {
	display: flex;
	align-items: center;
	font-size: 0.9rem;
	padding: 0px 7px;
	background: hsl(214 42% 92% / 1);
	border: 1px solid hsl(214 42% 84% / 1);
	border-radius: 4px;
	margin-left: 1rem;
}
.empty {
	font-size: 0.9rem;
	color: $warning;
	font-weight: 600;
	margin-left: 1rem;
}
.full {
	font-size: 0.9rem;
	color: $primary;
	font-weight: 600;
	line-height: 0;
	margin-left: 1rem;
}
.project {
	color: $primary;
	span {
		margin-left: 0.5rem;
		font-weight: 600;
		border-bottom: 1px dotted $primary;
	}
}
.q-expansion-item {
	background: var(--bgLight);
	border-radius: 0.25rem;
	margin-bottom: 0.25rem;
	cursor: pointer;
}
.my-expansion {
	.but {
		visibility: hidden;
	}
	&:hover {
		.but {
			visibility: visible;
		}
	}
	&.drop {
		background: #a8d2bf;
		box-shadow: var(--shad);
		z-index: 100 !important;
	}
	&.drop-hover {
		transform: scale(0.99);
		background: #6fb894; // более насыщенный тон при наведении
		outline: 2px solid teal;
	}
}

.my-expansion :deep(.q-expansion-item__container > .q-item .q-focus-helper) {
	display: none;
}
.my-expansion :deep(.q-expansion-item__container > .q-item:hover) {
	border-radius: 0.25rem;
	box-shadow: var(--shad0);
}
.q-expansion-item--expanded {
	background: #fff;
}
.inside {
	padding: 1rem;
	border-top: 1px solid #dedede;
	box-shadow: inset 0 2px 3px rgba($color: #000000, $alpha: 0.06);
	font-size: 0.8rem;
}
.name {
	color: $primary;
	span {
		border-bottom: 1px dotted $primary;
	}
}
:deep(.q-expansion-item__toggle-focus + .q-expansion-item__toggle-icon) {
	margin-top: 0;
}
:deep(.q-field__control, .q-field__native) {
	width: 220px;
}
</style>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDndStore } from '@/stores/dnd'
import { Kind, Newkind } from '@/types/enum'

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
	if (dndStore.externalDragPayload == null) return false
	// если тип колонки ещё не задан — принимаем любой kind
	if (props.item.newkind == null) return true
	return dndStore.externalDragPayload.newkind === props.item.newkind
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

const onDrop = () => {
	if (dndStore.externalDragPayload) {
		if (props.item.newkind == null && dndStore.externalDragPayload != null) {
			props.item.newkind = dndStore.externalDragPayload.newkind
		}
		emit('drop')
	}
}

const onDragStart = () => {
	dndStore.clearExternalDragPayload()
}

const emit = defineEmits(['kill', 'drop', 'remove'])
const kill = () => {
	emit('kill')
}

const options = [
	{ id: 1, label: 'Строка', value: Newkind.String },
	{ id: 2, label: 'Целое число', value: Newkind.Num },
	{ id: 3, label: 'Дробное число', value: Newkind.Digit },
	{ id: 4, label: 'Дата', value: Newkind.Datetime },
	{ id: 5, label: 'Да / нет', value: Newkind.Bool },
	{ id: 6, label: 'Идентификатор', value: Newkind.Id },
	{ id: 7, label: 'Таблица', value: Newkind.Table },
	{ id: 8, label: 'Виртуальное поле', value: Newkind.Virtual },
]

const hidden = ref(false)
const html = ref(false)
const sort = ref(false)
const format = ref('Стандартный формат')

const remove = (index: number | string) => {
	emit('remove', {
		column: props.item,
		index: index,
	})
}

const isDrob = computed(() => {
	if (props.item.newkind == Newkind.Digit) return true
	if (props.item.newkind == Newkind.Datetime) return true
	else return false
})
const opt = ['Стандартный формат', 'Нестандартный формат']
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
	@dragstart.stop='onDragStart'
)
	template(v-slot:header)
		q-item-section
			.project
				q-icon(v-if='!props.item.children.length' name="mdi-alert-outline" color="warning" size='sm')
					q-tooltip Не задано поле для колонки
				span(@click.prevent) {{ props.item.text || 'Колонка'}}
					q-popup-edit(v-model="props.item.text" auto-save v-slot="scope")
						q-input(v-model="scope.value" dense autofocus counter @keyup.enter="scope.set")
		q-item-section()
			.row.items-center.q-gutter-x-sm
				q-select(dense filled v-model="props.item.newkind" label="Тип данных" :options='options' map-options emit-value :disable='props.item.children.length > 0')
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
		.row.items-center.justify-start
			q-checkbox(v-if='props.item.newkind == 0' v-model='html' label='Отображать содержимое колонки как HTML' dense)
			q-select(v-if='isDrob' dense filled v-model='format' label="Формат вывода" :options="opt")
			q-checkbox.q-ml-lg(v-if='isDrob' v-model='sort' label='Сортировать по колонке с учетом формата' dense)
		.q-mt-md.q-mb-sm Раздел карточки / поле:
		.row
			template(v-if='props.item.children.length' v-for="(item, index) in props.item.children" :key="item.id")
				.txt
					template(v-for="check in item.parents" :key="item")
						div {{ check }}
						.q-mx-sm >
					div {{ item.text }}
					q-btn.q-ml-xs(flat round dense size="sm" icon="mdi-close" color="secondary" @click="remove(index)") 
			.empty(v-else)
				q-icon(name="mdi-alert-outline" color="warning" size='sm')
				|Не задано (Перетащите сюда поле из дерева справа)

</template>

<style scoped lang="scss">
.txt {
	display: flex;
	align-items: center;
	font-size: 0.9rem;
	padding: 0px 0 0 7px;
	background: hsl(214 42% 92% / 1);
	border: 1px solid hsl(214 42% 84% / 1);
	border-radius: 4px;
	margin-left: 1rem;
	margin-bottom: 2px;
	justify-self: start;
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
	margin-bottom: 0.5rem;
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

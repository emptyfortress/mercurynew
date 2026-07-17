<script setup lang="ts">
import { ref, computed } from 'vue'
import { Kind } from '@/types/enum'
import { useDndStore } from '@/stores/dnd'

const props = defineProps<{
	stat: Stat
}>()

const emit = defineEmits(['kill', 'toggle', 'drop'])
const dndStore = useDndStore()

const kill = () => {
	emit('kill')
}

const hidden = ref(false)
const html = ref(false)
const toggle = () => {
	emit('toggle')
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
const format = ref('Стандартный формат')

const isDropTarget = computed(() => {
	return (
		dndStore.externalDragPayload != null &&
		dndStore.externalDragPayload.kind === props.stat.data.kind
	)
})

const onDrop = () => {
	console.log('drop')
	// emit('drop', dndStore.externalDragPayload)
}
</script>

<template lang="pug">
.node(:class="{drop: isDropTarget}")
	q-btn(v-if='props.stat.children.length' flat round dense icon="mdi-chevron-down" color="primary" @click.stop="toggle" size='sm' :class='{rot: !stat.open}') 
	div(style='width: 24px' v-else)
	.edit
		span {{ props.stat.data.text}}
			q-popup-edit(v-model="props.stat.data.text" auto-save v-slot="scope")
				q-input(v-model="scope.value" dense autofocus counter @keyup.enter="scope.set")
	.row.items-center.q-gutter-x-sm
		q-select(dense filled v-model="props.stat.data.kind" label="Тип данных" :options='options' map-options emit-value)
		q-checkbox.q-ml-md(v-model='hidden' label='Скрыть' dense)
		q-checkbox.q-ml-md(v-model='html' label='HTML' dense)
		q-select(dense filled v-model='format' label="Формат вывода" disable)

	.but
		q-btn.close(flat round icon="mdi-close" @click="kill" size="sm")
</template>

<style scoped lang="scss">
.column .node {
	cursor: pointer;
	position: relative;
	transition: 0.2s ease transform;
	display: grid;
	grid-template-columns: auto 240px 1fr 60px;
	justify-content: start;
	align-items: center;
	background: var(--node);
	padding: 0.2rem 0.5rem;
	// padding-left: 1.3rem;
	border: 1px solid var(--nodeborder);
	border-radius: 4px;
	margin-bottom: 2px;
	position: relative;
	&:hover {
		border-color: $secondary;
	}
	&.drop {
		background: #a8d2bf;
		box-shadow: var(--shad);
		z-index: 100 !important;
	}

	.close {
		position: absolute;
		right: 0.5rem;
		top: 50%;
		transform: translateY(-50%);
	}
	.but {
		display: none;
	}
	&:hover {
		.but {
			display: block;
		}
	}
}
:deep(.q-field__control, .q-field__native) {
	min-width: 180px;
}
.edit {
	margin-left: 1rem;
	span {
		color: $primary;
		font-weight: 600;
		border-bottom: 1px dotted $primary;
	}
}
.rot {
	transform: rotate(-90deg);
}
</style>

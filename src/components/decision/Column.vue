<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
	stat: Stat
}>()

const emit = defineEmits(['kill', 'toggle'])

const editText = ref(props.stat.data.text)

const kill = () => {
	emit('kill')
}

const par = computed(() => {
	return props.stat.data.parents
})

const sort = ref(false)
const toggle = () => {
	emit('toggle')
}
const options = [
	{ id: 1, label: 'Текст', value: 'Текст' },
	{ id: 2, label: 'Многострочный текст', value: 'Многострочный текст' },
	{ id: 3, label: 'Целое число', value: 'Целое число' },
	{ id: 4, label: 'Дробное число', value: 'Дробное число' },
	{ id: 5, label: 'Логический (Да/Нет)', value: 'Логический (Да/Нет)' },
	{ id: 6, label: 'Дата', value: 'Дата' },
	{ id: 7, label: 'Дата и время', value: 'Дата и время' },
	{ id: 8, label: 'Список', value: 'Список' },
	{ id: 9, label: 'Справочник', value: 'Справочник' },
	{ id: 10, label: 'Файл', value: 'Файл' },
	{ id: 11, label: 'Пользователь', value: 'Пользователь' },
	{ id: 12, label: 'Документ', value: 'Документ' },
]
const coltype = ref(null)
</script>

<template lang="pug">
.node
	q-btn(v-if='props.stat.children.length' flat round dense icon="mdi-chevron-down" color="primary" @click.stop="toggle" size='sm' :class='{rot: !stat.open}') 
	div(style='width: 24px' v-else)
	.edit
		span {{ props.stat.data.text}}
			q-popup-edit(v-model="props.stat.data.text" auto-save v-slot="scope")
				q-input(v-model="scope.value" dense autofocus counter @keyup.enter="scope.set")
	.row.items-center.q-gutter-x-sm
		label Тип данных:
		q-select(dense filled v-model="coltype" :options='options')
	// q-checkbox(v-model='sort' label='Сортировка' dense)

	.but
		q-btn.close(flat round icon="mdi-close" @click="kill" size="sm")
</template>

<style scoped lang="scss">
.column .node {
	cursor: pointer;
	position: relative;
	transition: 0.2s ease transform;
	display: grid;
	grid-template-columns: auto 1fr 1fr 0.5fr 80px;
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
	min-width: 150px;
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

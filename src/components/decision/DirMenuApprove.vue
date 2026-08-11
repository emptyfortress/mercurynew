<script setup lang="ts">
const props = defineProps<{ stat: Stat }>()
import MaterialSymbolsAltRoute from '@/components/icons/MaterialSymbolsAltRoute.vue'

const emit = defineEmits(['add', 'kill', 'duble', 'rename'])

const addFolder = () => {
	emit('add', 0)
}
const addSogl = () => {
	emit('add', 1)
}
const addRoute = () => {
	emit('add', 2)
}
const addEtap = () => {
	emit('add', 3)
}
const kill = () => {
	emit('kill')
}
const duble = () => {
	emit('duble')
}
const rename = () => {
	emit('rename')
}

const menu = [
	{
		id: 0,
		label: 'Создать папку',
		icon: 'mdi-folder-plus-outline',
		action: addFolder,
		hidden: () => props.stat.data.filetype !== 0,
	},
	{
		id: 1,
		label: 'Создать согласование',
		action: addSogl,
		icon: 'mdi-message-check-outline',
		hidden: () => props.stat.data.filetype !== 0,
	},

	{
		id: 2,
		label: 'Создать маршрут',
		action: addRoute,
		icon: '',
		hidden: () => props.stat.data.filetype !== 0,
	},
	{
		id: 3,
		label: 'Создать этап',
		action: addEtap,
		icon: 'mdi-flag-triangle',
		hidden: () => props.stat.data.filetype !== 0,
	},
	{
		id: 4,
		label: 'Дублировать',
		icon: 'mdi-plus-circle-multiple-outline',
		action: duble,
		hidden: () => props.stat.data.filetype == 0,
	},
	{ id: 5, label: 'Переименовать', icon: 'mdi-pencil', action: rename },
	{ id: 6, label: 'Удалить', icon: 'mdi-trash-can-outline', action: kill },
]
</script>

<template lang="pug">
q-menu(context-menu)
	q-list
	template(v-for="item in menu" :key="item.id")
		q-item(v-if="!item.hidden?.()" clickable v-close-popup @click="item.action")
			q-item-section(avatar)
				MaterialSymbolsAltRoute.rou(v-if='item.id == 2')
				q-icon(v-else :name="item.icon" )
			q-item-section
				q-item-label
					span {{ item.label }}

</template>

<style scoped lang="scss">
.rou {
	font-size: 1.5rem;
	color: $primary;
}
.q-item:last-child {
	border-top: 1px solid #ccc;
	color: darkred;
	.q-icon {
		fill: darkred;
		color: darkred;
	}
}

.disab {
	opacity: 0.5;
	cursor: not-allowed !important;
}

:deep(.q-item__section--avatar) {
	min-width: 0;
}
</style>

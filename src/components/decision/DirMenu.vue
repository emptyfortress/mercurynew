<template lang="pug">
q-menu(context-menu)
	q-list
		q-item(v-for="item in menu" :disable="dis(item.id)" :key="item.id" clickable v-close-popup @click="item.action")
			q-item-section(avatar)
				q-icon(:name="item.icon")
			q-item-section
				q-item-label
					span {{ item.label }}

</template>

<script setup lang="ts">

const props = defineProps<{ stat: Stat }>()

const dis = ((e: number) => {
	if (props.stat.data.type === 0 && e === 2) {
		return true
	} else return false
})

const emit = defineEmits(['addFolder', 'add', 'kill', 'duble', 'rename'])

const addFolder = () => {
	emit('addFolder')
}
const add = () => {
	emit('add')
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
		label: 'Добавить папку',
		icon: 'mdi-folder-outline',
		action: addFolder,
	},
	{
		id: 1,
		label: 'Добавить',
		icon: 'mdi-plus-circle-outline',
		action: add,
	},
	{ id: 2, label: 'Дублировать', icon: 'mdi-plus-circle-multiple-outline', action: duble },
	{ id: 3, label: 'Переименовать', icon: 'mdi-pencil', action: rename },
	{ id: 4, label: 'Удалить', icon: 'mdi-trash-can-outline', action: kill },
]

</script>

<style scoped lang="scss">
.q-item:last-child {
	border-top: 1px solid #ccc;
	color: darkred;
}

.disab {
	opacity: 0.5;
	cursor: not-allowed !important;
}

:deep(.q-item__section--avatar) {
	min-width: 0;
}
</style>

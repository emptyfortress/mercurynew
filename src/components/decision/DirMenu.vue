<template lang="pug">
q-menu(context-menu)
	q-list
	template(v-for="item in menu" :key="item.id")
		q-separator(v-if="item.separator && !item.hidden?.()")
		q-item(v-else-if="!item.hidden?.()" clickable v-close-popup @click="item.action")
			q-item-section(avatar)
				q-icon(:name="item.icon")
			q-item-section
				q-item-label
					span {{ item.label }}

</template>

<script setup lang="ts">
const props = defineProps<{ stat: Stat; mode?: String }>()

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

type MenuItem = {
	id: number
	label?: string
	icon?: string
	action?: () => void
	separator?: boolean
	hidden?: () => boolean
}

const menu: MenuItem[] = [
	{
		id: 0,
		label: 'Добавить папку',
		icon: 'mdi-folder-plus-outline',
		action: addFolder,
		hidden: () =>
			(props.stat.data.type !== 0 && props.mode == 'view') ||
			props.mode == 'vid' ||
			props.mode == 'folder',
	},
	{ id: 1, label: 'Добавить', icon: 'mdi-plus-circle-outline', action: add },
	{
		id: 2,
		label: 'Дублировать',
		icon: 'mdi-plus-circle-multiple-outline',
		action: duble,
		hidden: () => props.stat.data.type === 0,
	},
	{ id: 3, label: 'Переименовать', icon: 'mdi-pencil', action: rename },
	{ id: 4, separator: true, hidden: () => props.mode !== 'poisk' },
	{ id: 5, label: 'Импорт xml', icon: 'mdi-file-import-outline', action: () => {}, hidden: () => props.mode !== 'poisk' },
	{ id: 6, label: 'Экспорт xml', icon: 'mdi-file-export-outline', action: () => {}, hidden: () => props.mode !== 'poisk' || props.stat.data.type === 0 },
	{ id: 7, separator: true, hidden: () => props.mode !== 'poisk' },
	{ id: 8, label: 'Удалить', icon: 'mdi-trash-can-outline', action: kill },
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

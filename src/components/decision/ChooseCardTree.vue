<script setup lang="ts">
import { ref } from 'vue'
import FolderTree from '@/components/decision/FolderTree.vue'

const only = ref(false)

const cardData = [
	{
		id: 'root',
		text: 'Карточки',
		children: [
			{ id: 'doc', text: 'Документ' },
			{ id: 'task', text: 'Задание' },
			{ id: 'group', text: 'Группа заданий' },
		],
	},
]
</script>

<template lang="pug">
q-checkbox(v-model="only" dense label='Только выбранные типы карточек могут быть созданы в данной папке')
br
FolderTree(:data="cardData")
</template>

<style scoped lang="scss"></style>

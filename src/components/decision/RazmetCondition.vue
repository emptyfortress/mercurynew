<script setup lang="ts">
import { ref } from 'vue'
import { useRazmetStore } from '@/stores/razmet'

defineProps<{
	conditionData?: Record<string, unknown>
}>()

const razmetStore = useRazmetStore()

const active = ref('Документооборот')

const activateProject = (activatedId: string, value: boolean) => {
	console.log(activatedId)
	// Выключаем все остальные чекбоксы и сворачиваем их
	razmetStore.projects.forEach((item) => {
		if (item.name !== activatedId) {
			item.expanded = false
		}
	})
	// Находим активированный элемент и перемещаем его на первое место
	const index = razmetStore.projects.findIndex((item) => item.name === activatedId)
	if (index > 0) {
		const [activated] = razmetStore.projects.splice(index, 1)
		activated.expanded = true
		razmetStore.projects.unshift(activated)
	} else {
		// Уже первый — просто раскрываем
		razmetStore.projects[0].expanded = true
	}
}
</script>

<template lang="pug">
q-list
	q-expansion-item.my-expansion(v-for="item in razmetStore.projects" :key="item.name" v-model="item.expanded" switchToggleSide)
		template(v-slot:header)
			q-item-section
				.project
					|Проект:
					span {{ item.name}}
			q-item-section
				.project
					|Разметок:
					span {{ item.views.length}}
			q-item-section
				q-radio(
					v-model="active",
					:val="item.name",
					@update:modelValue="activateProject(item.name, $event)"
					label="Активный проект")
</template>

<style scoped lang="scss">
.project {
	span {
		font-weight: 600;
		margin-left: 0.5rem;
	}
}
.zg {
	font-size: 1.2rem;
	span {
		margin-left: 1rem;
		font-weight: 600;
	}
}
.q-tab-panels {
	background: transparent;
	border-top: 1px solid #999;
}
.q-expansion-item {
	background: var(--bgLight);
	border-radius: 0.25rem;
	margin-bottom: 0.5rem;
	cursor: pointer;
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
}
.name {
	color: $primary;
	span {
		border-bottom: 1px dotted $primary;
	}
}
</style>


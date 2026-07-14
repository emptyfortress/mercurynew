<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRazmetStore } from '@/stores/razmet'
import SolutionRule1 from '@/components/decision/SolutionRule1.vue'
import SolutionRuleKadry from '@/components/decision/SolutionRuleKadry.vue'
import MaterialSymbolsEditOffOutline from '@/components/icons/MaterialSymbolsEditOffOutline.vue'

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

const isDisabled = (item: any) => {
	return item.name == 'Кадры' ? true : false
}
</script>

<template lang="pug">
q-list
	q-expansion-item.my-expansion(v-for="item in razmetStore.projects" :key="item.name" v-model="item.expanded" switchToggleSide)
		template(v-slot:header)
			q-item-section
				.project(:class="{disab : isDisabled(item)}")
					|Проект:
					span {{ item.name}}
			q-item-section
				.project(:class="{disab : isDisabled(item)}")
					|условий:
					span {{ item.conditions.length}}
			q-item-section(v-if='isDisabled(item)')
				.dis.q-gutter-x-sm
					MaterialSymbolsEditOffOutline.ic
					span Только для чтения

			q-item-section(v-else)
				q-radio(
					v-model="active",
					:val="item.name",
					@update:modelValue="activateProject(item.name, $event)"
					label="Активный проект")
		.inside
			SolutionRuleKadry(v-if='item.name == "Кадры"' :condition='item.conditions')
			SolutionRule1(v-else :condition='item.conditions')
</template>

<style scoped lang="scss">
.project {
	&.disab {
		color: $blue-grey-5;
	}
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
.inside {
	padding: 1rem;
}
.dis {
	color: $blue-grey-7;
}
.ic {
	font-size: 1.2rem;
	margin-bottom: -0.25rem;
}
</style>

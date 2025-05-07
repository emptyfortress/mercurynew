<script setup lang="ts">
import BugsList from '@/components/BugsList.vue'
const modelValue = defineModel<boolean>()
import IconoirSpark from '@/components/icons/IconoirSpark.vue'

const props = defineProps({
	help: {
		type: Boolean,
		required: true,
		default: true,
	},
})

const hints = [
	{ id: 0, label: 'Как скопировать приложение?', action: null },
	{ id: 1, label: 'Как создать группу приложений?', action: null },
	{ id: 2, label: 'Как создать пустую группу приложений?', action: null },
	{ id: 3, label: 'Как добавить приложение в группу?', action: null },
	{ id: 4, label: 'Как удалить приложение из группы?', action: null },
]
</script>

<template lang="pug">
	q-drawer(v-model='modelValue' side='right' :width="250" overlay bordered behavior="desktop")
		template(v-if='props.help')
			.zg Подсказки
			q-list
				q-item(clickable v-for="item in hints" :key='item.id')
					q-item-section(side)
						IconoirSpark
					q-item-section
						q-item-label {{ item.label }}
		BugsList(v-else)

</template>

<style scoped lang="scss">
:deep(.q-drawer__content) {
	margin: 1rem 0;
}
:deep(.q-item__section--side) {
	color: orange;
	padding-right: 0.5rem;
}
:deep(.q-item) {
	padding: 0.5rem;
	padding-left: 0.7rem;
}
.zg {
	text-align: center;
	font-size: 1rem;
	// font-weight: 600;
	// color: $secondary;
}
.q-list {
	color: $primary;
	font-size: 0.8rem;
}
</style>

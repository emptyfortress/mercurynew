<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDndStore } from '@/stores/dnd'

const props = defineProps<{
	item: any
}>()

const expanded = ref(false)
const dndStore = useDndStore()

const isDropTarget = computed(() => {
	return (
		dndStore.externalDragPayload != null && dndStore.externalDragPayload.kind === props.item.kind
	)
})

// счётчик, чтобы dragenter/dragleave от вложенных элементов не сбивали подсветку
const dragDepth = ref(0)
const isHovering = computed(() => dragDepth.value > 0)
const isHoverTarget = computed(() => isDropTarget.value && isHovering.value)

// const onDragEnter = () => {
// 	if (!isDropTarget.value) return
// 	dragDepth.value++
// }
// const onDragLeave = () => {
// 	if (!isDropTarget.value) return
// 	dragDepth.value = Math.max(0, dragDepth.value - 1)
// }
// const onDrop = () => {
// 	dragDepth.value = 0
// 	// тут же логика приёма дропа
// 	console.log('drop', props.item)
// }

const kill = () => {
	console.log('kill')
}
</script>

<template lang="pug">
q-expansion-item.my-expansion(
	v-model="expanded",
	switchToggleSide,
	:class="{ drop: isDropTarget, 'drop-hover': isHoverTarget }",
)
	template(v-slot:header)
		q-item-section
			.project
				span(@click.prevent) {{ props.item.text || 'Колонка'}}
					q-popup-edit(v-model="props.item.text" auto-save v-slot="scope")
						q-input(v-model="scope.value" dense autofocus counter @keyup.enter="scope.set")
		q-item-section(side)
			.but
				q-btn.close(flat round color="primary" icon="mdi-close" @click="kill" size="sm")
</template>

<style scoped lang="scss">
.project {
	color: $primary;
	span {
		font-weight: 600;
		border-bottom: 1px dotted $primary;
	}
}
.q-expansion-item {
	background: var(--bgLight);
	border-radius: 0.25rem;
	margin-bottom: 0.25rem;
	cursor: pointer;
}
.my-expansion {
	.but {
		display: none;
	}
	&:hover {
		.but {
			display: block;
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
}
.name {
	color: $primary;
	span {
		border-bottom: 1px dotted $primary;
	}
}
</style>

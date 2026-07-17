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

const onDragEnter = () => {
	if (!isDropTarget.value) return
	dragDepth.value++
}
const onDragLeave = () => {
	if (!isDropTarget.value) return
	dragDepth.value = Math.max(0, dragDepth.value - 1)
}
const onDrop = () => {
	dragDepth.value = 0
	// тут же логика приёма дропа
	console.log('drop', props.item)
}

const emit = defineEmits(['kill'])
const kill = () => {
	emit('kill')
}
</script>

<template lang="pug">
q-expansion-item.my-expansion(
	v-model="expanded",
	switchToggleSide,
	expandIconToggle
	:ripple='false'
	:class="{ drop: isDropTarget, 'drop-hover': isHoverTarget }",
	@dragenter.stop="onDragEnter"
	@dragover.prevent.stop
	@drop.stop="onDrop"
)
	template(v-slot:header)
		q-item-section
			.project
				span(@click.prevent) {{ props.item.text || 'Колонка'}}
					q-popup-edit(v-model="props.item.text" auto-save v-slot="scope")
						q-input(v-model="scope.value" dense autofocus counter @keyup.enter="scope.set")
		q-item-section(side)
			.but
				q-btn.close(flat round color="primary" icon="mdi-close" size="sm")
					q-menu
						q-list
							q-item.pink(clickable @click="kill")
								q-item-section(side)
									q-icon(name="mdi-delete-outline" color="negative")
								q-item-section Удалить
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
:deep(.q-expansion-item__toggle-focus + .q-expansion-item__toggle-icon) {
	margin-top: 0;
}
</style>

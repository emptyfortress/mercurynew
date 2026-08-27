<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
	node: any
	stat: any
}>()

const emit = defineEmits<{
	(e: 'drag-start'): void
}>()

// раскрытие панели настроек группы — отдельное от stat.open (который управляет показом потомков)
const panelOpen = ref(false)

const toggle = (stat: any) => {
	stat.open = !stat.open
}
</script>

<template lang="pug">
.nod
	q-icon.trig(
		name="mdi-chevron-down"
		v-if="props.stat.children.length"
		@click.stop="toggle(props.stat)"
		:class="{ closed: !props.stat.open }"
	)
	q-expansion-item.my-expansion(v-model="panelOpen")
		template(v-slot:header)
			.drag-handle(v-if='props.node.id !== 2' @mousedown="emit('drag-start')" @touchstart="emit('drag-start')") ⠿

			q-item-section
				.project
					|Группа:
					span [ {{ props.node.function }} ]

		.inside
			| Настройки группы
</template>

<style scoped lang="scss">
.nod {
	display: flex;
	align-items: center;
}
.q-expansion-item {
	background: var(--bgLight);
	border-radius: 0.25rem;
	margin-bottom: 0.5rem;
	cursor: pointer;
	border: var(--border);
	width: 100%;
}

.my-expansion :deep(.q-expansion-item__container > .q-item .q-focus-helper) {
	display: none;
}
.my-expansion :deep(.q-expansion-item__container > .q-item:hover) {
	border-radius: 0.25rem;
	box-shadow: var(--shad0);
}
:deep(.q-expansion-item--expanded) {
	background: white;
	box-shadow: 0 0 5px rgba(0, 0, 0, 0.7);
	border: 1px solid $secondary;
}
.trig {
	font-size: 1.4rem;
	transition: transform 0.2s;
	cursor: pointer;
	margin-right: 0.5rem;

	&.closed {
		transform: rotate(-90deg);
	}
}
.project {
	span {
		font-weight: 600;
		margin-left: 0.5rem;
	}
}
.drag-handle {
	font-size: 1.3rem;
	cursor: grab;
	user-select: none;
	margin-right: 1rem;

	&:active {
		cursor: grabbing;
	}
}
.inside {
	padding: 1rem;
}
</style>

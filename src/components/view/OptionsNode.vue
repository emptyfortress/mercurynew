<script setup lang="ts">
interface Props {
	node: any
	stat: any
}

const props = defineProps<Props>()

const collapse = (stat: any) => {
	stat.open = false
}

const emit = defineEmits(['remove'])

const remove = () => {
	emit('remove', props.stat)
}
</script>

<template lang="pug">
q-expansion-item.my-expansion(v-model="props.stat.open")
	template(v-slot:header)
		.drag-handle(@mousedown="collapse(props.stat)" @touchstart="collapse(props.stat)") ⠿

		q-item-section
			.project
				| Набор вариантов:
				span.editable(@click.stop) {{ props.node.name }}
					q-popup-edit(v-model="props.node.name" v-slot="scope")
						q-input(
							v-model="scope.value"
							dense
							autofocus
							@keyup.enter="scope.set"
						)
		q-btn.close(flat round dense color="primary" icon='mdi-dots-vertical' size="sm") 
			q-menu
				q-list
					q-item(clickable)
						q-item-section Копировать
					q-item.text-negative(clickable @click.stop="remove" )
						q-item-section Удалить

	.inside
		.text-center.q-pa-md.text-grey-6
			| Компонент "Набор вариантов" (заглушка)
			br
			q-btn(flat color="primary" icon="mdi-plus" label="Добавить вариант" size="sm")
</template>

<style scoped lang="scss">
.project {
	color: #63808c;
	span {
		font-weight: 600;
		margin-left: 0.5rem;
		color: $primary;
	}
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

.inside {
	padding: 1rem;
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
span.editable {
	color: $primary;
	border-bottom: 1px dotted $primary;
	cursor: pointer;
}
.close {
	align-self: center;
}
:deep(.q-item__section--side) {
	padding-left: 0;
}
</style>

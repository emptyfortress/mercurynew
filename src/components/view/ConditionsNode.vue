<script setup lang="ts">
interface Props {
	node: any
	stat: any
}

const props = defineProps<Props>()

const collapse = (stat: any) => {
	stat.open = false
}
</script>

<template lang="pug">
q-expansion-item.my-expansion(v-model="props.stat.open")
	template(v-slot:header)
		.drag-handle(@mousedown="collapse(props.stat)" @touchstart="collapse(props.stat)") ⠿

		q-item-section
			.project
				| Набор условий:
				span.editable(@click.stop) {{ props.node.name }}
					q-popup-edit(v-model="props.node.name" v-slot="scope")
						q-input(
							v-model="scope.value"
							dense
							autofocus
							@keyup.enter="scope.set"
						)

	.inside
		.text-center.q-pa-md.text-grey-6
			| Компонент "Набор условий" (заглушка)
			br
			q-btn(flat color="primary" icon="mdi-plus" label="Добавить условие" size="sm")
</template>

<style scoped lang="scss">
.project {
	span {
		font-weight: 600;
		margin-left: 0.5rem;
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
</style>

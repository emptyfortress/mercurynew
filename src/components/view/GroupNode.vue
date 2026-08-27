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
q-expansion-item.my-expansion(v-model="panelOpen")
	template(v-slot:header)
		q-icon.trig(
			name="mdi-chevron-down"
			v-if="props.stat.children.length"
			@click.stop="toggle(props.stat)"
			:class="{ closed: !props.stat.open }"
		)
		.drag-handle(@mousedown="emit('drag-start')" @touchstart="emit('drag-start')") ⠿

		q-item-section
			.project
				|Группа:
				span.editable(@click.stop) {{ props.node.name }}
					q-popup-edit(v-model="props.node.name" v-slot="scope")
						q-input(
							v-model="scope.value"
							dense
							autofocus
							@keyup.enter="scope.set"
						)

	.inside
		| Настройки группы
</template>

<style scoped lang="scss">
.trig {
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

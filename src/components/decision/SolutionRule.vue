<script setup lang="ts">
import { ref } from 'vue'
import { useDragAndDrop } from '@formkit/drag-and-drop/vue'
import { animations } from '@formkit/drag-and-drop'

interface Condition {
	mode: string
	state: string
	role: string
	device: string
	layout: string
}

interface Props {
	condition: Condition[]
}

const props = defineProps<Props>()

const test = ref(props.condition)

const propertyLabels = {
	mode: 'Режим',
	state: 'Состояние',
	role: 'Роль',
	device: 'Устройство',
	layout: 'Разметка',
}

const config = {
	plugins: [animations()],
	dragPlaceholderClass: 'gh',
	sortable: true,
	dragHandle: '.han',
	draggable: (child: HTMLElement) => {
		return child.classList.contains('cond')
	},
}

const [parent, tapes] = useDragAndDrop(test.value, config)
</script>

<template lang="pug">
.q-gutter-sm(ref='parent')
	.cond(v-for="(item, index) in tapes" :key="item.mode")
		.han
		.div {{index + 1}}
		div
			q-chip(
				v-for="key in ['mode', 'state', 'role', 'device']"
				:key="key"
				:label="`${propertyLabels[key]}: ${item[key]}`"
				dense
			)
		q-icon(name="mdi-arrow-right" color="primary" size="20px")
		q-chip(:label="item.layout" dense)
		q-btn(flat round icon="mdi-close" color="secondary" @click="" dense size="sm")
</template>

<style scoped lang="scss">
.han {
	width: 20px;
	height: 100%;
	cursor: move;
	background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAL0lEQVR4ARyKgQ0AMAjCWo/1KJ91OBIghBbYaKspKYEzS7SE2MmY2+e6yMXHVh4AAAD//677ygMAAAAGSURBVAMAH2sKDufNzesAAAAASUVORK5CYII=)
		repeat;
}
.cond {
	display: grid;
	grid-template-columns: 20px 10px 1fr 20px 150px auto;
	padding-right: 0.25rem;
	// justify-items: start;
	align-items: center;
	column-gap: 1rem;
	height: 41px;
	background: var(--bgLight);
	border: 1px solid #ccc;
}
.gh {
	background: hsl(213 38% 81% / 1) !important;
	box-shadow: none !important;
	border: none !important;
	// height: 50px;
	// width: 100%;
	* {
		display: none;
	}
	&:before,
	&:after {
		display: none;
	}
}
</style>

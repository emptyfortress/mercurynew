<script setup lang="ts">
import { computed, ref } from 'vue'
import PlusButton from '@/components/PlusButton.vue'
import { editor1, startRight0, stopRight0 } from '@/composable/panel0'

const blocks = ref([
	{ id: 1, selected: false },
	{ id: 2, selected: false },
	{ id: 3, selected: false },
])

const selection = ref<number | null>(null)
const select = (n: number) => {
	if (selection.value == n) {
		selection.value = null
	} else selection.value = n
}

const calcClass = (n: number) => {
	return selection.value == n ? 'selected' : ''
}
</script>

<template lang="pug">
q-page(padding)

	.editor(ref='editor1')
		.text Диаграмма
		.center
			.block(v-for="item in blocks" :key='item.id'
				:class='calcClass(item.id)'
				@click='select(item.id)'
				) {{ item.id }}
		.footer footer {{ selection }}

		PlusButton(@activate='startRight0' @stop='stopRight0')

</template>

<style scoped lang="scss">
.q-page {
	display: flex;
	justify-content: center;
	position: relative;
}
.text {
	font-size: 1.2rem;
}
.center {
	display: flex;
	justify-content: center;
	gap: 6rem;
}
.block {
	width: 150px;
	height: 80px;
	background: #ccc;
	cursor: pointer;
	&.selected {
		border: 3px solid black;
	}
}
.footer {
	font-size: 0.8rem;
}
</style>

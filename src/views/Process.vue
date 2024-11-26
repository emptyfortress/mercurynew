<script setup lang="ts">
import { ref } from 'vue'
import { useStorage } from '@vueuse/core'

const app = useStorage('app', localStorage)

const blocks = ref([
	{ id: 0, selected: false },
	{ id: 1, selected: false },
	{ id: 2, selected: false },
])
const select = (e: any) => {
	blocks.value.map((item) => (item.selected = false))
	e.selected = true
}
</script>

<template lang="pug">
q-page(padding)
	.editor
		.text Диаграмма
		.center
			.block(v-for="item in blocks" :key='item.id'
				:class='{selected: item.selected}'
				@click='select(item)'
				)
		.footer footer

</template>

<style scoped lang="scss">
.q-page {
	display: flex;
	align-items: start;
	justify-content: center;
}
.editor {
	width: 80%;
	height: 600px;
	height: calc(100vh - 120px);
	background: #fff;
	padding: 0.5rem;
	border-radius: 0.4rem;
	display: flex;
	justify-content: space-between;
	flex-direction: column;
	align-items: center;
	box-shadow: 0 11px 20px 0 rgba(0, 0, 0, 0.2);
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

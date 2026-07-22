<script setup lang="ts">
import { ref } from 'vue'
import Component from '@/components/decision/GroupPanel.vue'

// const treeData = ref<any[]>([
// 	{
// 		id: 'col-1784095913401-1',
// 		type: 'column',
// 		text: 'Колонка 1',
// 		children: [
// 			{
// 				id: '45927f2a-b469-4015-a314-b812ebec4cef',
// 				type: 'param',
// 				text: 'Название',
// 				parents: ['Задание', 'Данные УПД'],
// 				kind: 0,
// 			},
// 		],
// 	},
// 	{ id: 'col-1784095914903-2', type: 'column', text: 'Колонка 2', children: [] },
// ])
</script>

<template lang="pug">
q-page(padding)
	.cont
		div
			Component()
</template>

<style scoped lang="scss">
.cont {
	display: flex;
	> div {
		margin: auto;
		width: 1024px;
		justify-content: center;
		align-items: center;
	}
}
</style>

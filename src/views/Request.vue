<script setup lang="ts">
import { computed } from 'vue'
import { useList } from '@/stores/list'

const props = defineProps({
	id: {
		type: Number,
		required: true,
		default: 0
	}
})

const list = useList()

const current = computed(() => {
	return list.lists.find((el) => el.id == props.id)
})
</script>

<template lang="pug">
q-page(padding)
	.editor(ref='editor1')
		.top()
			.zg Запрос "{{ current?.label }}"

		// PlusButton(@activate='startRight0' @stop='stopRight0')
</template>

<style scoped lang="scss">
// .editor {
// 	padding-top: 4rem;
// 	display: flex;
// 	justify-content: center;
// 	// flex-direction: column;
// 	align-items: start;
// 	position: relative;
// 	// max-width: 1200px;
// }

.q-page {
	display: flex;
	flex-direction: column;
	align-items: center;
	position: relative;
	// top: 0;
}


.editor {
	display: block;
	padding: 0;
	background: var(--bgLight);
	position: relative;
}

.zg {
	font-size: 1.3rem;
	font-weight: 500;
}
</style>

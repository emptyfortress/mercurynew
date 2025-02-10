<script setup lang="ts">
// import { computed } from 'vue'
// import { useList } from '@/stores/list'
import Text1 from '@/components/Text1.vue'

// const props = defineProps({
// 	id: {
// 		type: String,
// 		required: true,
// 		default: '0'
// 	}
// })

// const list = useList()

// const current = computed(() => {
// 	return list.lists.find((el) => el.id == +props.id)
// })
</script>

<template lang="pug">
q-page(padding)
	.editor(ref='editor1')
		.top()
			// .zg Запрос "{{ current?.label }}"
			.zg Запрос "Все заявки"
			div
				q-btn(flat round dense icon="mdi-undo" color="primary" @click="") 
				q-btn(flat round dense icon="mdi-redo" color="primary" @click="") 
				q-btn.q-ml-md(flat round dense icon="mdi-content-duplicate" color="primary" @click="") 

		Text1()
</template>

<style scoped lang="scss">
.q-page {
	display: flex;
	flex-direction: column;
	align-items: center;
	position: relative;
}


.editor {
	display: block;
	padding: 0;
	// background: var(--bgLight);
	position: relative;
}

.zg {
	font-size: 1.3rem;
	font-weight: 500;
}
</style>

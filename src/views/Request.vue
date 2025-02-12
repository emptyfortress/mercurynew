<script setup lang="ts">
// import { computed } from 'vue'
// import { useList } from '@/stores/list'
import Text1 from '@/components/Text1.vue'
import IconCopy from '@/components/icons/IconCopy.vue'
import IconSave from '@/components/icons/IconSave.vue'
import IconSearch from '@/components/icons/IconSearch.vue'

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
				q-btn.q-ml-md(flat round dense color="primary" @click="") 
					IconCopy.ic
					q-tooltip Дублировать
				q-btn.q-ml-sm(flat round dense color="primary" @click="") 
					IconSave.ic
					q-tooltip Сохранить
				q-btn.q-ml-sm(flat round dense color="primary" @click="") 
					IconSearch.ic
					q-tooltip Искать

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
	max-width: 1200px;
	// background: var(--bgLight);
	position: relative;
	// background: #ccc;
}

.zg {
	font-size: 1.3rem;
	font-weight: 500;
}

.ic {
	font-size: 1.5rem;
}
</style>

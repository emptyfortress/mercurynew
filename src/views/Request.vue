<script setup lang="ts">
import { ref } from 'vue'
import IconSearch from '@/components/icons/IconSearch.vue'
import IconUndo from '@/components/icons/IconUndo.vue'
import IconRedo from '@/components/icons/IconRedo.vue'
import IconWizard from '@/components/icons/IconWizard.vue'
import IconLogic from '@/components/icons/IconLogic.vue'
import TextAi from '@/components/TextAi.vue'
import Text2 from '@/components/Text2.vue'

const main = ref(true)
const toggleMain = (() => {
	main.value = !main.value
})
</script>

<template lang="pug">
q-page(padding)
	.editor(ref='editor1')
		.top()
			.zg Запрос "Все заявки"
			.q-gutter-x-sm
				q-btn(flat round dense color="primary" @click="") 
					IconUndo.ic
					q-tooltip Отменить
				q-btn(flat round dense color="primary" @click="") 
					IconRedo.ic
					q-tooltip Повторить
				q-btn(flat round dense color="primary" @click="toggleMain") 
					template(v-if='main')
						IconWizard.ic
						q-tooltip ИИ-ассистент
					template(v-else)
						IconLogic.ic
						q-tooltip Конструктор
				q-btn(flat round dense color="primary" @click="") 
					IconSearch.ic
					q-tooltip Искать

		transition(name="slide-bottom" mode="out-in")
			Text2(v-if='main')
			TextAi(v-else)
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

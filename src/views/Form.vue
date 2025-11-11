<script setup lang="ts">
import { ref, computed } from 'vue'
import PlusButton1 from '@/components/PlusButton1.vue'
import LibButton from '@/components/LibButton.vue'
import { usePanels } from '@/stores/panels'
import FormEditor from '@/components/FormEditor.vue'
import { useControl } from '@/stores/controls'
import Toolbar from '@/components/common/Toolbar.vue'
import { useTitle } from '@vueuse/core'
import { useStorage } from '@vueuse/core'

const app = useStorage('app', localStorage)
const title = useTitle()
title.value = 'Формы: ' + app.value.label

const control = useControl()
const panels = usePanels()

const startRight = async () => {
	panels.setRight(true)
}

const startLeft = async () => {
	panels.setLeft(true)
}

const stopRight = async () => {
	panels.setRight(false)
}

const stopLeft = async () => {
	panels.setLeft(false)
}

const fullscreen = ref(false)

const toggleFull = () => {
	if (fullscreen.value == false) {
		panels.setRight(false)
		panels.setLeft(false)
	} else {
		panels.setRight(true)
		panels.setLeft(true)
	}
	fullscreen.value = !fullscreen.value
}
const calcPageClass = computed(() => {
	if (panels.right && panels.left) return 'collapsedB'
	if (panels.left) return 'collapsedL'
	if (panels.right) return 'collapsedR'
	return ''
})
</script>

<template lang="pug">
q-page(padding
	:class='calcPageClass'
	)
	LibButton(@activate='startLeft' @stop='stopLeft')
	.editor
		.top(@click='control.deselect')
			.zg Форма "Просмотр"
			div
				q-btn.q-ml-md(flat round dense icon="mdi-content-duplicate" color="primary" @click="") 
				q-btn.q-ml-md(flat round dense color="primary" @click="toggleFull") 
					q-icon(v-if='fullscreen' name="mdi-fullscreen-exit" color="primary")
					q-icon(v-else name="mdi-fullscreen" color="primary")

		FormEditor
		Toolbar


	PlusButton1(@activate='startRight' @stop='stopRight')


</template>

<style scoped lang="scss">
.q-page {
	display: grid;
	grid-template-columns: 50px 1fr 50px;
	column-gap: 0.5rem;
	transition: all 0.2s ease;
	&.collapsedL {
		grid-template-columns: 390px 1fr 50px;
	}
	&.collapsedR {
		grid-template-columns: 50px 1fr 390px;
	}
	&.collapsedB {
		grid-template-columns: 390px 1fr 390px;
	}
}

.editor {
	margin-top: 0;
	padding: 0;
	background: var(--bgLight);
	position: relative;
}

.zg {
	font-size: 1.3rem;
	font-weight: 500;
}
</style>

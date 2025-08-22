<script setup lang="ts">
import { ref, computed } from 'vue'
import PlusButton1 from '@/components/PlusButton1.vue'
import LibButton from '@/components/LibButton.vue'
import { usePanels } from '@/stores/panels'
import { useMotion } from '@vueuse/motion'
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
const editor = ref<HTMLElement>()

const full = { width: 1500, x: 0 }
const leftStart = { width: 1150, x: 175 }
const rightStart = { width: 1150, x: -175 }
const allStart = { width: 800, x: 0 }

const calcStart = computed(() => {
	if (panels.left && panels.right) return allStart
	if (!panels.left && !panels.right) return full
	if (panels.left) return leftStart
	if (panels.right) return rightStart
})

const { apply: editorAnim, stop } = useMotion(editor, {
	enter: calcStart.value,
	start: { width: 1500, x: 0, transition: { stiffness: 200, damping: 20 } },
	shrinkRight: { width: 1150, x: -175, transition: { stiffness: 200, damping: 20 } },
	shrinkLeft: { width: 1150, x: 175, transition: { stiffness: 200, damping: 20 } },
	shrinkAll: { width: 800, x: 0, transition: { stiffness: 200, damping: 20 } },
})

const startRight = async () => {
	panels.setRight(true)
	if (panels.left && panels.right) {
		await editorAnim('shrinkAll')
	} else await editorAnim('shrinkRight')
	stop()
}

const startLeft = async () => {
	panels.setLeft(true)
	if (panels.left && panels.right) {
		await editorAnim('shrinkAll')
	} else await editorAnim('shrinkLeft')
	stop()
}

const stopRight = async () => {
	setTimeout(() => {
		panels.left ? editorAnim('shrinkLeft') : editorAnim('start')
	}, 400)
	stop()
}

const stopLeft = async () => {
	setTimeout(() => {
		panels.right ? editorAnim('shrinkRight') : editorAnim('start')
	}, 400)
	stop()
}

const fullscreen = ref(false)
const toggleFull = () => {
	if (fullscreen.value == false) {
		panels.setRight(false)
		stopRight()
		panels.setLeft(false)
		stopLeft()
	} else {
		panels.setRight(true)
		startRight()
		panels.setLeft(true)
		startLeft()
	}
	fullscreen.value = !fullscreen.value
}
</script>

<template lang="pug">
q-page(padding)
	.editor(ref='editor')
		.top(@click='control.deselect')
			.zg Форма "Просмотр"
			div
				q-btn(flat round dense icon="mdi-undo" color="primary" @click="") 
				q-btn(flat round dense icon="mdi-redo" color="primary" @click="") 
				q-btn.q-ml-md(flat round dense icon="mdi-content-duplicate" color="primary" @click="") 
				q-btn.q-ml-md(flat round dense color="primary" @click="toggleFull") 
					q-icon(v-if='fullscreen' name="mdi-fullscreen-exit" color="primary")
					q-icon(v-else name="mdi-fullscreen" color="primary")

		FormEditor


		PlusButton1(@activate='startRight' @stop='stopRight')
		LibButton(@activate='startLeft' @stop='stopLeft')

		Toolbar

</template>

<style scoped lang="scss">
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

<script setup lang="ts">
import { ref, computed } from 'vue'
import IconSearch from '@/components/icons/IconSearch.vue'
import IconUndo from '@/components/icons/IconUndo.vue'
import IconRedo from '@/components/icons/IconRedo.vue'
import IconWizard from '@/components/icons/IconWizard.vue'
import IconLogic from '@/components/icons/IconLogic.vue'
import TextAi from '@/components/TextAi.vue'
import RequestGrid from '@/components/RequestGrid.vue'
import PreviewButton from '@/components/PreviewButton.vue'
import PredButton from '@/components/PredButton.vue'
import { usePanels } from '@/stores/panels'
import { useMotion } from '@vueuse/motion'
import DragEditWindow1 from '@/components/DragEditWindow1.vue'
import { useTree } from '@/stores/tree12'

const mytree = useTree()

const main = ref(true)
const toggleMain = () => {
	main.value = !main.value
}

const panels = usePanels()
const editorPreview = ref<HTMLElement>()

const full = { width: 1500, x: 0 }
const leftStart = { width: 1150, x: 175 }
const rightStart = { width: 1150, x: -175 }
const allStart = { width: 800, x: 0 }

const calcStart = computed(() => {
	if (panels.pred && panels.preview) return allStart
	if (!panels.pred && !panels.preview) return full
	if (panels.pred) return leftStart
	if (panels.preview) return rightStart
})

const { apply: folderAnim, stop } = useMotion(editorPreview, {
	enter: calcStart.value,
	start: { width: 1500, x: 0, transition: { stiffness: 200, damping: 20 } },
	shrinkRight: { width: 1150, x: -175, transition: { stiffness: 200, damping: 20 } },
	shrinkLeft: { width: 1150, x: 175, transition: { stiffness: 200, damping: 20 } },
	shrinkAll: { width: 800, x: 0, transition: { stiffness: 200, damping: 20 } },
})

const startRight = async () => {
	panels.setPreview(true)
	if (panels.pred && panels.preview) {
		await folderAnim('shrinkAll')
	} else await folderAnim('shrinkRight')
	stop()
}

const startLeft = async () => {
	panels.setPred(true)
	if (panels.pred && panels.preview) {
		await folderAnim('shrinkAll')
	} else await folderAnim('shrinkLeft')
	stop()
}

const stopRight = async () => {
	setTimeout(() => {
		panels.pred ? folderAnim('shrinkLeft') : folderAnim('start')
	}, 400)
	stop()
}

const stopLeft = async () => {
	setTimeout(() => {
		panels.preview ? folderAnim('shrinkRight') : folderAnim('start')
	}, 400)
	stop()
}
</script>

<template lang="pug">
q-page(padding)
	.edito(ref='editorPreview')
		div
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
					q-btn(flat round dense color="primary" @click="startRight") 
						IconSearch.ic
						q-tooltip Искать

			transition(name="slide-bottom" mode="out-in")
				RequestGrid(v-if='main' @button='startRight')
				TextAi(v-else)

		PreviewButton(@activate='startRight' @stop='stopRight')
		PredButton(@activate='startLeft' @stop='stopLeft')

	DragEditWindow1(v-model="mytree.isDragWindow")
</template>

<style scoped lang="scss">
.q-page {
	display: flex;
	justify-content: center;
	position: relative;
	align-items: start;
}

.edito {
	width: 1200px;
	height: calc(100vh - 120px);
	border-radius: 0.4rem;
	position: relative;
	background: white;
	box-shadow: var(--shad0);
}

.top {
	width: 100%;
}

.zg {
	font-size: 1.3rem;
	font-weight: 500;
}

.ic {
	font-size: 1.5rem;
}
.test {
	width: 48px;
	height: 48px;
	background: #fff;
	box-shadow: var(--shad0);
	border-radius: 24px;
	position: absolute;
	top: 0;
	left: -58px;
	text-align: center;
	cursor: pointer;
}
</style>

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
import { usePanels } from '@/stores/panels'
import { useMotion } from '@vueuse/motion'
import DragEditWindow1 from '@/components/DragEditWindow1.vue'
import { useTree } from '@/stores/tree12'
import InfoDialog from '@/components/InfoDialog.vue'

const mytree = useTree()

const main = ref(true)
const toggleMain = (() => {
	main.value = !main.value
})

const panels = usePanels()
const editorPreview = ref<HTMLElement>()

const full = { width: 1200, x: 0 }
const rightPreview = { width: 800, x: -225 }

const calcStart = computed(() => {
	if (!panels.preview) return full
	if (panels.preview) return rightPreview
})

const { apply: previewAnim, stop } = useMotion(editorPreview, {
	initial: calcStart.value,
	enter: calcStart.value,
	start: { width: 1200, x: 0, transition: { stiffness: 200, damping: 20 } },
	shrinkRight: { width: 800, x: -225, transition: { stiffness: 200, damping: 20 } },
})

const startPreview = async () => {
	panels.setPreview(true)
	await previewAnim('shrinkRight')
	stop()
}
const stopPreview = async () => {
	setTimeout(() => {
		previewAnim('start')
	}, 400)
	stop()
}

const isInfoVisible = ref(false)
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
					q-btn(flat round dense color="primary" @click="startPreview") 
						IconSearch.ic
						q-tooltip Искать

			transition(name="slide-bottom" mode="out-in")
				RequestGrid(v-if='main' @button='startPreview')
				TextAi(v-else)

			q-btn.info(flat round icon="mdi-help-circle" dense color="secondary" @click="isInfoVisible = !isInfoVisible") 

		PreviewButton(@activate='startPreview' @stop='stopPreview')

	DragEditWindow1(v-model="mytree.isDragWindow")
	InfoDialog(v-model="isInfoVisible")

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

.info {
	position: absolute;
	bottom: .5rem;
	left: .5rem;
}


.zg {
	font-size: 1.3rem;
	font-weight: 500;
}

.ic {
	font-size: 1.5rem;
}
</style>

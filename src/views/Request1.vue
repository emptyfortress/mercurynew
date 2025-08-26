<script setup lang="ts">
import { ref, computed } from 'vue'
// import MaterialSymbolsUndoRounded from '@/components/icons/MaterialSymbolsUndoRounded.vue'
// import MaterialSymbolsRedoRounded from '@/components/icons/MaterialSymbolsRedoRounded.vue'
import MdiWizardHat from '@/components/icons/MdiWizardHat.vue'
import TablerLogicNand from '@/components/icons/TablerLogicNand.vue'
import TextAi from '@/components/TextAi.vue'
import Loading from '@/components/Loading.vue'
import RequestGrid from '@/components/RequestGrid.vue'
import PreviewButton from '@/components/PreviewButton.vue'
import PredButton from '@/components/PredButton.vue'
import { usePanels } from '@/stores/panels'
import { useMotion } from '@vueuse/motion'
import DragEditWindow1 from '@/components/DragEditWindow1.vue'
import { useKeys } from '@/stores/keys'
import { useRoute } from 'vue-router'
import { useList } from '@/stores/list'
import { useQuasar } from 'quasar'
import { useTitle } from '@vueuse/core'
import { useStorage } from '@vueuse/core'

const app = useStorage('app', localStorage)
const title = useTitle('Папки: ' + app.value.label)
// title.value = 'Папки: ' + app.value.label

const list = useList()
const route = useRoute()

const currentFolder = computed(() => {
	return list.lists.find((item) => item.id === route.params.id)
	// return list.lists.find((item) => item.id === Number(route.params.id))
})

const mykeys = useKeys()

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

const isShaking = ref(false)
const isShaking1 = ref(false)

const startPred = () => {
	if (!panels.pred) startLeft()
	else {
		isShaking.value = true
		setTimeout(() => {
			isShaking.value = false
		}, 1000)
	}
}
const isSearching = ref(false)

const $q = useQuasar()
const checkStartSearch = () => {
	if (mykeys.hasParameters.length == 0) {
		isSearching.value = true
	} else {
		if (panels.preview) {
			isShaking1.value = true
			setTimeout(() => {
				isShaking1.value = false
				$q.notify({
					icon: 'mdi-check-bold',
					color: 'positive',
					message: 'Заполните форму запроса справа',
				})
			}, 1000)
		} else startRight()
	}
	mykeys.removeDragWindow()
}
</script>

<template lang="pug">
q-page(padding)
	.edito(ref='editorPreview')
		.first
			.top()
				.zg Настройка папки "{{ currentFolder?.label }}"
				.q-gutter-x-sm
					q-btn(flat round dense color="primary" @click="" icon='mdi-undo') 
						q-tooltip Отменить
					q-btn(flat round dense color="primary" @click="" icon="mdi-redo") 
						q-tooltip Повторить
					q-btn(flat round dense color="primary" @click="toggleMain") 
						template(v-if='main')
							MdiWizardHat.ic
							q-tooltip ИИ-ассистент
						template(v-else)
							TablerLogicNand.ic
							q-tooltip Конструктор

			transition(name="slide-bottom" mode="out-in")
				RequestGrid(v-if='main' @button='checkStartSearch' @open='startRight')

				TextAi(v-else)

		template(v-if='main')
			Loading(@startPred='startPred' v-model:poisk='isSearching' button :folder='currentFolder?.label')

		PreviewButton(@activate='startRight' @stop='stopRight' :class="{'shake-horizontal': isShaking1}" @search='isSearching = true')
		PredButton(@activate='startLeft' @stop='stopLeft' :class="{'shake-horizontal': isShaking}")

	DragEditWindow1(v-model="mykeys.isDragWindow")
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
}
.first {
	background: #fff;
	border-radius: 0.4rem;
	box-shadow: var(--shad0);
	min-height: calc(100vh - 120px - 330px);
}
.setup {
	height: 300px;
	background: white;
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

.shake-horizontal {
	-webkit-animation: shake-horizontal 0.5s cubic-bezier(0.455, 0.03, 0.515, 0.955) both;
	animation: shake-horizontal 0.5s cubic-bezier(0.455, 0.03, 0.515, 0.955) both;
}

/* ----------------------------------------------
 * Generated by Animista on 2025-4-1 16:15:5
 * Licensed under FreeBSD License.
 * See http://animista.net/license for more info. 
 * w: http://animista.net, t: @cssanimista
 * ---------------------------------------------- */

/**
 * ----------------------------------------
 * animation shake-horizontal
 * ----------------------------------------
 */
@-webkit-keyframes shake-horizontal {
	0%,
	100% {
		-webkit-transform: translateX(0);
		transform: translateX(0);
	}
	10%,
	30%,
	50%,
	70% {
		-webkit-transform: translateX(-10px);
		transform: translateX(-10px);
	}
	20%,
	40%,
	60% {
		-webkit-transform: translateX(10px);
		transform: translateX(10px);
	}
	80% {
		-webkit-transform: translateX(8px);
		transform: translateX(8px);
	}
	90% {
		-webkit-transform: translateX(-8px);
		transform: translateX(-8px);
	}
}
@keyframes shake-horizontal {
	0%,
	100% {
		-webkit-transform: translateX(0);
		transform: translateX(0);
	}
	10%,
	30%,
	50%,
	70% {
		-webkit-transform: translateX(-10px);
		transform: translateX(-10px);
	}
	20%,
	40%,
	60% {
		-webkit-transform: translateX(10px);
		transform: translateX(10px);
	}
	80% {
		-webkit-transform: translateX(8px);
		transform: translateX(8px);
	}
	90% {
		-webkit-transform: translateX(-8px);
		transform: translateX(-8px);
	}
}
</style>

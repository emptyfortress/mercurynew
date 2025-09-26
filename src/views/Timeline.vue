<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTitle } from '@vueuse/core'
import PlusButton from '@/components/PlusButton.vue'
import { usePanels } from '@/stores/panels'
import { useMotion } from '@vueuse/motion'
import HodIspMain from '@/components/HodIspMain.vue'

const title = useTitle()
title.value = 'Ход исполнения'

const editor1 = ref<HTMLElement>()

const panels = usePanels()

const full = { width: 1500, x: 0 }
const rightStart = { width: 1150, x: -175 }

const calcStart = computed(() => {
	if (!panels.right0) return full
	if (panels.right0) return rightStart
})

const { apply: editorAnim, stop } = useMotion(editor1, {
	initial: calcStart.value,
	enter: calcStart.value,
	start: { width: 1500, x: 0, transition: { stiffness: 200, damping: 20 } },
	shrinkRight: { width: 1150, x: -175, transition: { stiffness: 200, damping: 20 } },
})

const startRight0 = async () => {
	panels.setRight0(true)
	await editorAnim('shrinkRight')
	stop()
}

const stopRight0 = async () => {
	setTimeout(() => {
		editorAnim('start')
	}, 400)
	stop()
}
</script>

<template lang="pug">
q-page(padding)
	.edito(ref='editor1')
		HodIspMain
		PlusButton(@activate='startRight0' @stop='stopRight0')

</template>

<style scoped lang="scss">
.q-page {
	display: flex;
	justify-content: center;
	position: relative;
}
// .q-splitter__separator:hover {
// 	border-top: 2px dotted black;
// }
:deep(.q-splitter__separator:hover, .q-splitter__separator:focus) {
	border-top: 2px dotted var(--dvviolet);
}
:deep(.q-splitter--horizontal > .q-splitter__separator) {
	height: 2px;
}
</style>

<script setup lang="ts">
import { ref } from 'vue'
import { useTitle } from '@vueuse/core'
import InfoButton from '@/components/InfoButton.vue'
import { usePanels } from '@/stores/panels'
import HodIspMain from '@/components/HodIspMain.vue'

const title = useTitle()
title.value = 'Ход исполнения'

const panels = usePanels()

const startRight0 = async () => {
	panels.setRight0(true)
}

const stopRight0 = async () => {
	panels.setRight0(false)
}

const nodeSelected = ref(null)
const selectNode = (e: any) => {
	nodeSelected.value = e
}
</script>

<template lang="pug">
q-page(padding
	:class='{ collapsed: panels.right0}'
	)
	.edito
		HodIspMain(@selectNode='selectNode')
	InfoButton(@activate='startRight0' @stop='stopRight0' :show='nodeSelected')

</template>

<style scoped lang="scss">
.q-page {
	display: grid;
	grid-template-columns: 1fr 80px;
	column-gap: 0.5rem;
	transition: all 0.2s ease;
	&.collapsed {
		grid-template-columns: 1fr 390px;
	}
}

:deep(.q-splitter__separator:hover, .q-splitter__separator:focus) {
	border-top: 2px dotted var(--dvviolet);
}
:deep(.q-splitter--horizontal > .q-splitter__separator) {
	height: 2px;
}
</style>

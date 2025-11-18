<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import PlusButton from '@/components/PlusButton.vue'
import { usePanels } from '@/stores/panels'
import DiagramSvg from '@/components/DiagramSvg.vue'
import Look from '@/components/Look.vue'
import { useTitle } from '@vueuse/core'
import { useStorage } from '@vueuse/core'
import { useApps } from '@/stores/apps'
import { storeToRefs } from 'pinia'

const app = useStorage('app', localStorage)
const title = useTitle()
title.value = 'Процесс: ' + app.value.label

const panels = usePanels()

const startRight0 = async () => {
	panels.setRight0(true)
}

const stopRight0 = async () => {
	panels.setRight0(false)
}

// NEW: loader visibility from store
const appsStore = useApps()
const { showLoader } = storeToRefs(appsStore)
</script>

<template lang="pug">
q-page(padding
	:class='{ collapsed: panels.right0}'
	)
	//- Loader overlay respecting showLoader
	.loader(v-if="showLoader")
		q-skeleton(type="rect" width="100%" height="100%")

	.editor
		.zg {{ title }}
		.center
			DiagramSvg
			Look

	PlusButton(@activate='startRight0' @stop='stopRight0')
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

.text {
	font-size: 1.2rem;
}

.editor {
	width: 100%;
	margin-top: 0;
	padding-top: 4rem;
	display: flex;
	justify-content: center;
	align-items: start;
	position: relative;
}
.zg {
	font-size: 1.3rem;
	font-weight: 500;
	position: absolute;
	top: 0.5rem;
}

/* Loader overlay */
.loader {
	position: absolute;
	inset: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	background: rgba(255, 255, 255, 0.8);
	z-index: 9999;
}
</style>

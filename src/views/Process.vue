<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
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

// Local loading state for the skeleton inside .editor
const loading = ref(false)
let timer: ReturnType<typeof setTimeout> | null = null

// Watch the store flag and trigger the local loader for 3 seconds
watch(
	() => showLoader.value,
	(newVal) => {
		if (newVal) {
			loading.value = true
			// Clear any previous timer
			if (timer) clearTimeout(timer)
			timer = setTimeout(() => {
				loading.value = false
				timer = null
			}, 3000)
		} else {
			loading.value = false
			if (timer) clearTimeout(timer)
			timer = null
		}
	},
	{ immediate: true }
)
</script>

<template lang="pug">
q-page(padding
	:class='{ collapsed: panels.right0}'
	)
	.editor
		//- Skeleton loader inside .editor when loading
		div(v-if="loading" class="editor-loader")
			q-skeleton(type="rect" width="100%" height="100%")

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

/* Loader skeleton inside .editor */
.editor-loader {
	position: absolute;
	inset: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 9999;
}

.zg {
	font-size: 1.3rem;
	font-weight: 500;
	position: absolute;
	top: 0.5rem;
}
</style>

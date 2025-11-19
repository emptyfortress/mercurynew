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
		//- Loader skeleton inside .editor when loading
		div(v-if="loading" )
			.skel(class="editor-loader")
				q-skeleton(type="circle" width="46px" height="46px")
				q-skeleton(type="rect" width="120px" height="90px")
				q-skeleton(type="rect" width="40px" height="40px")
				q-skeleton(type="rect" width="120px" height="90px")
				q-skeleton(type="rect" width="120px" height="90px")
				q-skeleton(type="circle" width="46px" height="46px")
		.roles(v-if="loading" )
			q-skeleton(type="text" width="50px")
			q-skeleton(type="circle" width="46px" height="46px")
			q-skeleton(type="circle" width="46px" height="46px")

		//- Hide .center when loading, show with fade transition when finished
		transition(name="fade")
			div(v-if="!loading" class="center")
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
	z-index: 9999;
}

/* Fade transition for .center */
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
.fade-enter-to,
.fade-leave-from {
	opacity: 1;
}

.skel {
	margin: 3rem auto;
	width: 700px;
	height: 100px;
	display: flex;
	justify-content: space-around;
	align-items: center;
}
.roles {
	position: absolute;
	bottom: 2rem;
	left: 2rem;
	display: flex;
	justify-content: start;
	gap: 2rem;
}
.q-skeleton {
	background: hsl(214 27% 88% / 1);
}
</style>

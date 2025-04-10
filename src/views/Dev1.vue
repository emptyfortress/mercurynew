<script setup lang="ts">
import { ref, computed } from 'vue'
import { motion, animate, stagger, AnimatePresence } from 'motion-v'
import { useRouter, useRoute } from 'vue-router'
import IconFolderOpen from '@/components/icons/IconFolderOpen.vue'
import { useApps } from '@/stores/apps'
import { useDragAndDrop } from '@formkit/drag-and-drop/vue'
import { animations } from '@formkit/drag-and-drop'

const myapps = useApps()
const router = useRouter()
const route = useRoute()

const list = computed(() => {
	return myapps.apps.filter((item) => item.id == +route.params.id)[0].list
})

const Div = motion.div

const back = () => {
	router.back()
}

const config = {
	plugins: [animations()],
	dragPlaceholderClass: 'ghost',
	sortable: true,
	draggable: (child: HTMLElement) => {
		return child.classList.contains('it')
	},
}
const [parent, tapes] = useDragAndDrop(list.value, config)

const expanded = ref(false)
</script>

<template lang="pug">
q-page(padding)
	.cont
		Div.box(@click='back' layout-id="underline")
			.header
				IconFolderOpen.ic
				|Маркетинг
			Div.pa(ref='parent'
				:class="{'end': expanded}"
			)
				// Div.it(v-for="(item, index) in tapes", :key="item.id",
				// 	:data-state="expanded",
				// 	layout,
				// )

</template>

<style scoped lang="scss">
.header {
	font-size: 1.5rem;
	text-align: center;
	vertical-align: bottom;
}
.ic {
	font-size: 1.9rem;
	margin-bottom: -5px;
	margin-right: 0.5rem;
}
.cont {
	width: 728px;
	margin: 0 auto;
	margin-bottom: 0.5rem;
}
.box {
	width: 100%;
	height: 400px;
	background: hsl(213deg 83.95% 94.68%);
	border: 2px solid var(--green);
	border-radius: 0.5rem;
	z-index: 10;
}
</style>

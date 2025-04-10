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
	Div.box(@click='back' layout-id="underline")
		.header
			span Маркетинг
		Div.parent(ref='parent'
			:class="{'end': expanded}"
		)
			Div.it(v-for="(item, index) in tapes", :key="item.id",)

</template>

<style scoped lang="scss">
.header {
	text-align: center;
	color: $primary;
	margin-bottom: 0.8rem;
	span {
		font-size: 1.2rem;
		border-bottom: 1px dotted $primary;
	}
}
.ic {
	font-size: 1.9rem;
	margin-bottom: -5px;
	margin-right: 0.5rem;
}
.parent {
	width: initial;
	display: flex;
	margin: 0.5rem;
	&:hover {
		box-shadow: none;
	}
}
.box {
	margin: 0 auto;
	margin-top: 1rem;
	width: 860px;
	padding: 0.5rem;
	background: hsl(213deg 83.95% 94.68%);
	border: 2px solid var(--green);
	border-radius: 0.5rem;
	z-index: 10;
}
.it {
	width: 170px;
	height: 170px;
	border: 1px solid $secondary;
}
</style>

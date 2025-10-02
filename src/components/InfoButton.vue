<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'
// import { useRouter } from 'vue-router'
import { usePanels } from '@/stores/panels'
// import NodeProps from '@/components/panels/NodeProps.vue'
import CloseButton from '@/components/panels/CloseButton.vue'
import TopButton from '@/components/panels/TopButton.vue'
import { useSelectionStore } from '@/stores/selection'
import { storeToRefs } from 'pinia'

const selectionStore = useSelectionStore()
const { current } = storeToRefs(selectionStore)

// const router = useRouter()
const panels = usePanels()

gsap.registerPlugin(Flip)

const emit = defineEmits(['activate', 'stop'])

// const expanded = ref<boolean>(false)

const expand = () => {
	const state = Flip.getState('.button')
	emit('activate')
	nextTick(() => {
		Flip.from(state, {
			duration: 0.4,
			ease: 'power3.inOut',
			delay: 0.2,
		})
	})
}

const close = () => {
	emit('stop')
	const state = Flip.getState('.button')
	panels.setRight0(false)
	nextTick(() => {
		Flip.from(state, {
			duration: 0.4,
			ease: 'power3.inOut',
			delay: 0.2,
		})
	})
}

// const selectionActive = ref(false)
</script>

<template lang="pug">
.button(
	:class='{ expand: panels.right0 }'
	@click='expand'
	)

	q-icon.ic(v-if='!panels.right0'
		name="mdi-information-outline"
		color="primary"
		size='24px')

	CloseButton(v-model="panels.right0" @close="close")

	TopButton(v-model="panels.right0" @close='close')

	<div v-if="current">
		<div v-if="current.type === 'bpmn'" :element="current.element">bpmn</div>
		<div v-else-if="current.type === 'timeline'" :event="current.event" >time</div>
	</div>
	<div v-else>
		<em>Ничего не выбрано</em>
	</div>

	// NodeProps(v-if='panels.right0 && !!props.show'
	// 	v-motion
	// 	:initial='{ opacity: 0 }'
	// 	:enter='{ opacity: 1 }'
	// 	:delay='1000'
	// 	) 

</template>

<style scoped lang="scss">
.button {
	width: 48px;
	height: 48px;
	background: #fff;
	box-shadow: var(--shad0);
	border-radius: 24px;
	position: absolute;
	top: 0;
	right: -58px;
	text-align: center;
	cursor: pointer;
	.ic {
		margin-top: 11px;
	}

	&.expand {
		width: 350px;
		height: calc(100vh - 120px);
		right: -358px;
		border-radius: 6px;
		cursor: default;
	}
}
</style>

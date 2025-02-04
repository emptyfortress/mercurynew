<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'
import IconWizard from '@/components/icons/IconWizard.vue'
import AssistentInside from '@/components/AssistentInside.vue'
import { useRouter, } from 'vue-router'
import { useFlip } from '@/stores/flip'
import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'

const router = useRouter()
const flip = useFlip()
gsap.registerPlugin(Flip)

const navigate = (() => {
	router.push('ai')
})


onBeforeUnmount(() => {
	console.log('transition away from project');

	const elemToFlip = document.querySelector('[data-flip-id="rect"]');
	if (elemToFlip) {
		flip.setLastState(Flip.getState(elemToFlip))
	}
})

onMounted(() => {
	console.log('project page mounted');

	const elemToFlip = document.querySelector('[data-flip-id="rect"]');
	if (elemToFlip && flip.lastState) {
		Flip.from(flip.lastState, {
			targets: elemToFlip,
			duration: .3,
		})
	}

	flip.setLastState(null)
})

</script>

<template lang="pug">
q-page(padding)
	.rectangle(data-flip-id="rect"
		v-motion
		:initial="{ opacity: 1 }"
		:enter="{ opacity: 0 }"
		)
	.cont(
		v-motion
		:initial="{ opacity: 0, x: 100 }"
		:enter="{ opacity: 1, x: 0 }"
		:delay='400'
		)
		.row.justify-between.items-center
			.hd Первичные настройки
			.bt(@click='navigate')
				IconWizard.ic
				span ИИ-ассистент

		AssistentInside

</template>

<style scoped lang="scss">
.rectangle {
	width: 100%;
	height: calc(100vh - 50px);
	// background: blue;
	background: $secondary;
	position: fixed;
	top: 50px;
	left: 0;
}

.cont {
	max-width: 1000px;
	margin: 0 auto;
}

.hd {
	font-size: 1.3rem;
}

.bt {
	padding: .5rem;
	border-radius: var(--rad);
	text-align: center;
	display: inline-flex;
	justify-content: center;
	align-items: center;
	color: $primary;
	cursor: pointer;
	margin-left: auto;

	&:hover {
		background: $primary;
		color: white;
	}
}

.ic {
	font-size: 1.5rem;
}
</style>

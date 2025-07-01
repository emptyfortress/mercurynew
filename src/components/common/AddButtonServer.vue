<script setup lang="ts">
import { ref, nextTick, computed } from 'vue'
import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'
import AddServerList from '@/components/AddServerList.vue'
import { useServers } from '@/stores/servers'

gsap.registerPlugin(Flip)
const adding = ref(false)

const snapshot = ref([])
const server = useServers()

const add = () => {
	// trans.value = false
	snapshot.value = JSON.parse(JSON.stringify(server.servers))
	const state = Flip.getState('.button, .dialog')
	adding.value = !adding.value
	nextTick(() => {
		Flip.from(state, {
			duration: 0.4,
			ease: 'power3.inOut',
			targets: '.button, .dialog',
			absolute: true,
			fade: true,
		})
	})
}

const otmena = () => {
	server.setItems(JSON.parse(JSON.stringify(snapshot.value)))
	add()
}

const emit = defineEmits(['apply'])
const apply = () => {
	emit('apply')
	add()
}

const left = computed(() => {
	return window.innerWidth / 2 - 270 + 64 + 'px'
})
const top = computed(() => {
	return window.innerHeight / 2 - 280 + 'px'
})
</script>

<template lang="pug">
q-btn.button(
	unelevated round,
	color="primary",
	icon='mdi-plus',
	data-flip-id='fock'
	@click='add'
) 

Teleport(to='body')
	.backdrop(v-if='adding'
		data-flip-id='fock'
		v-motion
		:initial="{ opacity: 0 }"
		:enter='{ opacity: 1, transition: { delay: 400 } }'
		)

Teleport(to='body')
	.dialog(v-show='adding'
		data-flip-id='fock'
		)
		q-btn.close(round icon="mdi-close"
			v-if="adding"
			color='negative' @click="otmena"
		) 
		AddServerList(:adding='adding' @close="otmena" @apply="apply")
</template>

<style scoped lang="scss">
.dialog {
	width: 500px;
	background: #fff;
	position: fixed;
	left: v-bind(left);
	top: v-bind(top);
	border-radius: 0.5rem;
	box-shadow: var(--shad0);
	padding: 1rem;
	z-index: 20;
}

.backdrop {
	width: 100vw;
	height: 100vh;
	background-color: rgba(0, 0, 0, 0.2);
	backdrop-filter: blur(2px);
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	z-index: 19;
}
.close {
	z-index: 100;
	position: absolute;
	top: -1.2rem;
	right: -1.2rem;
}
</style>

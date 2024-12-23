<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { createBlendy } from 'blendy'
import type { Blendy } from 'blendy'
import Modal from '@/views/Modal.vue'

const blendy = ref<Blendy | null>(null)

onMounted(() => {
	blendy.value = createBlendy({
		animation: 'spring',
	})
})

const showModal = ref(false)

const toggle = (() => {
	showModal.value = !showModal.value
	blendy.value?.toggle('example')
})
const untoggle = (() => {
	blendy.value?.untoggle('example', () => {
		showModal.value = false
	})
})

</script>

<template lang="pug">
q-page(padding)
	h2 lakjdlk

	q-btn(round
		data-blendy-from='example'
		icon="mdi-close"
		color="primary"
		@click="toggle")

	Modal(v-if="showModal" @click="untoggle" data-blendy-to="example")
</template>

<style scoped lang="scss">
</style>

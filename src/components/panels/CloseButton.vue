<script setup lang="ts">
const modelValue = defineModel()

const emit = defineEmits(['close'])

const close = (() => {
	emit('close')
})
</script>

<template lang="pug">
q-btn.close(unelevated round v-if='modelValue' size="sm" color="secondary"
	v-motion
	:initial='{ opacity: 0, y: 20 }'
	:enter='{ opacity: 1, y: 0 }'
	:delay='1200'
	icon='mdi-close' @click.stop='close')
</template>

<style scoped lang="scss">
.close {
	position: absolute;
	top: 0.5rem;
	right: 0.5rem;
	z-index: 10;
}
</style>

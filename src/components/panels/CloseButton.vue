<script setup lang="ts">
const modelValue = defineModel()

const emit = defineEmits(['close'])

const close = (() => {
	emit('close')
})
</script>

<template lang="pug">
q-btn.close(flat round v-if='modelValue' size="sm" color="secondary"
	v-motion
	:initial='{ opacity: 0, y: 20 }'
	:enter='{ opacity: 1, y: 0 }'
	:delay='1200'
	icon='mdi-close-circle-outline' @click.stop='close')
</template>

<style scoped lang="scss">
.close {
	position: absolute;
	top: 0;
	right: 0;
	z-index: 10;
}
</style>

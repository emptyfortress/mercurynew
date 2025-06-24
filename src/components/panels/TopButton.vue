<script setup lang="ts">
const modelValue = defineModel()

const emit = defineEmits(['close'])

const close = () => {
	emit('close')
}
</script>

<template lang="pug">
.top(v-if='modelValue'
	@click.stop='close'
	v-motion
	:initial='{ opacity: 0 }'
	:enter='{ opacity: 1 }'
	:delay='600')
	.zg
		q-icon(name="mdi-tune-vertical-variant")
		| Свойства
</template>

<style scoped lang="scss">
.top {
	display: block;
	cursor: pointer;
}

.zg {
	font-size: 1.1rem;
	color: $primary;
}

.zg .q-icon {
	font-size: 1.3rem;
	margin-right: 0.5rem;
}
</style>

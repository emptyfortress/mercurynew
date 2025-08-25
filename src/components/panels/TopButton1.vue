<script setup lang="ts">
import TablerSearch from '@/components/icons/TablerSearch.vue'

const modelValue = defineModel()

const emit = defineEmits(['close'])
const close = () => {
	emit('close')
}
</script>

<template lang="pug">
.top(v-if='modelValue' @click.stop='close'
	v-motion
	:initial='{ opacity: 0 }'
	:enter='{ opacity: 1 }'
	:delay='600')
	.zg
		TablerSearch.ic()
		| Форма запроса
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

.ic {
	font-size: 1.5rem;
	color: $primary;
	margin-right: 0.5rem;
	margin-bottom: -4px;
}
</style>

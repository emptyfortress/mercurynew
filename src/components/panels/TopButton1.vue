<script setup lang="ts">
import IconSearch from '@/components/icons/IconSearch.vue'

const modelValue = defineModel()
</script>

<template lang="pug">
.top(v-if='modelValue'
	v-motion
	:initial='{ opacity: 0 }'
	:enter='{ opacity: 1 }'
	:delay='600')
	.zg
		IconSearch.ic()
		| Форма запроса
</template>

<style scoped lang="scss">
.top {
	display: block;
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

<script setup lang="ts">
const modelValue = defineModel()


</script>

<template lang="pug">
.top(v-if='modelValue'
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
}

.zg {
	font-size: 1.1rem;
	color: $primary;
}

.zg .q-icon {
	font-size: 1.3rem;
	margin-right: .5rem;
}
</style>

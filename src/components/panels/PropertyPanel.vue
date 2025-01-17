<script setup lang="ts">
import { useControl } from '@/stores/controls'

const control = useControl()
const modelValue = defineModel()
</script>

<template lang="pug">
.property(v-if='modelValue'
	v-motion
	:initial='{ opacity: 0 }'
	:enter='{ opacity: 1 }'
	:delay='600'
	)
	div {{ control.selectedControl }}
</template>

<style scoped lang="scss">
.property {
	padding: 1rem;
}
</style>

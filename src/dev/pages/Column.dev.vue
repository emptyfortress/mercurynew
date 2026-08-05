<script setup lang="ts">
// import { ref } from 'vue'
// import Component from '@/components/decision/GroupPanel.vue'
import Component from '@/components/condition/StartCondition.vue'
</script>

<template lang="pug">
q-page(padding)
	.cont
		div
			Component()
</template>

<style scoped lang="scss">
.cont {
	display: flex;
	> div {
		margin: auto;
		width: 1024px;
		justify-content: center;
		align-items: center;
	}
}
</style>

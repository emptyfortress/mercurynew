<script setup lang="ts">
import { ref } from 'vue'
import TokenSim from '@/components/TokenSim.vue'
import TimelineInside from '@/components/TimelineInside.vue'

const splitter = ref(20)
</script>

<template lang="pug">
q-splitter(v-model="splitter" horizontal)
	template(v-slot:before)
		TimelineInside
	template(v-slot:after)
		TokenSim
</template>

<style scoped lang="scss">
.q-splitter {
	width: 100%;
	background: #fff;
	height: calc(100vh - 120px);
	box-shadow: var(--shad0);
	border-radius: var(--rad);
}
</style>

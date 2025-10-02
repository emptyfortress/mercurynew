<script setup lang="ts">
import { ref } from 'vue'
import TokenSim from '@/components/TokenSim.vue'
import TimelineInside from '@/components/TimelineInside.vue'

const splitter = ref(25)

const selection = ref<string>('')
const selection1 = ref<string>('')

const select = (e: string) => {
	selection.value = e
}

const emit = defineEmits(['selectNode'])

const select1 = (e: any) => {
	selection1.value = e.id
	emit('selectNode', e)
}
</script>

<template lang="pug">
q-splitter(v-model="splitter" horizontal)
	template(v-slot:before)
		TimelineInside(@select="select" :selection='selection1')
	template(v-slot:after)
		TokenSim(:selection="selection" @select="select1")
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

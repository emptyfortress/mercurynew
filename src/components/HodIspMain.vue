<script setup lang="ts">
import { ref } from 'vue'
import TokenSim from '@/components/TokenSim.vue'
import TimelineInside from '@/components/TimelineInside.vue'

const splitter = ref(23)

const selection = ref<string>('')
const selection1 = ref<string>('')

const select = (e: string) => {
	selection.value = e
	emit('selectNode', e)
}

const emit = defineEmits(['selectNode'])

const select1 = (e: any) => {
	selection1.value = e.id
	emit('selectNode', e)
}
const timelineRef = ref<InstanceType<typeof TimelineInside> | null>(null)
</script>

<template lang="pug">
q-splitter(v-model="splitter" horizontal)
	template(v-slot:before)
		TimelineInside(ref='timelineRef')
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

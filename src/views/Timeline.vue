<script setup lang="ts">
import { useTitle } from '@vueuse/core'
import TokenSim from '@/components/TokenSim.vue'
import TimelineInside from '@/components/TimelineInside.vue'

const title = useTitle()
title.value = 'bpmn + timeline'
</script>

<template lang="pug">
q-page(padding)
	.h7.text-center Проверка спрягания timeline & bpmn
	br
	.grid
		TimelineInside
		TokenSim
</template>

<style scoped lang="scss">
.grid {
	display: grid;
	grid-template-rows: 1fr 1.5fr;
	height: calc(100vh - 150px);
	gap: 0.5rem;
	// background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAAXNSR0IArs4c6QAAADBJREFUGFclioEJADAMwvSl7f8P1pfMaAsiCcT1inOPQJIlkwy3uT8JbmImh2zANh9STBXvibRbIgAAAABJRU5ErkJggg==);
	// background: pink;
}
</style>

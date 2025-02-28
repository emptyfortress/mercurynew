<script setup lang="ts">
import { ref, computed } from 'vue'
import IconFaceMask from '@/components/icons/IconFaceMask.vue'
import { useDraggable } from '@vueuse/core'
import { useTemplateRef } from 'vue'
import DragEditWindow from '@/components/DragEditWindow.vue'

const el = useTemplateRef<HTMLElement>('el')

const text = computed(() => {
	return list.value.length ? 'Добавить условие к запросу' : 'Настроить'
})
const list = ref([])

const show = ref(false)
const toggle = (() => {
	show.value = !show.value
})
</script>

<template lang="pug">
div
	.empty(v-if='list.length == 0')
		IconFaceMask.big
		div Запрос не настроен.


	.text-center
		q-btn(unelevated color="primary" :label="text" @click="toggle" size="md") 
			q-icon(v-if='list.length' name="mdi-plus-circle-outline" color="primary")

	DragEditWindow(v-model="show")
</template>

<style scoped lang="scss">
.empty {
	text-align: center;
	margin: 1rem auto;
	color: $secondary;
}

.big {
	font-size: 3rem;
	color: $secondary;
}
</style>

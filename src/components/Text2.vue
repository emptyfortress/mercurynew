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
.empty(v-if='list.length == 0')
	IconFaceMask.big
	div Запрос не настроен.


.text-center
	q-btn(unelevated color="primary" icon="mdi-plus-circle-outline" :label="text" @click="toggle" size="md") 

DragEditWindow(v-model="show")
</template>

<style scoped lang="scss">
.empty {
	text-align: center;
	margin: 1rem auto;
	color: $secondary;
}

.big {
	font-size: 5rem;
	color: $secondary;
}
</style>

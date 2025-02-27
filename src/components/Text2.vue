<script setup lang="ts">
import { ref, computed } from 'vue'
import IconFaceMask from '@/components/icons/IconFaceMask.vue'

const text = computed(() => {
	return list.value.length ? 'Добавить условие к запросу' : 'Настроить'
})
const list = ref([])
</script>

<template lang="pug">
.empty(v-if='list.length == 0')
	IconFaceMask.big
	div Запрос не настроен.


.text-center
	q-btn(unelevated color="primary" icon="mdi-plus-circle-outline" :label="text" @click="" size="md") 
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

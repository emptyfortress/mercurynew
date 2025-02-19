<script setup lang="ts">
import { ref, watch, } from 'vue'
import { uid } from 'quasar'

const emit = defineEmits(['add'])

const mod = ref('')

watch(mod, (val) => {
	if (val) {
		emit('add', { id: uid(), text: val, dvalue: true, kind: 7 })
	}
})

const options = [
	'Создание заявки',
	'Согласование',
	'Доработка',
	'Завершение',
]
</script>

<template lang="pug">
q-select(v-model="mod" dense outlined :options="options" label='Выбрать')
</template>

<style scoped lang="scss">
.q-select {
	width: 180px;
}
</style>

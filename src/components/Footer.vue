<script setup lang="ts">
import { computed } from 'vue'
import { useStorage } from '@vueuse/core'
import { useRoute } from 'vue-router'
import { date } from 'quasar'

const route = useRoute()
const app = useStorage('app', localStorage)

const footerState = computed(() => {
	return route.meta.footer ? true : false
})

const localCreated = computed(() => {
	return date.formatDate(app.value.versions[0].created, 'DD.MM.YY HH:mm')
})
const localChanged = computed(() => {
	return date.formatDate(app.value.versions[0].modified, 'DD.MM.YY HH:mm')
})
</script>

<template lang="pug">
q-footer.footer(v-if='footerState')
	.cent
		div Версия: {{ app.versions[0].label }}
		div Автор: {{ app.versions[0].author }}
		div Создано: {{ localCreated }}
		div Изменено: {{ localChanged }} (Роза Львовна)
		div Статус: Черновик
		.saved
			q-icon.q-mr-sm(name="mdi-circle-slice-8" color="positive")
			|Сохранено
</template>

<style scoped lang="scss">
.footer {
	background: hsl(202 33% 92% / 1);
	box-shadow: 0 -1px 4px rgba($color: #000000, $alpha: 0.15);
	color: #444;
	padding: 3px 2rem;
	.cent {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 3rem;
		font-size: 0.8rem;
	}
}
.saved {
	position: relative;
}
</style>

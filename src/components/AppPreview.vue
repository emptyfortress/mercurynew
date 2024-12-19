<script setup lang="ts">
import { useApps } from '@/stores/apps'
import { useRouter } from 'vue-router'
import { useStorage } from '@vueuse/core'

const myapps = useApps()
const router = useRouter()

const props = defineProps<{
	item: App
}>()

const app = useStorage('app', localStorage)

const navigate = (e: App) => {
	console.log(e)
	e.expand = false
	myapps.setCurrentApp(e)
	router.push('/assistent')
}
const navigate1 = (e: any) => {
	myapps.setCurrentApp(e)
	app.value = { ...e }
	router.push('/process')
}

</script>

<template lang="pug">
div
	.contt(
		v-motion
		:initial="{ x: 100, opacity: 0 }"
		:enter="{ x: 0, opacity: 1, transition: { type: 'spring', stiffness: 500, damping: 30, delay: 300 } }")

		div() {{ props.item.id }}
		div() {{ props.item.descr }}
		div() Автор: {{ props.item.author }}
		div() Версия: {{ props.item.version }}

	q-card-actions(align="center"
		v-motion
		:initial="{ y: -20, opacity: 0 }"
		:enter="{ y: 0, opacity: 1, transition: { type: 'spring', stiffness: 500, damping: 30, delay: 550 } }")
		q-btn(unelevated color="primary" icon="mdi-tune-variant" label="Первичные настройки" @click.stop="navigate(item)") 
		q-btn(unelevated color="primary" icon="mdi-code-block-braces" label="К приложению" @click.stop="navigate1(item)") 
</template>

<style scoped lang="scss">
.contt {
	margin-top: 3rem;
}
</style>

<script setup lang="ts">
import { useApps } from '@/stores/apps'
import { useRouter } from 'vue-router'
import { useStorage } from '@vueuse/core'

const myapps = useApps()
const router = useRouter()

const props = defineProps<{
	item: any
}>()

const app = useStorage('app', localStorage)

const navigate = () => {
	app.value = props.item
	myapps.setCurrentApp(props.item)
	router.push('/assistent')
}
const navigate1 = () => {
	// props.item.expand = false
	myapps.setCurrentApp(props.item)
	app.value = props.item
	router.push('/process')
}

</script>

<template lang="pug">
div

	div() {{ props.item.id }}
	div() {{ props.item.descr }}
	div() Автор: {{ props.item.author }}
	div() Версия: {{ props.item.version }}

	.myrow
		.bt(@click='navigate') Выполнить первичные настройки
		.bt(@click='navigate1') Перейти к приложению

</template>

<style scoped lang="scss">
.myrow {
	display: flex;
	justify-content: center;
	align-items: center;
	gap: .5rem;
	margin-top: 2rem;
}

.bt {
	width: 200px;
	height: 100px;
	border: 1px solid $secondary;
	// background: $secondary;
	border-radius: var(--rad);
	text-align: center;
	display: flex;
	justify-content: center;
	align-items: center;
	color: $secondary;
	font-weight: 600;

	&:hover {
		background: $secondary;
		color: white;
	}
}
</style>

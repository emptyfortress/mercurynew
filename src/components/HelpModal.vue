<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import HealthiconsGuideDogfrom from '@/components/icons/HealthiconsGuideDog.vue'

type HelpTopic = {
	label: string
	url: string
}

const props = defineProps<{
	menuLabel: string
}>()

const emit = defineEmits<{
	ok: [menuLabel: string]
	cancel: [menuLabel: string]
}>()

const visible = defineModel<boolean>()

const route = useRoute()
const routePath = computed(() => route.path)
const routePattern = computed(() => route.matched[0]?.path || route.path)

const helpTopics: readonly HelpTopic[] = [
	{ label: 'Введение в приложение', url: '#введение-в-приложении' },
	{ label: 'Построение bpmn-диаграммы', url: '#bpmn' },
	{ label: 'Настройка ролей', url: '#роли' },
	{ label: 'Работа с формами', url: '#формы' },
	{ label: 'Управление списками', url: '#списки' },
	{ label: 'Просмотр изменений', url: '#изменения' },
	{ label: 'Экспорт данных', url: '#экспорт' },
	{ label: 'Импорт шаблонов', url: '#импорт' },
	{ label: 'Настройки пользователя', url: '#настройки' },
	{ label: 'Помощь по API', url: '#api' },
	{ label: 'Обратная связь', url: '#обратная-связь' },
]

const guidedRoutes: readonly string[] = ['/process', '/form', '/request1/:id', '/:id?']

const showGuide = computed(() => {
	if (routePattern.value === '/:id?') {
		return routePath.value !== '/'
	}
	return guidedRoutes.includes(routePattern.value)
})

const emitOk = () => {
	emit('ok', props.menuLabel)
	visible.value = false
}

const emitCancel = () => {
	emit('cancel', props.menuLabel)
	visible.value = false
}
</script>

<template lang="pug">
q-dialog(v-model="visible" backdrop-filter="blur(4px) saturate(150%)")
	q-card
		q-btn.close(icon="mdi-close" color="negative" round dense v-close-popup)
		q-card-section.row.items-center.q-pb-none
			.text-h6(v-if="menuLabel === 'Помощь'")
				q-icon.q-mr-sm(name="mdi-book" color="primary" size='md')
				|Общая помощь
			.text-h6(v-else)
				HealthiconsGuideDogfrom.ic
				|Интерактивный гид

		q-card-section(v-if="menuLabel === 'Помощь'")
			ol
				li(v-for="topic in helpTopics" :key="topic.url")
					a(:href="topic.url") {{ topic.label }}
		q-card-section(v-else)
			div(v-if="showGuide")
				|Гид по интерфейсу страницы
				span {{ route.name }}
			div(v-else) Гид для этой страницы находится в процессе разработки.
		q-card-section
			div Current route path: {{ routePath }}
		q-card-actions(align="right")
			q-btn(flat label="Cancel" color="primary" @click="emitCancel")
			q-btn(unelevated label="OK" color="primary" @click="emitOk")
</template>

<style lang="scss" scoped>
.q-card {
	min-width: 400px;
}

ol {
	padding-left: 2rem;
	margin: 1rem 0;
}

ol li {
	margin-bottom: 0.75rem;
	line-height: 1.4;
}

ol a {
	color: $primary;
	text-decoration: none;
}

ol a:hover {
	text-decoration: underline;
}
.ic {
	font-size: 3.4rem;
	color: $primary;
	margin-bottom: -12px;
}
</style>

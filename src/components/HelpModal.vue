<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import HealthiconsGuideDogfrom from '@/components/icons/HealthiconsGuideDog.vue'
import Fa7SolidDigging from '@/components/icons/Fa7SolidDigging.vue'

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

// const guidedRoutes: readonly string[] = ['/process', '/form', '/request1/:id', '/:id?']
const guidedRoutes: readonly string[] = ['/process']

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
				|Документация
			.text-h6(v-else)
				HealthiconsGuideDogfrom.ic(v-if='showGuide')
				Fa7SolidDigging.ic1(v-else)
				|Интерактивный гид

		q-card-section(v-if="menuLabel === 'Помощь'")
			ol
				li(v-for="topic in helpTopics" :key="topic.url")
					a(:href="topic.url") {{ topic.label }}
		q-card-section(v-else)
			div(v-if="showGuide")
				|Запустить гид по интерфейсу страницы?
				|<br />Вы можете прерваться в любой момент.
			div(v-else) Гид для этой страницы находится в процессе разработки.
		q-card-actions(align="right")
			q-btn(flat label="Закрыть" color="primary" @click="emitCancel")
			q-btn(v-if='showGuide' unelevated label="Старт" color="primary" @click="emitOk")
</template>

<style lang="scss" scoped>
.q-card {
	min-width: 300px;
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
.ic1 {
	font-size: 2rem;
	color: $primary;
	// margin-bottom: -8px;
	margin-right: 1rem;
}
</style>

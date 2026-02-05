<template lang="pug">
q-breadcrumbs.text-grey-7.q-pa-sm(separator-color="primary")
	//- Иконка разделителя
	template(v-slot:separator)
		q-icon(size="1.2em" name="mdi-chevron-right")

	//- Главная (Apps Home)
	q-breadcrumbs-el(icon="mdi-home" to="/")

	//- Динамические крошки
	q-breadcrumbs-el(
		v-for="(crumb, index) in breadcrumbs"
		:key="index"
		:label="crumb.label"
		:to="crumb.path"
	)
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// Словарь для статичных сегментов
const staticLabels: Record<string, { label: string; icon: string }> = {
	dvmain: { label: 'DV-main', icon: 'mdi-database' },
	razmet: { label: 'Разметка', icon: 'mdi-layers-outline' },
}

const breadcrumbs = computed(() => {
	// Получаем массив сегментов (фильтруем пустые и динамический :id главной страницы)
	const segments = route.path.split('/').filter((s) => s && s !== route.params.id)

	return segments.map((segment, index) => {
		const path = '/' + segments.slice(0, index + 1).join('/')
		let label = ''

		// 1. Проверяем статичные названия (dvmain, razmet)
		if (staticLabels[segment]) {
			label = staticLabels[segment].label
		}
		// 2. Если это ID конструктора (второй сегмент в пути /dvmain/ID)
		else if (index === 1) {
			label = `Конструктор ${segment}`
		}
		// 3. Если это ID вида (третий сегмент в пути /dvmain/ID/VIEW_ID)
		else if (index === 2) {
			label = `Вид ${segment}`
		}
		// 4. Фолбэк для всего остального
		else {
			label = segment
		}

		return { label, path }
	})
})
</script>

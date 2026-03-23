<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useMatrixStore } from '@/stores/matrix'

const route = useRoute()
const matrixStore = useMatrixStore()

const breadcrumbs = computed(() => {
	// Получаем массив сегментов (фильтруем пустые и динамический :id главной страницы)
	const segments = route.path.split('/').filter((s) => s && s !== route.params.id)

	return segments.map((segment, index) => {
		const path = '/' + segments.slice(0, index + 1).join('/')

		const label =
			segment === 'dvmain' || segment === 'cards'
				? segment === 'dvmain'
					? 'DV-main'
					: 'Конструктор карточек'
				: segment === '102' && index === 1
					? 'Конструктор ролей'
					: matrixStore.roles.find((role) => role.id === segment)?.label ||
						matrixStore.getNameById(segment)

		return { label, path }
	})
})
</script>

<template lang="pug">
q-breadcrumbs.sdvig(separator-color="primary")

	q-breadcrumbs-el(
		v-for="(crumb, index) in breadcrumbs"
		:key="index"
		:label="crumb.label"
		:to="crumb.path"
	)
</template>

<style scoped lang="scss">
.sdvig {
	margin-left: 3rem;
}
</style>

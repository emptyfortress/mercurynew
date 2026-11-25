<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useBreadcrumbLabel } from '@/composable/useBreadcrumbLabel'
import { useProjectsStore } from '@/components/projects'

const route = useRoute()
const { resolveLabel } = useBreadcrumbLabel()
const projectsStore = useProjectsStore()

const breadcrumbs = computed(() => {
	const breadcrumbPath = route.name === 'decisions.variant' ? '/dvmain' : route.path
	const segments = breadcrumbPath.split('/').filter(Boolean)
	const workflowLabels: Record<string, string> = {
		processHome: 'Процессы',
		processConstructor: 'Конструктор шаблонов',
		processMonitor: 'Мониторинг процессов',
		processMonitorSingle: 'Монитор экземпляра',
	}
	const workflowLabel = workflowLabels[String(route.name)]
	const projectId = String(route.params.projectId ?? '')
	const project = projectsStore.projects.find((item) => item.id === projectId)
	const projectLabel = route.name === 'projects' && projectId
		? projectsStore.drafts[projectId]?.name || project?.name || 'Проект не найден'
		: ''

	return segments
		.map((segment, index) => ({ segment, index, path: '/' + segments.slice(0, index + 1).join('/') }))
		.map(({ segment, index, path }) => ({
			label:
				projectLabel && index === segments.length - 1
					? projectLabel
					: workflowLabel && segment === 'process'
						? 'Процессы'
						: index === segments.length - 1 && workflowLabel
							? workflowLabel
							: resolveLabel(segment),
			path,
		}))
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

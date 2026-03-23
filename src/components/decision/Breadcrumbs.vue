<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useBreadcrumbLabel } from '@/composable/useBreadcrumbLabel'

const route = useRoute()
const { resolveLabel } = useBreadcrumbLabel()

const breadcrumbs = computed(() => {
	const segments = route.path.split('/').filter(Boolean)

	return segments.map((segment, index) => ({
		label: resolveLabel(segment),
		path: '/' + segments.slice(0, index + 1).join('/'),
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

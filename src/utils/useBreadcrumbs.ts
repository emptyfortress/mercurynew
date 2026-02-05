import { computed } from 'vue'
import { useRoute } from 'vue-router'

export function useBreadcrumbs() {
	const route = useRoute()

	const breadcrumbs = computed(() =>
		route.matched
			.filter((r) => r.meta?.breadcrumb)
			.map((routeRecord) => {
				const breadcrumb = routeRecord.meta.breadcrumb

				return {
					label: typeof breadcrumb === 'function' ? breadcrumb(route) : breadcrumb,
					to: {
						name: routeRecord.name,
						params: route.params,
					},
				}
			})
	)

	return { breadcrumbs }
}

import { useMatrixStore } from '@/stores/matrix'
import { useSimpleStore } from '@/stores/simpleStore'
import { BREADCRUMB_OVERRIDES } from '@/constants/breadcrumbs'

export function useBreadcrumbLabel() {
	const matrixStore = useMatrixStore()
	const simpleStore = useSimpleStore()

	function resolveLabel(segment: string): string {
		// 1. Сначала проверяем хардкод
		if (BREADCRUMB_OVERRIDES[segment]) {
			return BREADCRUMB_OVERRIDES[segment]
		}

		// 2. Затем simpleStore (viewId — дерево типов документов)
		const treeNode = simpleStore.getNodeById(segment)
		if (treeNode) {
			return treeNode.text
		}

		// 3. Затем matrixStore (razmet, roleId)
		const matrixLabel = matrixStore.getNameById(segment)
		if (matrixLabel !== segment) {
			return matrixLabel
		}

		// 4. Fallback — возвращаем сам сегмент
		return segment
	}

	return { resolveLabel }
}

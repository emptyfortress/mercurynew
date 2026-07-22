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

		// 2. Затем simpleStore: сначала treeData, затем folderData
		// treeData — плоский массив (flatNodes), а не корневой массив, поэтому ищем в нём
		const treeNode = simpleStore.flatNodes.find((n) => n.id === segment)
		if (treeNode) {
			return treeNode.text
		}

		// folderData — вложенная структура, ищем рекурсивно
		const folderNode = simpleStore.folderData[0]
			? findInTree(simpleStore.folderData, segment)
			: undefined
		if (folderNode) {
			return folderNode.text
		}

		const viewNode = simpleStore.viewData[0] ? findInTree(simpleStore.viewData, segment) : undefined
		if (viewNode) {
			return viewNode.text
		}

		const approveNode = simpleStore.approveData[0]
			? findInTree(simpleStore.approveData, segment)
			: undefined
		if (approveNode) {
			return approveNode.text
		}
		//
		// 3. Затем matrixStore (razmet, roleId)
		const matrixLabel = matrixStore.getNameById(segment)
		if (matrixLabel !== segment) {
			return matrixLabel
		}

		// 4. Fallback — возвращаем сам сегмент
		return segment
	}

	function findInTree(nodes: any[], id: string): any | undefined {
		for (const node of nodes) {
			if (node.id === id) return node
			if (node.children?.length) {
				const found = findInTree(node.children, id)
				if (found) return found
			}
		}
		return undefined
	}

	return { resolveLabel }
}

function getNodeFromTree(node: any, nodeId: any): any | null {
	if (node.id == nodeId) {
		return node
	} else if (node.children != null) {
		var result = null
		for (let i = 0; result == null && i < node.children.length; i++) {
			result = getNodeFromTree(node.children[i], nodeId)
		}
		return result
	}
	return null
}

export { getNodeFromTree }

const svgModules = import.meta.glob('@/assets/img/avatar/*.svg', {
	eager: true,
	import: 'default',
}) as Record<string, string>

export const allAvatars = Object.entries(svgModules).map(([path, url], index) => {
	const name = path.split('/').pop()?.replace('.svg', '') || `avatar${index}`
	return { id: index, name, pic: url }
})

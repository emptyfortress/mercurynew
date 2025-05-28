const iconModules = import.meta.glob('@/assets/img/avatar/*.png', {
	eager: true,
	import: 'default',
}) as Record<string, string>

export const allIcons = Object.entries(iconModules).map(([path, pic], index) => {
	const name = path.split('/').pop()?.replace('.png', '') || `icon${index}`
	return { id: index, name, pic }
})

import { markRaw } from 'vue'

// Импортируем все .vue-файлы из директории
const modules = import.meta.glob('@/components/icons/list/*.vue', {
	eager: true, // загружаем сразу, не async
	import: 'default',
})

let idCounter = 0

export const allIcons = Object.values(modules).map((component: any) => ({
	id: idCounter++,
	selected: false,
	pic: markRaw(component),
	name: component.name || `icon-${idCounter}`,
}))

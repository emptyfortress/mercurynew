import type { RouteRecordRaw } from 'vue-router'
import MyComponentDev from './pages/Column.dev.vue'

const devRoutes: RouteRecordRaw[] = [
	{
		path: '/dev/test',
		name: 'Column',
		component: MyComponentDev,
	},
]

export default devRoutes

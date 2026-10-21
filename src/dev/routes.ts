import type { RouteRecordRaw } from 'vue-router'
import Test from './pages/Test.vue'

const devRoutes: RouteRecordRaw[] = [
	{
		path: '/dev/test',
		name: 'devTest',
		component: Test,
	},
]

export default devRoutes

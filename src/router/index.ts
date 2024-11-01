import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'home',
			component: HomeView,
			// children: [
			// 	{
			// 		path: '',
			// 		name: 'emp',
			// 		component: () => import('@/components/Empt.vue'),
			// 	},
			// 	{
			// 		path: ':id',
			// 		name: 'start',
			// 		component: () => import('@/components/Start.vue'),
			// 		props: true,
			// 	},
			// ],
		},

		{
			path: '/assistent',
			name: 'assistent',
			component: () => import('@/views/Assistent.vue')
		},
		{
			path: '/test',
			name: 'test',
			component: () => import('@/views/TestPage.vue')
		},
		{
			path: '/project',
			name: 'project',
			component: () => import('@/views/Project.vue')
		}
	]
})

export default router

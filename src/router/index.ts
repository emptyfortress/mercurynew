import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'home',
			component: HomeView,
		},
		{
			path: '/assistent',
			name: 'assistent',
			component: () => import('@/views/Assistent.vue'),
		},
		{
			path: '/process',
			name: 'process',
			component: () => import('@/views/Process.vue'),
		},
		// {
		// 	path: '/test',
		// 	name: 'test',
		// 	component: () => import('@/views/TestPage.vue'),
		// },
		// {
		// 	path: '/test1',
		// 	name: 'test1',
		// 	component: () => import('@/views/TestPage1.vue'),
		// },
		{
			path: '/project',
			name: 'project',
			component: () => import('@/views/Project.vue'),
		},
	],
})

export default router

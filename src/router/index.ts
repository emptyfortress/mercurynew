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
		{
			path: '/form',
			name: 'form',
			component: () => import('@/views/Form.vue'),
		},
		{
			path: '/forms',
			name: 'forms',
			component: () => import('@/views/Forms.vue'),
		},
		{
			path: '/statuses',
			name: 'statuses',
			component: () => import('@/views/Statuses.vue'),
		},
		{
			path: '/roles',
			name: 'roles',
			component: () => import('@/views/Roles.vue'),
		},
		{
			path: '/lists',
			name: 'lists',
			component: () => import('@/views/Lists.vue'),
		},
		{
			path: '/project',
			name: 'project',
			component: () => import('@/views/Project.vue'),
		},
	],
})

export default router

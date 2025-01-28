import { createRouter, createWebHistory } from 'vue-router'
import Tmp1 from '../views/Tmp1.vue'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'home',
			component: Tmp1,
		},
		{
			path: '/assistent',
			name: 'assistent',
			component: () => import('@/views/Assistent.vue'),
		},
		{
			path: '/ai',
			name: 'ai',
			component: () => import('@/views/Ai.vue'),
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
		{
			path: '/bugs',
			name: 'bugs',
			component: () => import('@/views/Bugs.vue'),
		},
		{
			path: '/tmp',
			name: 'tmp',
			component: () => import('@/views/Tmp.vue'),
		},
		{
			path: '/tmp1',
			name: 'tmp1',
			component: () => import('@/views/Tmp1.vue'),
		},
		{
			path: '/tmp2',
			name: 'tmp2',
			component: () => import('@/views/Tmp2.vue'),
		}
	],
})

export default router

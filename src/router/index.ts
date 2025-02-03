import { createRouter, createWebHistory } from 'vue-router'
import Tmp1 from '../views/Tmp1.vue'

declare module 'vue-router' {
	interface RouteMeta {
		toolbar: boolean,
		back: boolean,
		count: number
	}
}



const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'home',
			component: Tmp1,
			meta: {
				toolbar: false,
				back: false,
				count: 0
			},
		},
		{
			path: '/assistent',
			name: 'assistent',
			component: () => import('@/views/Assistent.vue'),
			meta: {
				toolbar: false,
				back: true,
				count: 10
			},
		},
		{
			path: '/ai',
			name: 'ai',
			component: () => import('@/views/Ai.vue'),
			meta: {
				toolbar: false,
				back: true,
				count: 20
			},
		},
		{
			path: '/process',
			name: 'process',
			component: () => import('@/views/Process.vue'),
			meta: {
				toolbar: true,
				back: false,
				count: 1,
			},
		},
		{
			path: '/form',
			name: 'form',
			component: () => import('@/views/Form.vue'),
			meta: {
				toolbar: true,
				back: true,
				count: 20,
			},
		},
		{
			path: '/forms',
			name: 'forms',
			component: () => import('@/views/Forms.vue'),
			meta: {
				toolbar: true,
				back: false,
				count: 2,
			},
		},
		{
			path: '/roles',
			name: 'roles',
			component: () => import('@/views/Roles.vue'),
			meta: {
				toolbar: true,
				back: false,
				count: 3,
			},
		},
		{
			path: '/statuses',
			name: 'statuses',
			component: () => import('@/views/Statuses.vue'),
			meta: {
				toolbar: true,
				back: false,
				count: 4,
			},
		},
		{
			path: '/lists',
			name: 'lists',
			component: () => import('@/views/Lists.vue'),
			meta: {
				toolbar: true,
				back: false,
				count: 5,
			},
		},
		{
			path: '/bugs',
			name: 'bugs',
			component: () => import('@/views/Bugs.vue'),
			meta: {
				toolbar: true,
				back: false,
				count: 0,
			},
		},
		{
			path: '/try',
			name: 'try',
			component: () => import('@/views/Try.vue'),
			meta: {
				toolbar: true,
				back: true,
				count: 10,
			},
		},
		{
			path: '/try1',
			name: 'try1',
			component: () => import('@/views/Try1.vue'),
			meta: {
				toolbar: true,
				back: true,
				count: 10,
			},
		},
	],
})


export default router

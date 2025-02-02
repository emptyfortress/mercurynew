import { createRouter, createWebHistory } from 'vue-router'
import Tmp1 from '../views/Tmp1.vue'

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
				enterClass: 'animate__animated animate__fadeInLeft',
				leaveClass: 'animate__animated animate__fadeOutRight',
			},
		},
		{
			path: '/assistent',
			name: 'assistent',
			component: () => import('@/views/Assistent.vue'),
			meta: {
				toolbar: false,
				back: true,
			},
		},
		{
			path: '/ai',
			name: 'ai',
			component: () => import('@/views/Ai.vue'),
			meta: {
				toolbar: false,
				back: true,
			},
		},
		{
			path: '/process',
			name: 'process',
			component: () => import('@/views/Process.vue'),
			meta: {
				toolbar: true,
				back: false,
				enterClass: 'animate__animated animate__fadeInLeft',
				leaveClass: 'animate__animated animate__fadeOutRight',
			},
		},
		{
			path: '/form',
			name: 'form',
			component: () => import('@/views/Form.vue'),
			meta: {
				toolbar: true,
				back: true,
			},
		},
		{
			path: '/forms',
			name: 'forms',
			component: () => import('@/views/Forms.vue'),
			meta: {
				toolbar: true,
				back: false,
				enterClass: 'animate__animated animate__fadeInLeft',
				leaveClass: 'animate__animated animate__fadeOutRight',
			},
		},
		{
			path: '/statuses',
			name: 'statuses',
			component: () => import('@/views/Statuses.vue'),
			meta: {
				toolbar: true,
				back: false,
			},
		},
		{
			path: '/roles',
			name: 'roles',
			component: () => import('@/views/Roles.vue'),
			meta: {
				toolbar: true,
				back: false,
			},
		},
		{
			path: '/lists',
			name: 'lists',
			component: () => import('@/views/Lists.vue'),
			meta: {
				toolbar: true,
				back: false,
			},
		},
		{
			path: '/project',
			name: 'project',
			component: () => import('@/views/Project.vue'),
			meta: {
				toolbar: true,
				back: false,
			},
		},
		{
			path: '/bugs',
			name: 'bugs',
			component: () => import('@/views/Bugs.vue'),
			meta: {
				toolbar: true,
				back: false,
			},
		},
		{
			path: '/try',
			name: 'try',
			component: () => import('@/views/Try.vue'),
			meta: {
				toolbar: true,
				back: true,
			},
		},
		{
			path: '/try1',
			name: 'try1',
			component: () => import('@/views/Try1.vue'),
			meta: {
				toolbar: true,
				back: true,
			},
		},
	],
})

export default router

import { createRouter, createWebHistory } from 'vue-router'
import Group1 from '@/views/Group1.vue'
import Home from '@/views/Home.vue'

declare module 'vue-router' {
	interface RouteMeta {
		toolbar: boolean
		back: boolean
		back1?: boolean
		count: number
	}
}

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/:id?',
			name: 'home',
			component: Home,
			meta: {
				toolbar: false,
				back: false,
				count: 0,
			},
		},
		{
			path: '/tmp1',
			name: 'tmp1',
			component: () => import('@/views/Tmp1.vue'),
			meta: {
				toolbar: false,
				back: false,
				count: 0,
			},
		},
		{
			path: '/spot',
			name: 'spot',
			component: () => import('@/views/Spotlight.vue'),
			meta: {
				toolbar: true,
				back: false,
				count: 0,
			},
		},
		{
			path: '/icons',
			name: 'icons',
			component: () => import('@/views/Icons.vue'),
			meta: {
				toolbar: true,
				back: false,
				count: 0,
			},
		},

		{
			path: '/assistent',
			name: 'assistent',
			component: () => import('@/views/Assistent.vue'),
			meta: {
				toolbar: false,
				back: false,
				back1: true,
				count: 1,
			},
		},
		{
			path: '/version/:id?',
			name: 'version',
			component: () => import('@/views/VersionHistory.vue'),
			meta: {
				toolbar: false,
				back: true,
				count: 19,
			},
		},
		{
			path: '/access',
			name: 'access',
			component: () => import('@/views/Access.vue'),
			meta: {
				toolbar: false,
				back: true,
				count: 19,
			},
		},
		{
			path: '/ai',
			name: 'ai',
			component: () => import('@/views/Ai.vue'),
			meta: {
				toolbar: false,
				back: true,
				count: 20,
			},
		},
		{
			path: '/process',
			name: 'process',
			component: () => import('@/views/Process.vue'),
			meta: {
				toolbar: true,
				back: true,
				count: 2,
				footer: true,
			},
		},
		{
			path: '/form',
			name: 'form',
			component: () => import('@/views/Form.vue'),
			meta: {
				toolbar: false,
				back: false,
				back1: true,
				count: 21,
				footer: true,
			},
		},
		{
			// path: '/forms',
			path: '/forms/:id?',
			name: 'forms',
			component: () => import('@/views/FormsNew.vue'),
			meta: {
				toolbar: true,
				back: true,
				count: 3,
				footer: true,
			},
		},
		{
			path: '/roles/:id?',
			name: 'roles',
			component: () => import('@/views/Roles.vue'),
			meta: {
				toolbar: true,
				back: true,
				count: 4,
				footer: true,
			},
		},
		{
			path: '/fields',
			name: 'fields',
			component: () => import('@/views/Fields.vue'),
			meta: {
				toolbar: true,
				back: true,
				count: 5,
				footer: true,
			},
		},
		{
			path: '/statuses',
			name: 'statuses',
			component: () => import('@/views/Statuses.vue'),
			meta: {
				toolbar: true,
				back: true,
				count: 21,
				footer: true,
			},
		},
		{
			path: '/lists/:id?',
			name: 'lists',
			component: () => import('@/views/ListsNew.vue'),
			meta: {
				toolbar: true,
				back: true,
				count: 6,
				footer: true,
			},
		},
		{
			path: '/request/:id',
			name: 'request',
			component: () => import('@/views/Request.vue'),
			props: true,
			meta: {
				toolbar: true,
				back: true,
				count: 25,
				footer: true,
			},
		},
		{
			path: '/request1/:id',
			name: 'request1',
			component: () => import('@/views/Request1.vue'),
			props: true,
			meta: {
				toolbar: true,
				back: true,
				count: 25,
				footer: true,
			},
		},
		{
			path: '/views/:id',
			name: 'views',
			component: () => import('@/views/Views.vue'),
			props: true,
			meta: {
				toolbar: true,
				back: true,
				count: 25,
				footer: true,
			},
		},
		{
			path: '/bugs',
			name: 'bugs',
			component: () => import('@/views/Bugs.vue'),
			meta: {
				toolbar: true,
				back: false,
				count: 10,
			},
		},
		{
			path: '/vars',
			name: 'vars',
			component: () => import('@/views/Comps.vue'),
			meta: {
				toolbar: true,
				back: false,
				count: 30,
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
		{
			path: '/folder/:id/:item?',
			name: 'folder',
			component: Group1,
			props: (route) => ({
				id: route.params.id,
				item: route.params.item,
			}),

			meta: {
				toolbar: false,
				back: true,
				count: 0,
			},
		},
		{
			path: '/setup',
			name: 'allsetup',
			component: () => import('@/views/Allsetup.vue'),
			meta: {
				toolbar: false,
				back: true,
				count: 10,
			},
		},
	],
})

export default router

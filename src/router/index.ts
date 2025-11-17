import { createRouter, createWebHistory } from 'vue-router'
import { defineComponent, h } from 'vue'
import Group1 from '@/views/Group1.vue'
import Home from '@/views/Home.vue'
import HomeReduced1 from '@/views/HomeReduced1.vue'
import AppLayout from '@/views/AppLayout.vue'
import AppDetails from '@/components/AppDetails.vue'
import { useReducedMotion } from '@/composable/useReducedMotion'

declare module 'vue-router' {
	interface RouteMeta {
		toolbar: boolean
		back: boolean
		back1?: boolean
		count: number
		save?: boolean
		hideScroll?: boolean
	}
}

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/:id?',
			name: 'home',
			component: defineComponent({
				setup() {
					const { reducedMotion } = useReducedMotion()
					return () => h(reducedMotion.value ? HomeReduced1 : Home)
				},
			}),
			meta: {
				toolbar: false,
				back: false,
				count: 0,
				save: false,
			},
		},
		{
			path: '/reduce',
			name: 'home',
			component: HomeReduced1,
			meta: {
				toolbar: false,
				back: false,
				count: 3,
				save: false,
			},
		},
		{
			path: '/reduce/:id',
			component: AppLayout,
			props: true,
			children: [
				{
					path: '',
					name: 'AppDetails',
					component: AppDetails,
					props: true,
					meta: {
						toolbar: false,
						back: false,
						count: 4,
						save: false,
					},
				},
			],
			meta: {
				toolbar: false,
				back: false,
				count: 0,
				save: false,
			},
		},
		{
			path: '/timeline',
			name: 'timeline',
			component: () => import('@/views/Timeline.vue'),
			meta: {
				toolbar: false,
				back: false,
				count: 0,
				save: false,
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
				save: false,
			},
		},
		{
			path: '/iconList',
			name: 'iconList',
			component: () => import('@/views/IconList.vue'),
			meta: {
				toolbar: false,
				back: false,
				count: 0,
				save: false,
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
				save: false,
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
				save: false,
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
				save: false,
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
				save: true,
				hideScroll: true,
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
				save: true,
				hideScroll: true,
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
				footer: false,
				save: false,
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
				footer: false,
				save: false,
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
				save: false,
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
				save: false,
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
				footer: false,
				save: false,
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
				save: true,
				hideScroll: true,
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
				save: false,
			},
		},
		{
			path: '/vars',
			name: 'vars',
			component: () => import('@/views/Comps.vue'),
			meta: {
				toolbar: false,
				back: false,
				count: 30,
				save: false,
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
				save: false,
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
				save: false,
			},
		},
		{
			path: '/settings',
			component: () => import('@/views/Settings.vue'),
			meta: {
				toolbar: false,
				back: false,
				count: 10,
				save: false,
			},
			children: [
				{
					path: '', // <- пустой путь = дефолтный дочерний
					name: 'settings',
					component: () => import('@/components/SettingsRoot.vue'), // твой корневой контент
					props: true,
				},
				{
					path: 'users/:id',
					component: () => import('@/components/UserSettingDetails.vue'),
					props: (route) => ({ id: route.params.id, type: 'users' }),
				},
				{
					path: 'apps/:id',
					component: () => import('@/components/AppSettingDetails.vue'),
					props: (route) => ({ id: route.params.id, type: 'app' }),
				},
				{
					path: 'db/:id',
					component: () => import('@/components/DbSettingDetails.vue'),
					props: (route) => ({ id: route.params.id, type: 'db' }),
				},
			],
		},
		{
			path: '/map',
			name: 'map',
			component: () => import('@/views/Map.vue'),
			props: true,
			meta: {
				toolbar: false,
				back: false,
				back1: true,
				count: 29,
				save: false,
			},
		},
		{
			path: '/publications',
			component: () => import('@/views/Publications.vue'),
			meta: {
				toolbar: false,
				back: false,
				count: 10,
				save: false,
			},
			children: [
				{
					path: '', // <- пустой путь = дефолтный дочерний
					name: 'publications',
					component: () => import('@/components/PublRoot.vue'), // твой корневой контент
					props: true,
				},
				{
					path: 'users/:id',
					component: () => import('@/components/UserPublDetails.vue'),
					props: (route) => ({ id: route.params.id, type: 'users' }),
				},
				{
					path: 'apps/:id',
					component: () => import('@/components/AppPublDetails.vue'),
					props: (route) => ({ id: route.params.id, type: 'app' }),
				},
				{
					path: 'db/:id',
					component: () => import('@/components/DbPublDetails.vue'),
					props: (route) => ({ id: route.params.id, type: 'db' }),
				},
			],
		},
	],
})

export default router

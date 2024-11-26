/// <reference types="vite/client" />

declare module '*.vue' {
	import type { DefineComponent } from 'vue'
	const component: DefineComponent<{}, {}, any>
	export default component
}

// declare module "vue-dndrop"
declare module 'vue3-smooth-dnd'
declare module 'vue-draggable-resizable'

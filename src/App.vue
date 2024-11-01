<script setup lang="ts">
import { ref } from 'vue'
import { RouterView } from 'vue-router'

const leftDrawer = ref(false)
const toggleLeftDrawer = (() => {
	leftDrawer.value = !leftDrawer.value
})
const rightDrawer = ref(false)
const toggleRightDrawer = (() => {
	rightDrawer.value = !rightDrawer.value
})

</script>

<template lang="pug">
q-layout(view='hHh LpR fFf')
	q-header.bg-primary.text-white(elevated)
		q-toolbar
			q-btn(dense flat round icon='mdi-menu' @click='toggleLeftDrawer')
			q-space
			// q-toolbar-title
				q-avatar
					img(src='https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg')
				| Title
			q-btn(dense flat round icon='menu' @click='toggleRightDrawer')

	q-drawer(v-model='leftDrawer' side='left' overlay bordered behavior="desktop")
		// drawer content

	q-drawer(v-model='rightDrawer' side='right' overlay bordered behavior="desktop")
	// drawer content

	q-page-container
		router-view

</template>

<style scoped lang="scss">
header {
	line-height: 1.5;
	max-height: 100vh;
}

.logo {
	display: block;
	margin: 0 auto 2rem;
}

nav {
	width: 100%;
	font-size: 12px;
	text-align: center;
	margin-top: 2rem;
}

nav a.router-link-exact-active {
	color: var(--color-text);
}

nav a.router-link-exact-active:hover {
	background-color: transparent;
}

nav a {
	display: inline-block;
	padding: 0 1rem;
	border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
	border: 0;
}

@media (min-width: 1024px) {
	header {
		display: flex;
		place-items: center;
		padding-right: calc(var(--section-gap) / 2);
	}

	.logo {
		margin: 0 2rem 0 0;
	}

	header .wrapper {
		display: flex;
		place-items: flex-start;
		flex-wrap: wrap;
	}

	nav {
		text-align: left;
		margin-left: -1rem;
		font-size: 1rem;

		padding: 1rem 0;
		margin-top: 1rem;
	}
}
</style>

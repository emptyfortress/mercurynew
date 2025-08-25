<script setup lang="ts">
import { ref, computed } from 'vue'
import { downloadImage } from '@/utils/downloadImage'
import { localIcons } from '@/components/icons/localIcons'
import { quasarIcons } from '@/components/icons/quasarIcons'

const logo = ref()
const favicon = ref()

function openIconPage(collection: string, name: string) {
	console.log(collection)
	console.log(name)
	window.open(`https://icones.js.org/collection/${collection}?icon=${name}`, '_blank')
}

function openMdiIcon(name: string) {
	const iconName = name.replace(/^mdi-/, '')
	window.open(`https://icones.js.org/collection/mdi?icon=mdi:${iconName}`, '_blank')
}

const filter = ref('')
// фильтрация локальных иконок
const filteredLocalIcons = computed(() => {
	if (!filter.value.trim()) return localIcons
	const q = filter.value.toLowerCase()
	return localIcons.filter(
		(icon) => icon.name.toLowerCase().includes(q) || icon.collection.toLowerCase().includes(q)
	)
})
// фильтрация quasar-иконок (mdi)
const filteredQuasarIcons = computed(() => {
	if (!filter.value.trim()) return quasarIcons
	const q = filter.value.toLowerCase()
	return quasarIcons.filter((name) => name.toLowerCase().includes(q))
})
const clear = () => {
	filter.value = ''
}
</script>

<template lang="pug">
q-page(padding)
	.cont
		.zg Иконки
		br
		p Не все иконки используются в проекте. Здесь приведены иконки из рабочей директории, они могут меняться и тп. Поиск работает только по имени файла. Имя файла состоит из названия коллекции + названия иконки. Поэтому, все зависит от фантазии дизайнера иконки. По клику откроется агрегатор, где можно скопировать или скачать иконку в виде компонента или файла.
		q-separator(color="primary" spaced="2rem")
		.row.justify-left.items-center.q-gutter-md
			div лого приложения:
			img(ref='logo' src='@/assets/img/kp_logo.svg' @click="downloadImage('kp_logo', logo)")
			div favicon:
			img(ref='favicon' src='@/assets/img/favicon.svg' @click="downloadImage('favicon', favicon)")
			q-space
			q-input(v-model="filter", dense, outlined, clearable @clear='clear')
				template(v-slot:prepend)
					q-icon(name="mdi-magnify" color="primary")

		q-separator(color="primary" spaced="2rem")

		.grid
			div(
					v-for="icon in filteredLocalIcons"
					:key="icon.name"
				)
					component(:is="icon.component" @click="openIconPage(icon.collection, icon.name)")
					q-tooltip( anchor="bottom middle" self="center middle") {{ icon.name }}

		q-separator(color="primary" spaced="2rem")
		.grid
			div(v-for="name in filteredQuasarIcons" :key="name" @click="openMdiIcon(name)")
				q-icon(:name="name" size="32px")
				q-tooltip( anchor="bottom middle" self="center middle") {{ name }}

</template>

<style scoped lang="scss">
.cont {
	max-width: 1300px;
	margin: 0 auto;
}
.zg {
	font-size: 1.3rem;
	font-weight: 500;
	text-align: center;
}
.zg1 {
	font-size: 1.1rem;
	font-weight: 500;
}

.grid {
	margin-top: 1rem;
	display: grid;
	grid-template-columns: repeat(10, 1fr);
	column-gap: 0.5rem;
	row-gap: 0.5rem;
	font-size: 2.2rem;
	div {
		cursor: pointer;
	}
}
img {
	cursor: pointer;
}
</style>

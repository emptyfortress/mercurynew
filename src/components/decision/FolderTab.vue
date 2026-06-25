<script setup lang="ts">
import { ref } from 'vue'

const selectedFolder = ref(null)
const folderOptions = [
	{ label: 'Папка 1', value: 'folder1' },
	{ label: 'Папка 2', value: 'folder2' },
	{ label: 'Папка 3', value: 'folder3' },
]
</script>

<template lang="pug">
.q-pa-md
	.row.q-col-gutter-md
		.col-12
			q-select(v-model="selectedFolder" :options="folderOptions" label="Выберите папку" outlined dense)
		.col-12
			q-btn(unelevated color="primary" label="Сохранить")
</template>

<style scoped lang="scss">
</style>

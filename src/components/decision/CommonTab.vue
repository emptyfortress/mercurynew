<script setup lang="ts">
import { ref } from 'vue'

const name = ref('Sample Query Name')
const creationDate = ref('2024-01-15')
const author = ref('John Doe')
const description = ref('This is a sample description for the query.')
</script>

<template lang="pug">
.q-pa-md
	.row.q-col-gutter-md
		.col-12
			q-input(v-model="name" label="Name" outlined dense)
		.col-12.col-sm-6
			q-input(v-model="creationDate" label="Creation Date" outlined dense readonly)
		.col-12.col-sm-6
			q-input(v-model="author" label="Author" outlined dense)
		.col-12
			q-input(v-model="description" label="Description" type="textarea" outlined dense)
</template>

<style scoped lang="scss">
</style>

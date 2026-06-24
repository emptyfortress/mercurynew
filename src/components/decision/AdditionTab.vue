<script setup lang="ts">
import { ref } from 'vue'

const check1 = ref(false)
const check2 = ref(false)
const check3 = ref(false)
const check4 = ref(false)
const check5 = ref(false)
</script>

<template lang="pug">
.q-pa-md
	.row.q-col-gutter-md
		.col-12
			.text-h6 Additional Options
		.col-12
			q-checkbox(v-model="check1" label="Check 1")
		.col-12
			q-checkbox(v-model="check2" label="Check 2")
		.col-12
			q-checkbox(v-model="check3" label="Check 3")
		.col-12
			q-checkbox(v-model="check4" label="Check 4")
		.col-12
			q-checkbox(v-model="check5" label="Check 5")
</template>

<style scoped lang="scss">
</style>

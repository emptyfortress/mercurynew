<script setup lang="ts">
import { ref } from 'vue'
import { date } from 'quasar'
import { useRouter } from 'vue-router'

const router = useRouter()
const test = ref(date.formatDate(new Date(), 'DD.MM.YYYY'))
</script>

<template lang="pug">
q-page
	h2 Hi, there {{ test }}
	p This is a dummy paragraph. This is some more text for the first paragraph.
	.row.justify-center
		q-btn(color="warning" label="Test" @click="router.push('/')")
</template>

<style scoped lang="scss">
h2 {
	color: red;
	font-weight: bold;
}
</style>

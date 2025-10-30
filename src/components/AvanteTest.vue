<script setup lang="ts">
import { ref } from 'vue'
import { date } from 'quasar'

const test = ref(date.formatDate(new Date(), 'DD.MM.YYYY'))
</script>

<template lang="pug">
h2 Hi, there {{ test }}
p This is a dummy paragraph. This is some more text for the first paragraph.
.row.justify-center
	q-btn(color="primary" label="Test")
</template>

<style scoped lang="scss">
h2 {
	color: red;
	font-weight: bold;
}
</style>

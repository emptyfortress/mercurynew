<script setup lang="ts">
import { ref } from 'vue'
import Start from '@/components/Start.vue'
import AddDialog from '@/components/AddDialog.vue'

const dialog = ref(false)

const add = () => {
	dialog.value = !dialog.value
}
</script>

<template lang="pug">
q-page(padding)
	Start
	AddDialog(v-model="dialog")
	q-btn.fab(round color="primary" icon="mdi-plus" @click="add")

</template>

<style scoped lang="scss">
.q-page {
	position: relative;
}

.adddialog {
	background: #fff;
	width: 600px;
}

.fab {
	position: absolute;
	bottom: 1rem;
	right: 1rem;
	width: 48px;
	height: 48px;
	background: #fff;
	border-radius: 48px;
	box-shadow: var(--shad);
	cursor: pointer;
	transform-origin: top left;
	z-index: 3;
}
</style>

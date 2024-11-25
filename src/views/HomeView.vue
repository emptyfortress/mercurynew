<script setup lang="ts">
import { ref } from 'vue'
import AppGrid1 from '@/components/AppGrid1.vue'
import AddDialog from '@/components/AddDialog.vue'
import { useStorage } from '@vueuse/core'
import { useRouter, useRoute } from 'vue-router'
import { useMotions, useMotion } from '@vueuse/motion'
// import { useApps } from '@/stores/apps'
// import { flatApp } from '@/stores/tree'

// const myapps = useApps()

const router = useRouter()
const route = useRoute()

const app = useStorage('app', localStorage)

const showAdd = ref(false)

const motions = useMotions()

const add = () => {
	showAdd.value = !showAdd.value
	// await cardAnim('set1')
	// await cardAnim('set2')
	// await cardAnim('initial')
	// // } else await cardAnim({ width: 600 })
}

// myapps.loadApp(flatApp)
</script>

<template lang="pug">
q-page(padding)
	AppGrid1
	AddDialog(v-model="showAdd")
	q-btn.fab(round color="primary" icon="mdi-plus" @click="add")

</template>

<style scoped lang="scss">
.q-page {
	// display: flex;
	// justify-content: center;
	// gap: .5rem;
	// align-items: center;
	// flex-direction: column;
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

.hd {
	font-size: 1.2rem;
}
</style>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useKeyModifier } from '@vueuse/core'
import { useApps } from '@/stores/apps'
import ItemForGroup from '@/components/ItemForGroup.vue'
import ItemSingle from '@/components/ItemSingle.vue'
import AddDialog from '@/components/AddDialog.vue'

const myapps = useApps()
const tapes = ref([...myapps.apps])

const shift = useKeyModifier('Shift')

const dialog = ref(false)

const add = () => {
	dialog.value = !dialog.value
}

const type = computed(() => {
	return shift.value ? 1 : 0
})
const create = (e: App) => {
	tapes.value.push(e)
	myapps.createApp(e)
}
</script>

<template lang="pug">
q-page(padding)
	ItemSingle(v-show='type == 0' v-model:tapes="tapes")
	ItemForGroup(v-if='type == 1' v-model:tapes="tapes")

	AddDialog(v-model="dialog" @create='create')
	q-btn.fab(round color="primary" icon="mdi-plus" @click="add")

</template>

<style scoped lang="scss">
.q-page {
	position: relative;
}
.colors {
	position: absolute;
	left: 0.5rem;
	bottom: 0.5rem;
	width: 400px;
	background: #ccc;
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

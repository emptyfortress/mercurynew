<script setup lang="ts">
import { ref, computed } from 'vue'
import { useKeyModifier } from '@vueuse/core'
import { useApps } from '@/stores/apps'
import ItemForGroup from '@/components/ItemForGroup.vue'
import ItemSingle from '@/components/ItemSingle.vue'

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

// const create = (e: App) => {
// 	tapes.value.push(e)
// 	myapps.createApp(e)
// }

</script>

<template lang="pug">
q-page(padding)
	ItemSingle(v-show='type == 0' v-model:tapes="tapes")
	ItemForGroup(v-if='type == 1' v-model:tapes="tapes")

</template>

<style scoped lang="scss">
.appblock {
	display: flex;
	align-items: center;
}

.colors {
	position: absolute;
	left: 0.5rem;
	bottom: 0.5rem;
	width: 400px;
	background: #ccc;
}
</style>

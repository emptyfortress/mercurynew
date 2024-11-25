<script setup lang="ts">
import { ref, computed } from 'vue'
import { useKeyModifier } from '@vueuse/core'
import { useApps } from '@/stores/apps'
import ItemForGroup from '@/components/ItemForGroup.vue'
import ItemSingle from '@/components/ItemSingle.vue'

const myapps = useApps()
const tapes = ref([...myapps.apps])

const shift = useKeyModifier('Shift')

const type = computed(() => {
	return shift.value ? 1 : 0
})
</script>

<template lang="pug">
ul
	ItemSingle(v-show='type == 0' v-model:tapes="tapes")
	ItemForGroup(v-if='type == 1' v-model:tapes="tapes")

</template>

<style scoped lang="scss">
ul {
	display: flex;
	flex-wrap: wrap;
}
</style>

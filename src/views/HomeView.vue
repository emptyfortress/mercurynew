<script setup lang="ts">
import { ref, computed } from 'vue'
import { useKeyModifier } from '@vueuse/core'
import { useApps } from '@/stores/apps'
import ItemForGroup from '@/components/ItemForGroup.vue'
import ItemSingle from '@/components/ItemSingle.vue'
import { uid, useQuasar } from 'quasar'

const myapps = useApps()
const tapes = ref([...myapps.apps])

const shift = useKeyModifier('Shift')


const type = computed(() => {
	return shift.value ? 1 : 0
})

const $q = useQuasar()
const create = (e: string) => {
	let tmp = {
		id: uid(),
		label: e,
		descr: 'description',
		expand: false,
		version: '0.0.0',
		author: 'Орлов П.С.',
		created: '22.09.2022',
		type: 0,
		group: false,
	}

	tapes.value?.push(tmp)
	setTimeout(() => {
		$q.notify({
			icon: 'mdi-check-bold',
			color: 'positive',
			message: 'Добавлено приложение'
		})
	}, 1200)
	myapps.createApp(tmp)
}

</script>

<template lang="pug">
q-page(padding)
	ItemSingle(v-show='type == 0' v-model:tapes="tapes" @create="create")
	ItemForGroup(v-show='type == 1' v-model:tapes="tapes")

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

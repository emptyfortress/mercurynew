<script setup lang="ts">
import { ref, computed } from 'vue'
import IconFaceMask from '@/components/icons/IconFaceMask.vue'
import IconClear from '@/components/icons/IconClear.vue'
import SimpleQuery from '@/components/SimpleQuery.vue'
import DragEditWindow from '@/components/DragEditWindow.vue'
import { useQuasar } from 'quasar'

interface TmpCond {
	text: string,
	kind?: number
}

interface CondL {
	id: Number
	data: TmpCond[]
	and: Boolean
}

const condList = ref<CondL[]>([])

const show = ref(false)
const toggle = (() => {
	show.value = !show.value
})

const $q = useQuasar()
const addCond = ((e: any) => {
	condList.value.push(e)
	setTimeout(() => {
		$q.notify({
			icon: 'mdi-check-bold',
			color: 'positive',
			message: 'Запрос сохранен',
			position: 'top'
		})
	}, 1200)
})

const clear = (() => {
	condList.value.length = 0
})
const remCond = (e: any) => {
	const ind = condList.value.findIndex((item) => item == e)
	condList.value.splice(ind, 1)
}
const isLast = ((num: number) => {
	return condList.value.length == num + 1 ? true : false
})

</script>

<template lang="pug">
div
	.topblock(v-if="condList.length")
		.list(v-for="(item, index) in condList")
			SimpleQuery(:arr="item" :last='isLast(index)' @remove="remCond(item)")

	.empty(v-else)
		IconFaceMask.big
		div Запрос не настроен.


	.text-center.q-mt-md
		template(v-if='condList.length' )
			q-btn(flat color="primary" icon='mdi-plus-circle-outline' label="Добавить условие" @click="toggle") 
			q-btn.q-ml-sm(v-if='condList.length > 1' flat color="negative" @click="clear") 
				IconClear.ic.q-mr-sm
				.q-cursor Очистить все
		q-btn(v-else unelevated color="primary" label="Настроить" @click="toggle") 

	DragEditWindow(v-model="show" @addCond='addCond')
</template>

<style scoped lang="scss">
.empty {
	text-align: center;
	margin: 1rem auto;
	color: $secondary;
}

.big {
	font-size: 3rem;
	color: $secondary;
}

.ic {
	font-size: 1.5rem;
}

.topblock {
	padding: 1rem;
}

.list:last-child {
	.q-my-sm {
		display: none;
	}

}
</style>

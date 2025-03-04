<script setup lang="ts">
import { ref, computed } from 'vue'
import IconFaceMask from '@/components/icons/IconFaceMask.vue'
import IconClear from '@/components/icons/IconClear.vue'
import IconPersonNo from '@/components/icons/IconPersonNo.vue'
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

function hasDuplicateText(condLArray: CondL[]): boolean {
	const seenTexts = new Set<string>();

	for (const condL of condLArray) {
		for (const tmpCond of condL.data) {
			if (seenTexts.has(tmpCond.text)) {
				return true; // Duplicate found
			}
			seenTexts.add(tmpCond.text);
		}
	}

	return false; // No duplicates found
}

const err = computed(() => {
	if (hasDuplicateText(condList.value) && !show.value) return true
	return false
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

const test = ref()

</script>

<template lang="pug">
div
	.grid(v-if="condList.length")
		.topblock
			.list(v-for="(item, index) in condList")
				SimpleQuery(:arr="item" :last='isLast(index)' @remove="remCond(item)")
		.err(v-if='err' ref='test'
			v-motion
			:initial="{ y: -20, opacity: 0 }"
			:enter="{ y: 0, opacity: 1, transition: { delay: 2000 } }"
			)
			IconPersonNo.big
			q-menu
				q-card(dark) Текущий запрос вернет 0 результатов

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

.topblock,
.err {
	padding: 1rem;
}

.grid {
	display: flex;
	justify-content: space-between;
	align-items: start;
}

.err {
	cursor: pointer;
	padding-bottom: 0;
}

.q-card {
	width: 150px;
	text-align: center;
	padding: .25rem;
}

.err {
	animation: bounce-top 0.9s 5s;
}

@keyframes bounce-top {
	0% {
		transform: translateY(-45px);
		animation-timing-function: ease-in;
		opacity: 1;
	}

	24% {
		opacity: 1;
	}

	40% {
		transform: translateY(-24px);
		animation-timing-function: ease-in;
	}

	65% {
		transform: translateY(-12px);
		animation-timing-function: ease-in;
	}

	82% {
		transform: translateY(-6px);
		animation-timing-function: ease-in;
	}

	93% {
		transform: translateY(-4px);
		animation-timing-function: ease-in;
	}

	25%,
	55%,
	75%,
	87% {
		transform: translateY(0px);
		animation-timing-function: ease-out;
	}

	100% {
		transform: translateY(0px);
		animation-timing-function: ease-out;
		opacity: 1;
	}
}
</style>

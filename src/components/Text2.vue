<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import IconFaceMask from '@/components/icons/IconFaceMask.vue'
import IconClear from '@/components/icons/IconClear.vue'
import IconPersonNo from '@/components/icons/IconPersonNo.vue'
import TreeQuery from '@/components/TreeQuery.vue'
import DragEditWindow from '@/components/DragEditWindow.vue'
import { Draggable } from '@he-tree/vue'
import '@he-tree/vue/style/default.css'
import '@he-tree/vue/style/material-design.css'
import { useQuasar } from 'quasar'

interface CondL {
	id: Number
	data: Option[]
}

const condList = ref<CondL[]>([])

const show = ref(false)
const toggle = (() => {
	show.value = !show.value
})

const $q = useQuasar()

const addCond = ((e: any) => {
	add(e)
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
	treeData[0].children.length = 0
})
const remCond = (e: any) => {
	const ind = condList.value.findIndex((item) => item == e)
	condList.value.splice(ind, 1)
}

const test = ref()

const treeData = reactive([
	{
		type: 10,
		typ: false,
		drop: false,
		drag: false,
		text: 'И',
		children: [
		] as Option[],
	},
])

const tree = ref()

function flattenTree(data: any) {
	const result: any[] = []
	data.forEach((node: any) => {
		result.push(node) // Add the current node
		if (node.children && node.children.length > 0) {
			result.push(...flattenTree(node.children)) // Recursively flatten children
		}
	})
	return result
}

const treeLength = computed(() => {
	return flattenTree(treeData).length
})

const zero = computed(() => {
	return treeLength.value == 1 ? true : false
})
const oneRule = computed(() => {
	return treeLength.value == 2 ? true : false
})
const twoMore = computed(() => {
	return treeLength.value > 2 ? true : false
})

const add = ((e: Option) => {
	tree.value.add(e, tree.value.rootChildren[0])
	// treeData[0].children.push(e)
})
</script>

<template lang="pug">
div
	.grid

		div(v-if='zero') empty
		TreeQuery(v-if='oneRule'
			:arr="treeData[0]"
			)

		Draggable(ref="tree"
			treeLine
			v-model="treeData"
			:indent="40"
			class='mtl-tree'
			)

			template(#default="{ node, stat }" )
				.node(v-if='twoMore')
					div(v-if='node.type == 10') {{ node.text }}
					div(v-else) fucucucuc

			// .list(v-for="(item, index) in condList")
			// 	SimpleQuery(:arr="item" :last='isLast(index)' @remove="remCond(item)")

		.err(v-if='twoMore' ref='test'
			v-motion
			:initial="{ y: -20, opacity: 0 }"
			:enter="{ y: 0, opacity: 1, transition: { delay: 2000 } }"
			)
			IconPersonNo.big
			q-menu
				q-card(dark) Текущий запрос вернет 0 результатов

	.empty(v-if='zero')
		IconFaceMask.big
		div Запрос не настроен.


	.text-center.q-mt-md
		q-btn(v-if='zero' unelevated color="primary" label="Настроить" @click="toggle") 
		template(v-else)
			q-btn(flat color="primary" icon='mdi-plus-circle-outline' label="Добавить условие" @click="toggle") 
			q-btn.q-ml-sm(flat color="negative" @click="clear") 
				IconClear.ic.q-mr-sm
				.q-cursor Очистить все

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
	padding: 1rem;
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

<script setup lang="ts">
import { ref, computed, reactive, watch } from 'vue'
import { Draggable } from '@he-tree/vue'
import ConditionItem from '@/components/decision/ConditionItem.vue'
import { useDrag } from '@/stores/drag'
import PreviewFormDialog from '@/components/decision/PreviewFormDialog.vue'
// import { uid } from 'quasar'

const props = defineProps({
	preview: {
		type: Boolean,
		required: true,
		default: false,
	},
})

const drag = useDrag()
let treeData = reactive([
	{
		type: 10,
		typ: false,
		drop: false,
		drag: false,
		children: [],
	},
])

const isDrop = (e: any) => {
	if (e.data.drop) return true
	else return false
}
const isDrag = (e: any) => {
	if (e.data.drag) return true
	else return false
}

const tree = ref()

const remove = (e: Stat) => {
	tree.value.remove(e)
	if (tree.value.statsFlat.filter((item: Stat) => item.data.type == 1).length == 0) {
		drag.setTreeKey(null)
	}
}
const duble = (e: Stat) => {
	const temp = { ...e.data }
	tree.value.add(temp, e.parent)
}

const externalDataHandler = () => {
	if (!!drag.dragNode && drag.focus == true) {
		let active = tree.value.statsFlat.find((item: Stat) => item.data.focus == true)
		active.data.synparents = drag.dragNode.parents
		active.data.syn.push(drag.dragNode.text)
	}
	if (!!drag.dragNode && drag.focus == false) {
		return {
			id: drag.dragNode.id,
			text: drag.dragNode.text,
			text1: '',
			text2: 'Равно',
			text3: '',
			type: drag.dragNode.type,
			typ: drag.dragNode.typ,
			selected: false,
			drag: drag.dragNode.drag,
			drop: drag.dragNode.drop,
			parents: drag.dragNode.parents,
			man: drag.dragNode.man,
			date: drag.dragNode.date,
			state: drag.dragNode.state,
			inp: '',
			ruk: drag.dragNode.ruk,
			kind: drag.dragNode.kind,
			vis: true,
			children: [],
			synparents: [],
			syn: [],
			param: false,
		}
	}
}
// additional code for top node
// const typ = ref(false)
const next = () => {
	all[0].typ = !all[0].typ
}
const calcLength = computed(() => {
	if (tree.value && tree.value.statsFlat.length == 1) {
		return true
	}
	return false
})
const emit = defineEmits(['closePreview', 'find'])

const toggle = (e: Stat) => {
	e.data.vis = !e.data.vis
}

let all = reactive([
	{
		type: 0,
		typ: false,
		vis: false,
		children: [],
	},
])

watch(
	() => drag.flag,
	() => {
		if (drag.flag == true) {
			all[0].children = tree.value.getData()
		}
	}
)

const focus = (e: Stat) => {
	let other = tree.value.statsFlat.filter((item: Stat) => item !== e)
	e.data.focus = !e.data.focus
	if (e.data.focus == true) {
		other.map((item: Stat) => (item.data.focus = false))
		drag.focus = true
		drag.setKind(e.data.kind!)
	} else {
		other.map((item: Stat) => (item.data.focus = false))
		drag.focus = false
	}
}
const calcClass = (e: Stat) => {
	if (drag.focus && e.data.focus) {
		return 'focus'
	} else if (drag.focus && !e.data.focus) return 'dis'
	return ''
}
const hideFirst = computed(() => {
	if (drag.focus) {
		return 'dis'
	}
	let len = tree.value?.statsFlat.length
	return len < 3 ? 'tran' : ''
})
</script>

<template lang="pug">
.con
	.zero.q-pl-lg(:class="hideFirst" )
		.icon(:class="{ or: all[0].typ === true }" @click.stop="next")
		.q-ml-md Оператор
		.text-weight-bold.q-ml-sm {{ all[0].typ == true ? 'ИЛИ' : 'И' }}

	Draggable.pad(ref="tree"
		treeLine
		v-model="treeData"
		:indent="40"
		:eachDroppable="isDrop"
		:eachDraggable="isDrag"
		:onExternalDragOver="()=> true"
		:externalDataHandler="externalDataHandler"
		:watermark="false" )
		template(#default="{ stat }")
			.empty(v-if="calcLength") Перетащите сюда оператор И/ИЛИ  или поле для поиска
			ConditionItem(
				:class="calcClass(stat)"
				:stat="stat"
				@duble="duble(stat)"
				@toggleVis="toggle(stat)"
				@kill="remove(stat)")

	PreviewFormDialog(v-model="props.preview" :tree="all" @close="emit('closePreview')" @find="emit('find')")
</template>
<style scoped lang="scss">
.con {
	margin: 0.5rem 2rem;
}
.zero {
	display: flex;
	align-items: center;
	background: transparent;
	padding: 0.5rem;
	margin-bottom: 4px;
	height: 54px;
	&.tran {
		opacity: 0;
	}
}
.pad {
	margin-left: 40px;
	position: relative;
	margin-bottom: 2rem;
}

:deep(.drag-placeholder) {
	height: 58px;
	margin-bottom: 0.3rem;
}
.trig {
	font-size: 1.3rem;
	margin-right: 0.5rem;
	transition: 0.2s ease all;

	&.closed {
		transform: rotate(-90deg);
	}
}
.icon {
	width: 49px;
	height: 36px;
	background-image: url('@/assets/img/andor.svg');
	transition: 0.2s ease-out all;
	background-position: top left;
	cursor: pointer;

	&.or {
		background-position: bottom left;
	}
}
.empty {
	text-align: center;
	color: $negative;
	border: 1px solid var(--my-border-color);
	padding: 1rem;
	border-radius: 4px;
	margin-left: -3rem;
}
.focus {
	transform: scale(1.05);
}
.dis {
	transform: scale(0.95);
	filter: blur(5px);
}
// .here {
// 	font-size: 0.9rem;
// 	width: 100%;
// 	text-align: center;
// 	position: absolute;
// 	top: 4rem;
// 	padding: 0.2rem 1rem;
// 	border: 1px solid #ccc;
// 	background: var(--bg-main);
// 	z-index: 2;
// }
</style>

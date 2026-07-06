<script setup lang="ts">
import { ref, reactive, computed, watch, nextTick } from 'vue'
import { useDrag } from '@/stores/drag'
import { Draggable } from '@he-tree/vue'
import ConditionItemView from '@/components/decision/ConditionItemView.vue'

const drag = useDrag()
let treeData = reactive([
	{
		text: 'test',
	},
])

const tree = ref()

const isDrop = (e: any) => {
	if (e.data.drop) return true
	else return false
}
const isDrag = (e: any) => {
	if (e.data.drag) return true
	else return false
}

const externalDataHandler = () => {
	if (!!drag.dragNode && drag.focus == true) {
		let active = tree.value.statsFlat.find((item: Stat) => item.data.focus == true)
		active.data.synparents = drag.dragNode.parents
		active.data.syn.push(drag.dragNode.text)
	}
	if (!!drag.currentDrag) {
		firstTimeDrop.value = true
		return {
			id: drag.currentDrag.id,
			text: drag.currentDrag.text,
			text1: '',
			text2: 'Равно',
			text3: '',
			type: drag.currentDrag.type,
			typ: drag.currentDrag.typ,
			selected: false,
			drag: drag.currentDrag.drag,
			drop: drag.currentDrag.drop,
			parents: drag.currentDrag.parents,
			man: drag.currentDrag.man,
			date: drag.currentDrag.date,
			state: drag.currentDrag.state,
			inp: '',
			ruk: drag.currentDrag.ruk,
			kind: drag.currentDrag.kind,
			vis: true,
			children: [],
			synparents: [],
			syn: [],
		}
	}
}

const remove = (e: Stat) => {
	tree.value.remove(e)
}
const calcLength = computed(() => {
	if (tree.value && tree.value.statsFlat.length == 1) {
		return true
	}
	return false
})
const firstTimeDrop = ref(false)

const dropped = computed(() => {
	return firstTimeDrop.value && tree.value.statsFlat.length > 1
})
</script>

<template lang="pug">
.headtable(v-if="dropped")
	div Разделы / поля
	div Название колонки
	q-btn(outline color="primary" label="Просмотр" size="sm") 
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
		.empty(v-if="calcLength") Настройте порядок колонок и метки в заголовках таблицы, перетащив сюда нужные поля из списка справа.
		ConditionItemView(
			:stat="stat"
			@kill="remove(stat)")
</template>

<style scoped lang="scss">
.pad {
	min-height: 50px;
}
.empty {
	text-align: center;
	padding: 1rem;
	border: 1px solid var(--my-border-color);
	color: $negative;
}
:deep(.drag-placeholder) {
	height: 58px;
	margin-bottom: 0.3rem;
}
.headtable {
	display: grid;
	grid-template-columns: 3fr 1fr 90px;
	align-items: center;
	padding-left: 1.3rem;
	margin-bottom: 0.5rem;
	div {
		font-weight: 600;
		font-size: 0.8rem;
	}
}
:deep(.drag-placeholder) {
	background-color: hsl(212 46% 75% / 1);
	border: none;
	border-radius: 4px;
	height: 48px;
}
.my-placeholder {
	display: flex;
	align-items: center;
	height: 100%;
	margin-left: 1rem;
}
</style>

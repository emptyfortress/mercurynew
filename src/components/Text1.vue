<script setup lang="ts">
import { ref, computed, } from 'vue'
import type { Option } from '@/types/enum'
import { zero } from '@/stores/options2'

import Level1 from '@/components/Level1.vue'
import Level0 from '@/components/Level0.vue'
import LevelDate from '@/components/LevelDate.vue'
import LevelExec from '@/components/LevelExec.vue'
import SimpleQuery from '@/components/SimpleQuery.vue'
import { useElementSize } from '@vueuse/core'
import { useTemplateRef } from 'vue'
import IconClear from '@/components/icons/IconClear.vue'

const query = ref('')
const keys = ref<Option[]>([])
const options = ref(zero)

const selected1 = ref<null | String>(null)
const selected2 = ref<null | String>(null)
const selected3 = ref<null | String>(null)
const keyWord = ref<null | String>(null)
const keyMan = ref<null | String>(null)
const keyDate = ref<null | String>(null)
const keyDateValue = ref<null | String>(null)

const remove = (el: Option, ind: number) => {
	console.log(el)
	el.selected = false
	keys.value.splice(ind)
	query.value = ''
}

const add = (el: Option) => {
	query.value = ''
	keys.value = []
	keys.value.push(el)
}

const add1 = (e: Option) => {
	if (keys.value.length == 1) {
		keys.value.push(e)
	} else if (keys.value.length == 2) {
		keys.value.pop()
		keys.value.push(e)
	} else if (keys.value.length > 2) {
		keys.value.length = 2
		keys.value.pop()
		keys.value.push(e)
	}
}

const add2 = (e: Option) => {
	if (keys.value.length == 2) {
		keys.value.push(e)
	} else if (keys.value.length > 2) {
		keys.value.length = 3
		keys.value.pop()
		keys.value.push(e)
	}
}

const addDValue = (e: Option) => {
	if (keys.value.at(-1)?.dvalue == true) {
		keys.value.pop()
		keys.value.push(e)
	} else {
		keys.value.push(e)
	}
}

const reset = () => {
	keys.value = []
	options.value.map((item) => (item.selected = false))
	query.value = ''
}
const searchActive = computed(() => {
	if (keys.value.length | query.value.length) return true
	else return false
})

interface CondL {
	id: Number
	data: String[]
	and: Boolean
}
const date = new Date()
const condList = ref<CondL[]>([])

const addCond = () => {
	let temp = keys.value.map((item) => item.text)

	temp.push(query.value)

	let obj: CondL = { id: +date, data: temp, and: true }
	condList.value.push(obj)
	reset()
}

const remCond = (e: any) => {
	const ind = condList.value.findIndex((item) => item == e)
	condList.value.splice(ind, 1)
}
const toggleAnd = (item: any) => {
	item.and = !item.and
}

const showFirst = ref(false)

const test = () => {
	showFirst.value = true
}
const el = useTemplateRef('el')
const { height } = useElementSize(el)
const myhei = computed(() => {
	return window.innerHeight - 300 - 150 - height.value + 'px'
})

const clear = (() => {
	condList.value.length = 0
})

</script>

<template lang="pug">
.topblock(ref='el' v-if="condList?.length > 0")
	div
		div(v-for="(item, index) in condList" :key="item.id")
			.oper(v-if='index > 0' @click="toggleAnd(item)" :class="{ and: item.and }")
				span(v-if="item.and") И
				span(v-else) ИЛИ
			SimpleQuery(:arr="item" @remove="remCond(item)")
	.btt
		q-btn(size='md' flat round color="negative" @click="clear") 
			IconClear.ic
			q-tooltip Очистить все

.pad
	br
	q-input(v-model="query" dense @clear="query = ''" @focus="test" placeholder="Что ищем?")
		template(v-slot:prepend)
			q-chip Заявка
			q-chip(v-for="(key, index) in keys" :key="key.id" removable @remove="remove(key, index)" :class="{ man: key.kind == 11 || key.dvalue }" ) {{ key.text }}

		template(v-slot:append v-if='searchActive')
			q-btn(flat round icon="mdi-close" @click="reset" dense) 
			q-btn(unelevated round icon="mdi-plus" color="primary" @click="addCond" size="sm") 
				q-tooltip Добавить условие
			// q-btn(unelevated label="Искать" color="primary" @click="" size="sm") 

	.grid
		transition(name="slide-right" mode="out-in")
			q-list.list(v-if="showFirst")
				Level0(v-model:options="options" v-model:query="query" @addKey="add")

		transition(name="slide-right" mode="out-in")
			q-list.list(v-if="keys.length > 0" )
				Level1(v-model:options="keys[0].children" :kind='keys[0].kind' v-model:query="query" @addKey="add1")

		transition(name="slide-right" mode="out-in")
			q-list.list(v-if="keys.length > 1" )
				Level1(v-model:options="keys[1].children" :kind='keys[1].kind' v-model:query="query" @addKey="add2")

		transition(name="slide-right" mode="out-in")
			q-list.list(v-if="keys.length > 0 && keys.at(-1).date" )
				LevelDate(@add="addDValue" :txt='keys.at(-2).text')

		// transition(name="slide-right" mode="out-in")
		// 	q-list.list(v-if="keys.length > 0 && keys.at(-1).kind == 14" )
		// 		LevelExec
</template>

<style scoped lang="scss">
.zag {
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: start;

	h5 {
		text-align: center;
		border-bottom: 1px dotted $primary;
	}
}

.zagg {
	font-size: 1.4rem;
	margin-bottom: 1rem;

	.edit {
		border-bottom: 1px dotted $primary;
	}
}

.q-input {
	font-size: 1.2rem;
}

.grid {
	display: flex;
	gap: 0.5rem;
	justify-content: start;
	align-items: start;
	margin-top: .5rem;
}

.q-chip {
	padding: 2px 8px;
	background: $blue-2;
	min-width: 50px;
}

.selected {
	background: $blue-2;
}

.man {
	background: $purple-2;
}

.list {
	height: v-bind(myhei);
	overflow-y: auto;
	overflow-x: hidden;
}

.oper {
	background: $amber;
	border: 1px solid $secondary;
	font-size: 0.8rem;
	font-weight: 600;
	text-align: center;
	border-radius: 0 5rem 5rem 0;
	width: 50px;
	margin-top: 4px;
	margin-bottom: 4px;
	margin-left: 1.5rem;
	cursor: pointer;
	box-shadow: 2px 2px 2px rgba(0,0,0, .3);

	&.and {
		background: #a7df83;
		border: 1px solid green;
	}
}

:deep(input::placeholder) {
	opacity: 0.3;
}

.pad {
	margin: 1rem;
}
.topblock {
	display: grid;
	grid-template-columns: 1fr 150px;
	justify-items: start;
	align-items: center;
	column-gap: 1rem;
	row-gap: .5rem;
	padding: 1rem;
	box-shadow: 0 2px 4px rgba(0,0,0, .2);
}
.btt {
	justify-self: end;
	align-self: end;
	text-align: right;
}
.ic {
	font-size: 1.5rem;
}
</style>

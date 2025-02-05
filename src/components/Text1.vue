<script setup lang="ts">
import { ref, computed, watch, reactive } from 'vue'
import type { Option } from '@/types/enum'
import { Kind } from '@/types/enum'
import { zero } from '@/stores/options1'
import { manDetails, datee, str } from '@/stores/conditions'

import Level1 from '@/components/Level1.vue'
import Level0 from '@/components/Level0.vue'
import LevelDate from '@/components/LevelDate.vue'
import SimpleQuery from '@/components/SimpleQuery.vue'
import chooseDialog from '@/components/chooseDialog.vue'

const props = defineProps({
	req: {
		type: String,
		required: true,
	},
})

const query = ref('')
const keys = ref<Option[]>([])
const options = ref(zero)
const str1 = ref(str)

const selected1 = ref<null | String>(null)
const selected2 = ref<null | String>(null)
const selected3 = ref<null | String>(null)
const keyWord = ref<null | String>(null)
const keyMan = ref<null | String>(null)
const keyDate = ref<null | String>(null)
const keyDateValue = ref<null | String>(null)

const remove = (el: Option) => {
	if (el.level !== undefined && el.level == 0) {
		options.value.map((item) => (item.selected = false))
		keys.value = []
		selected1.value = null
		selected2.value = null
		selected3.value = null
		keyMan.value = null
		keyWord.value = null
		keyDate.value = null
		keyDateValue.value = null
	}
	if (el.level !== undefined && el.level == 1) {
		keys.value = keys.value.filter((item) => item.level == 0)
		selected1.value = null
		selected2.value = null
		selected3.value = null
		keyWord.value = null
		keyMan.value = null
		keyDate.value = null
		keyDateValue.value = null
	}
	if (el.level !== undefined && el.level == 2) {
		keys.value = keys.value.filter((item) => item.level! < 2)
		selected2.value = null
		selected3.value = null
		keyWord.value = null
		keyMan.value = null
		keyDate.value = null
		keyDateValue.value = null
	}
	if (el.level !== undefined && el.level == 3) {
		keys.value = keys.value.filter((item: any) => item.level < 3)
		selected3.value = null
		keyWord.value = null
		keyMan.value = null
		keyDate.value = null
		keyDateValue.value = null
	}
	if (el.word !== undefined && el.word == true) {
		keys.value = keys.value.filter((item: any) => item.word !== true)
		keyWord.value = null
		keyMan.value = null
		keyDate.value = null
		keyDateValue.value = null
	}
	if (el.kind !== undefined && el.kind == 11) {
		keys.value = keys.value.filter((item: any) => item.kind !== 11)
		keyWord.value = null
		keyMan.value = null
		keyDate.value = null
		keyDateValue.value = null
	}
	if (el.man == true) {
		keys.value = keys.value.filter((item: any) => item.man !== true)
		keyMan.value = null
		keyDate.value = null
		keyDateValue.value = null
	}
}

const add = (el: Option) => {
	query.value = ''
	keys.value = []
	selected1.value = null
	selected2.value = null
	selected3.value = null
	keyMan.value = null
	keyDate.value = null
	keyDateValue.value = null
	keys.value.push(el)
}

const add1 = (e: Option) => {
	if (selected1.value !== null) {
		keys.value = keys.value.filter((item: any) => item.level == 0)
		keys.value.push(e)
	} else {
		keys.value.push(e)
	}
	selected1.value = e.text
	selected2.value = null
	selected3.value = null
	keyMan.value = null
	keyDate.value = null
	keyDateValue.value = null
	query.value = ''
}

const add2 = (e: Option) => {
	if (keys.value.filter((item) => item.level == 2).length == 0) {
		keys.value.push(e)
	} else {
		keys.value = keys.value
			.filter((item) => item.level !== 2)
			.filter((item) => item.man !== true)
			.filter((item) => item.date !== true)
			.filter((item) => item.dvalue !== true)
		keys.value.push(e)
	}
	selected2.value = e.text
	selected3.value = null
	keyMan.value = null
	keyDate.value = null
	keyDateValue.value = null
	query.value = ''
}

const add3 = (e: Option) => {
	if (keys.value.filter((item) => item.level == 3).length == 0) {
		keys.value.push(e)
	} else {
		keys.value = keys.value.filter((item) => item.level !== 3)
		keys.value.push(e)
	}
	selected3.value = e.text
	keyMan.value = null
	keyDate.value = null
	keyDateValue.value = null
	query.value = ''
}
const addMan = (e: Option) => {
	if (keys.value.at(-1)?.man == true) {
		keys.value.pop()
	}
	keyMan.value = e.text
	keys.value.push(e)
	query.value = ''
}
const addDate = (e: Option) => {
	if (keys.value.at(-1)?.date == true) {
		keys.value.pop()
	}
	keys.value.push(e)
	keyDate.value = e.text
	query.value = ''
}
const addDValue = (e: Option) => {
	if (keys.value.at(-1)?.dvalue == true) {
		keys.value.pop()
	}
	keys.value.push(e)
	keyDateValue.value = e.text
	query.value = ''
}

const reset = () => {
	keys.value = []
	options.value.map((item) => (item.selected = false))
	selected1.value = null
	selected2.value = null
	selected3.value = null
	keyMan.value = null
	keyDate.value = null
	keyWord.value = null
	keyDateValue.value = null
	query.value = ''
	man.value = null
}
const searchActive = computed(() => {
	if (!!keyMan.value || !!keyDateValue.value) return true
	else if (keys.value.length > 0 && keys.value.at(-1)?.kind == 0 && query.value.length > 0)
		return true
	else if (keys.value.length > 0 && keys.value.at(-1)?.kind == 1 && query.value.length > 0)
		return true
	else if (keys.value.length > 0 && keys.value.at(-1)?.kind == 4 && query.value.length > 0)
		return true
	else if (!!keyWord.value && query.value.length > 0) return true
	else if (!!man.value) return true
	else return false
})
const man = ref()
const fio = ['Иванов', 'Петров', 'Сидоров', 'Орлов', 'Воробьев', 'Лебедева']
watch(man, (val) => {
	if (val) {
		keys.value.push({ text: val, kind: Kind.Man, selected: false })
	}
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

const addKeyWord = (e: any) => {
	if (keys.value.at(-1)?.word == true) {
		keys.value.pop()
	}
	keys.value.push(e)
	keyWord.value = e.text
}
const remCond = (e: any) => {
	const ind = condList.value.findIndex((item) => item == e)
	condList.value.splice(ind, 1)
}
const and = ref([true])
const toggleAnd = (item: any) => {
	item.and = !item.and
}

const showFirst = ref(false)

const test = () => {
	if (keys.value?.length == 0) {
		showFirst.value = true
	}
}
const test1 = (() => {
	// showFirst.value = false
})

const addAll = (e: Option) => {
	if (!!e.parents) {
		let temp = e.parents.map((el) => ({
			text: el,
			selected: false,
		}))
		keys.value = [...temp]
		keys.value.push(e)
		query.value = ''
		showFirst.value = false
	}
}

const dialog = ref(false)
</script>

<template lang="pug">
.pad

	.q-mt-md(v-if="condList?.length > 0")
		div(v-for="item in condList")
			SimpleQuery(:arr="item" @remove="remCond(item)")
			.oper(@click="toggleAnd(item)" :class="{ and: item.and }")
				span(v-if="item.and") И
				span(v-else) ИЛИ
	br
	q-input(v-model="query" dense @clear="query = ''" @focus="test" @blur="test1" placeholder="Что ищем?")
		template(v-slot:prepend)
			q-chip(v-for="key in keys" :key="key.id" removable @remove="remove(key)" :class="{ man: key.kind == 11 || key.dvalue }" ) {{ key.text }}
		template(v-slot:append)
			q-btn(v-if="keys.length | query.length" flat round icon="mdi-close" @click="reset" dense) 
			q-btn(v-if="searchActive" unelevated label="Искать" color="primary" @click="" size="sm") 
			q-btn(v-if="searchActive" unelevated round icon="mdi-plus" color="primary" @click="addCond" size="sm") 
				q-tooltip Добавить условие

	.grid
		transition(name="slide-right" mode="out-in")
			q-list.list(v-if="showFirst")
				Level0(v-model:options="options" v-model:query="query" @addKey="add" @addAllKey="addAll")

		transition(name="slide-right" mode="out-in")
			q-list.list(v-if="keys.length > 0" )
				Level1(v-model:options="keys[0].children" v-model:query="query" @addKey="add1")

		transition(name="slide-right" mode="out-in")
			q-list.list(v-if="keys.length > 1" )
				Level1(v-model:options="keys[1].children" v-model:query="query" @addKey="add2")

		transition(name="slide-right" mode="out-in")
			q-list.list(v-if="keys.length > 2" )
				Level1(v-model:options="keys[2].children" v-model:query="query" @addKey="add3")

		transition(name="slide-right" mode="out-in")
			div(v-if="keys.at(-1)?.kind == 5 || keyMan !== null")
				q-list.list
					q-select(v-model="man" outlined bg-color="white" dense :options="fio")
						template(v-slot:prepend)
							q-icon(name="mdi-book-open-page-variant-outline")
					Level1(v-model:options="manDetails" v-model:query="query" @addKey="addMan")

		transition(name="slide-right" mode="out-in")
			q-list.list(v-if="keys.at(-1)?.kind == 0 || keys.at(-1)?.kind == 1 || keys.at(-1)?.kind == 4 || keys.at(-1)?.word == true")
				Level1(v-model:options="str1" v-model:query="query" @addKey="addKeyWord")

		transition(name="slide-right" mode="out-in")
			q-list.list(v-if="keys.at(-1)?.kind == 2 || keyDate !== null")
				Level1(v-model:options="datee" v-model:query="query" @addKey="addDate")

		transition(name="slide-right" mode="out-in")
			q-list.list(v-if="keys.at(-1)?.date == true || keyDateValue !== null")
				LevelDate(@add="addDValue")
chooseDialog(v-model="dialog" kind='request')
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
	height: 500px;
	display: flex;
	gap: 0.5rem;
	justify-content: start;
	align-items: start;
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
	height: 600px;
	overflow-y: auto;
}

.oper {
	background: #93d6ff;
	border: 1px solid $secondary;
	font-size: 0.8rem;
	font-weight: 600;
	width: 70px;
	text-align: center;
	border-radius: 6px;
	// color: white;
	margin-top: 4px;
	margin-bottom: 4px;
	cursor: pointer;

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
</style>

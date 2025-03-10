<script setup lang="ts">
import { ref, computed, } from 'vue'
import { zero } from '@/stores/options2'
import { stat } from '@/stores/conditions'
import Level1 from '@/components/Level1.vue'
import Level0 from '@/components/Level0.vue'
import LevelDate from '@/components/LevelDate.vue'
import LevelDue from '@/components/LevelDue.vue'
import LevelEtap from '@/components/LevelEtap.vue'
import IconUpArrowCircle from '@/components/icons/IconUpArrowCircle.vue'
import IconSave from '@/components/icons/IconSave.vue'
import { Kind } from '@/types/enum'

const props = defineProps({
	height: {
		type: Number,
		required: true,
		default: 100
	}
})
const query = ref('')
const keys = ref<Option[]>([])
const options = ref(zero)
// const motions = useMotions()
const statRef = ref(stat)

const remove = (el: Option, ind: number) => {
	el.selected = false
	keys.value.splice(ind)
	query.value = ''
}

const add = (el: Option) => {
	query.value = ''
	keys.value.length = 0
	keys.value.push(el)
}

const add1 = (e: Option) => {
	if (keys.value.length == 1 && keys.value.at(-1)?.text == 'Автор' && e.kind == 11) {
		keys.value.push({
			kind: Kind.Selector2,
			label: 'равно',
			value: 'равно',
			text: 'равно',
			selected: true,
		})
		keys.value.push(e)
	}

	else if (keys.value.length == 1 && keys.value.at(-1)?.text !== 'Автор') {
		keys.value.push(e)
	}

	else if (keys.value.length == 2 && keys.value.at(-1)?.kind !== 11 && e.kind == 11) {
		keys.value.pop()
		keys.value.push({
			kind: Kind.Selector2,
			label: 'равно',
			value: 'равно',
			text: 'равно',
			selected: true,
		})
		keys.value.push(e)
	}

	else if (keys.value.length == 2 && keys.value.at(-1)?.kind !== 11 && e.kind !== 11) {
		keys.value.pop()
		keys.value.push(e)
	}

	else if (keys.value.length == 3 && keys.value.at(-1)?.kind !== 11 && e.kind !== 11) {
		keys.value.length = 2
		keys.value.pop()
		keys.value.push(e)
	}

	else if (keys.value.length == 3 && keys.value.at(-1)?.kind == 11 && e.kind == 11) {
		keys.value.pop()
		keys.value.push(e)
	}

	else if (keys.value.length == 3 && keys.value.at(-1)?.kind == 11 && e.kind !== 11) {
		keys.value.pop()
		keys.value.pop()
		keys.value.push(e)
	}

	else if (keys.value.length == 3 && keys.value.at(-1)?.kind !== 11 && e.kind == 11) {
		keys.value.length = 1
		keys.value.push({
			kind: Kind.Selector2,
			label: 'равно',
			value: 'равно',
			text: 'равно',
			selected: true,
		})
		keys.value.push(e)
	}
}

const add2 = (e: Option) => {
	if (keys.value.length <= 2) {
		keys.value.push(e)
	}
	if (keys.value.length > 2) {
		keys.value.length = 3
		keys.value.pop()
		keys.value.push(e)
	}
}

const add3 = (e: Option) => {
	keys.value.push(e)
}

const addDValue = (e: Option) => {
	if (keys.value.at(-1)?.dvalue == true) {
		keys.value.pop()
		keys.value.push(e)
	} else {
		keys.value.push(e)
	}
}

const addDue = (e: any) => {
	keys.value.length = 3
	e.forEach((el: any) => {
		keys.value.push(el)
	})
}
const addEtap = (e: any) => {
	keys.value.push(e)
}

const changeOption = ((e: any) => {
	// keys.value.splice(1, 1, e)
})

const reset = () => {
	keys.value = []
	options.value.map((item) => (item.selected = false))
	query.value = ''
}


interface TmpCond {
	text: string,
	kind?: number
}

interface CondL {
	id: string
	text: string
	kind: Kind
	type?: number
	level?: number
	selected?: boolean
	children?: any
	// id: Number
	// list: TmpCond[]
}
const date = new Date()

function convertArray(arrayOne: any) {
	const result = []
	let i = 0

	while (i < arrayOne.length) {
		if (i + 1 < arrayOne.length && 'kind' in arrayOne[i] && 'kind' in arrayOne[i + 1] &&
			arrayOne[i].kind === 5 && (arrayOne[i + 1].kind === 1 || arrayOne[i + 1].kind == 2)) {
			result.push({
				"text": `${arrayOne[i].text}.${arrayOne[i + 1].text}`,
				"kind": arrayOne[i].kind // Use kind from first element
			});
			i += 2; // Skip both merged elements
		} else {
			result.push(arrayOne[i]); // Add element unchanged if no merge condition is met
			i++;
		}
	}
	const ind = result.findIndex((item) => item.kind == 11)
	if (ind > -1) {
		result.splice(ind + 1, result.length - ind)
	}
	const ind1 = result.findIndex((item) => item.kind == 7)
	if (ind1 > -1) {
		result.splice(ind1 + 1, result.length - ind1)
	}
	const ind2 = result.findIndex((item) => item.kind == 16)
	if (ind2 > -1) {
		result.splice(ind2 + 1, result.length - ind2)
	}

	return result
}

function convertArray1(array: any) {
	const result = []
	let i = 0

	while (i < array.length) {
		if (i + 1 < array.length && 'exe' in array[i] && 'exe' in array[i + 1]) {
			result.push({
				"text": `${array[i].text}.${array[i + 1].text}`,
				"kind": array[i].kind,
				"exe": true
			})
			i += 2
		} else {
			result.push(array[i])
			i++
		}
	}
	return result
}

const emit = defineEmits(['addCond', 'close'])

const addCond = () => {
	if (keys.value.at(-1)?.word == true) {
		keys.value.push({ text: query.value, kind: 100, selected: false })
	}

	let tmp = convertArray(keys.value)
	let newtmp = convertArray1(tmp)

	emit('addCond', newtmp)
	reset()
}

const save = (() => {
	addCond()
	emit('close')
})

const showFirst = ref(false)

const test = () => {
	showFirst.value = true
}
const myhei = computed(() => {
	return props.height - 125 + 'px'
})

const calcClass = ((key: any) => {
	if (key.kind == 11) return 'man'
	if (key.dvalue) return 'man'
	if (key.due) return 'due'
	return ''
})

</script>

<template lang="pug">
div
	q-input(v-model="query" dense @clear="query = ''" @focus="test" placeholder="Что ищем?")
		template(v-slot:prepend)
			q-chip Заявка
			q-chip(v-for="(key, index) in keys" :key="key.id" removable @remove="remove(key, index)" :class="calcClass(key)" ) {{ key.text }}


		template(v-slot:append)
			q-btn(flat round icon="mdi-close-circle" color="negative" @click="reset" dense) 
				q-tooltip Очистить
			q-btn(flat round color="primary" @click="addCond" dense ) 
				IconUpArrowCircle.ic
				q-tooltip Добавить условие и продолжить
			q-btn(flat round color="primary" @click="save" dense ) 
				IconSave.ic
				q-tooltip Сохранить

	.grid
		transition(name="slide-right" mode="out-in")
			q-list.list(v-if="showFirst")
				Level0(v-model:options="options" v-model:query="query" @addKey="add")

		transition(name="slide-right" mode="out-in")
			q-list.list(v-if="keys.at(-1)?.kind == 11" )
				Level1(v-model:options="statRef" @addKey='changeOption')

		transition(name="slide-right" mode="out-in")
			q-list.list(v-if="keys.length > 0" )
				Level1(v-model:options="keys[0].children" :kind='keys[0].kind' v-model:query="query" @addKey="add1")

		transition(name="slide-right" mode="out-in")
			q-list.list(v-if="keys.length > 1" )
				Level1(v-model:options="keys[1].children" :kind='keys[1].kind' v-model:query="query" @addKey="add2")


		transition(name="slide-right" mode="out-in")
			q-list.list(v-if="keys.length > 2 && !keys.at(-1)?.exe" )
				Level1(v-model:options="keys[2].children" :kind='keys[2].kind' v-model:query="query" @addKey="add3")

		transition(name="slide-right" mode="out-in")
			q-list.list(v-if="keys.length > 2 && keys.at(-1)?.exe" )
				LevelDue(@add="addDue")

		transition(name="slide-right" mode="out-in")
			q-list.list(v-if="keys.length >= 2 && keys.at(-1)?.execute" )
				LevelEtap(@add="addEtap")

		transition(name="slide-right" mode="out-in")
			q-list.list(v-if="keys.length > 0 && keys.at(-1)?.date" )
				LevelDate(@add="addDValue" :txt='keys.at(-2)?.text')

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

.due {
	background: $orange-3;
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

	&:hover {
		box-shadow: 2px 2px 2px rgba(0, 0, 0, .3);
	}

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
	grid-template-columns: 1fr 170px;
	justify-items: start;
	align-items: center;
	column-gap: 1rem;
	row-gap: .5rem;
	padding: 1rem;
	box-shadow: 0 2px 4px rgba(0, 0, 0, .2);
}

.btt {
	justify-self: end;
	align-self: end;
	text-align: right;
}

.ic {
	font-size: 1.5rem;
}

.rot {
	transform: rotate(45deg);
}

.btt .q-icon {
	transition: transform .3s ease;
}
</style>

<script setup lang="ts">
import { ref, computed, } from 'vue'
import { zero } from '@/stores/options2'
import Level1 from '@/components/Level1.vue'
import Level0 from '@/components/Level0.vue'
import LevelDate from '@/components/LevelDate.vue'
import LevelDue from '@/components/LevelDue.vue'
import LevelEtap from '@/components/LevelEtap.vue'
import SimpleQuery from '@/components/SimpleQuery.vue'
import { useElementSize } from '@vueuse/core'
import { useTemplateRef } from 'vue'
import IconClear from '@/components/icons/IconClear.vue'
import IconUpArrowCircle from '@/components/icons/IconUpArrowCircle.vue'
import { useQuasar } from 'quasar'
import { useMotions } from '@vueuse/motion'

const query = ref('')
const keys = ref<Option[]>([])
const options = ref(zero)
const motions = useMotions()

const remove = (el: Option, ind: number) => {
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

const reset = () => {
	keys.value = []
	options.value.map((item) => (item.selected = false))
	query.value = ''
}
const searchActive = computed(() => {
	if (keys.value.length | query.value.length) return true
	else return false
})

interface TmpCond {
	text: string,
	kind?: number
}

interface CondL {
	id: Number
	data: TmpCond[]
	and: Boolean
}
const date = new Date()
const condList = ref<CondL[]>([])

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

const $q = useQuasar()
const addCond = () => {
	let temp = keys.value.map((item) => ({
		text: item.text,
		kind: item.kind,
	}))

	temp.push({ text: query.value, kind: 100 })

	let tmp = convertArray(temp)

	let obj: CondL = { id: +date, data: tmp, and: true }
	condList.value.push(obj)
	adding.value = false
	reset()

	setTimeout(() => {
		$q.notify({
			icon: 'mdi-check-bold',
			color: 'positive',
			message: 'Запрос сохранен'
		})
	}, 1200)
}

const remCond = (e: any) => {
	const ind = condList.value.findIndex((item) => item == e)
	condList.value.splice(ind, 1)
	if (condList.value.length == 0) adding.value = true
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
	adding.value = true
})
const adding = ref(true)

const calcClass = ((key: any) => {
	if (key.kind == 11) return 'man'
	if (key.dvalue) return 'man'
	if (key.due) return 'due'
	return ''
})

</script>

<template lang="pug">
div
	.topblock(ref='el' v-if="condList?.length > 0")
		div
			div(v-for="(item, index) in condList")
				.oper(v-if='index > 0' @click="toggleAnd(item)" :class="{ and: item.and }")
					span(v-if="item.and") И
					span(v-else) ИЛИ
				SimpleQuery(:arr="item" @remove="remCond(item)")
		.btt
			q-btn(v-if='condList.length > 1' size='sm' flat color="negative" @click="clear") 
				IconClear.ic.q-mr-sm
				.q-cursor Очистить условия
			q-btn(size='sm' flat color="primary" icon='mdi-plus-circle-outline' label='Добавить условие' @click="adding = !adding") 

	transition(:css="false" @leave="(el, done) => motions.inp.leave(done)")
		.pad(v-if='adding'
			v-motion="'inp'"
			:initial="{ y: -50, opacity: 0 }"
			:enter="{ y: 0, opacity: 1 }"
			:leave="{ y: -50, opacity: 0, transition: { type: 'spring', stiffness: 250, damping: 25, mass: 1 } }"
			)
			br
			q-input(v-model="query" dense @clear="query = ''" @focus="test" placeholder="Что ищем?")
				template(v-slot:prepend)
					q-chip Заявка
					q-chip(v-for="(key, index) in keys" :key="key.id" removable @remove="remove(key, index)" :class="calcClass(key)" ) {{ key.text }}
					// q-chip(v-for="(key, index) in keys" :key="key.id" removable @remove="remove(key, index)" :class="{ man: key.kind == 11 || key.dvalue }" ) {{ key.text }}

				template(v-slot:append v-if='searchActive')
					q-btn(flat round icon="mdi-close" @click="reset" dense) 
						q-tooltip Очистить
					q-btn(flat round color="primary" @click="addCond") 
						IconUpArrowCircle.ic
						q-tooltip Добавить условие


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

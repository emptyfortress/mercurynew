<script setup lang="ts">
import { ref } from 'vue'
import { zero } from '@/stores/options1'
import { manDetails, datee, str } from '@/stores/conditions'

import Level0 from '@/components/Level0.vue'
import Level1 from '@/components/Level1.vue'


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

const showFirst = ref(false)
const test = () => {
	if (keys.value?.length == 0) {
		showFirst.value = true
	}
}
const test1 = (() => {
	showFirst.value = false
})

const reset = () => {
	keys.value = []
	// options.value.map((item) => (item.selected = false))
	// selected1.value = null
	// selected2.value = null
	// selected3.value = null
	// keyMan.value = null
	// keyDate.value = null
	// keyWord.value = null
	// keyDateValue.value = null
	query.value = ''
	// man.value = null
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
</script>

<template lang="pug">
.pad
	q-input(v-model="query" dense @clear="query = ''" @focus="test" @blur="test1" placeholder="Что ищем?")
		template(v-slot:append)
			q-btn(v-if="keys.length | query.length" flat round icon="mdi-close" @click="reset" dense) 

	.grid
		transition(name="slide-right" mode="out-in")
			q-list.list(v-if="showFirst")
				Level0(v-model:options="options" v-model:query="query" @addKey="add" @addAllKey="addAll")
				// Level1(v-model:options="keys[0].children" v-model:query="query" @addKey="add1")
</template>

<style scoped lang="scss">
.pad {
	margin: 1rem;
}

.q-input {
	font-size: 1.2rem;
}

:deep(input::placeholder) {
	opacity: 0.3;
}

.grid {
	height: 500px;
	display: flex;
	gap: 0.5rem;
	justify-content: start;
	align-items: start;
}
</style>

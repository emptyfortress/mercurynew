<script setup lang="ts">
import { ref, computed } from 'vue'
import { values } from '@/stores/select'

export type PreviewItem = {
	id: string
	parents: string[]
	type: number
	typ: boolean
	text: string
	text1: string
	text2: string
	text3: string
	inp: string
	man: boolean
	date: boolean
	ruk: boolean
	vis: boolean
}
const props = defineProps<{
	item: PreviewItem
	index: number
}>()

const isRadio = computed(() => {
	if (
		props.item.ruk == true ||
		props.item.text2 == 'Значение задано' ||
		props.item.text2 == 'Значение не задано'
	) {
		return true
	} else return false
})

const isInput = computed(() => {
	if (props.item.man == true || props.item.date == true) {
		return false
	} else return true
})
const isSelector = computed(() => {
	if (props.item.man == true || props.item.date == true) {
		return true
	} else return false
})
const active = ref(new Array(30).fill(true))
const rukovoditel = ref('yes')

const par = computed(() => {
	if (props.item.parents.length > 2) {
		return props.item.parents.at(-1)
	}
	return null
})

const orCondition = computed(() => {
	if (props.item.type == 0 && props.item.typ == true) {
		return true
	}
	return false
})
const text = ref(props.item.text)
</script>

<template lang="pug">
.or(v-if="orCondition" )
	q-icon.q-mr-sm(name="mdi-gate-or" color="primary" size="sm")
	span Выполняется одно (любое) из следующих условий:
template(v-if="props.item.type == 1 && props.item.vis == true")
	.mainlabel(:class="{dis : !active[props.index]}")
		span.par(v-if="par") {{ par }}
		span {{ text }}
		span.addition(v-if="props.item.text2 !== 'Равно'") {{ props.item.text2 }}
		q-popup-edit(v-model="text" auto-save v-slot="scope")
			q-input(v-model="scope.value" dense autofocus @keyup.enter="scope.set")
	.row(v-if="isRadio")
		q-radio(v-model="rukovoditel" val="yes" label="Да" :disable="!active[props.index]")
		q-radio(v-model="rukovoditel" val="no" label="Нет" :disable="!active[props.index]")

	q-select(v-if="isSelector && !isRadio" v-model="props.item.text3" :options="values" dense filled :disable="!active[props.index]")
		template(v-slot:prepend v-if="props.item.date" )
			q-icon(name="mdi-calendar")
		template(v-slot:prepend v-if="props.item.man")
			q-icon(name="mdi-book-open-page-variant-outline")

	q-input(v-if="isInput && !isRadio" dense v-model="props.item.inp" filled hide-bottom-space :disable="!active[props.index]")
	q-toggle(v-model="active[props.index]" dense)
</template>

<style scoped lang="scss">
.q-input,
.q-select {
	width: 100%;
}
.dis {
	opacity: 0.4;
}
.mainlabel::after {
	content: ':';
}
.addition {
	text-transform: lowercase;
	margin-left: 0.5rem;
	&::before {
		content: '(';
	}
	&::after {
		content: ')';
	}
}
.par {
	&::after {
		content: ' > ';
	}
}
.or {
	background: #dcf1ff;
	padding: 0.3rem 1rem;
	margin-top: 0.5rem;
	font-size: 0.9rem;
	border-bottom: 1px solid $primary;
	grid-column: 1/-1;
	width: 100%;
	color: #005d98;
}
</style>

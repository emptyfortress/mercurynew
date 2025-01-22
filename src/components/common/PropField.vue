<script setup lang="ts">
import { ref } from 'vue'

interface Rad {
	label: string
	val: string
}

interface Props {
	select?: boolean
	options?: string[]
	checkbox?: boolean
	textarea?: boolean
	placeholder?: string
	toggle?: boolean
	radio?: boolean
	group?: Rad[]
	startValue?: string

	type?: any
	label?: string
	info?: string
	descr?: string
	disable?: boolean
	readonly?: boolean
	button?: boolean
	btLabel?: string
	check?: boolean
}

const props = withDefaults(defineProps<Props>(), {
	options: () => ['Options 1', 'Option 2'],
	select: false,
	type: 'text',
	button: false,
	readonly: false,
	checkbox: false,
	textarea: false,
	toggle: false,
	radio: false,
	// group: [{ label: 'one', val: 'one' }],
})

const rasp = ref(props.startValue)

const main = defineModel<string>('main')
const check = defineModel<boolean>('check')

</script>

<template lang="pug">
q-separator(v-if='props.radio')
.dat
	label(v-if='props.label' :class='{ start: props.radio }') {{ props.label }} 

	q-checkbox(v-if="props.checkbox" v-model="check" dense :label="props.descr" :disable="props.disable")
	q-toggle(v-if="props.toggle" v-model="check" size="sm")

	q-list.radio(dense v-if='props.radio')
		q-item(v-for="item in props.group" :key="item.label")
			q-item-section(avatar)
				q-radio(v-model="rasp" :val="item.val" dense :label="item.label")


	q-select(v-if="props.select"
		v-model="main"
		:options="props.options"
		dense outlined
		:disable="props.disable"
		:readonly="props.readonly"
		)

	q-input(v-model="main" v-if='props.textarea' outlined autogrow :disable="props.disable")

	q-input(v-if='!props.select && !props.textarea && !props.toggle && !props.checkbox && !props.radio'
		v-model="main"
		dense
		outlined
		:placeholder="props.placeholder"
		:type="props.type"
		:disable="props.disable"
		:readonly="props.readonly")
q-separator(v-if='props.radio')

</template>

<style scoped lang="scss">
.q-separator {
	margin-top: .5rem;
	margin-bottom: .5rem;
	margin-left: -1rem;
	margin-right: -1rem;
	background: hsl(217 40% 92% / 1);
}

.dat {
	display: grid;
	grid-template-columns: 130px 1fr;
	justify-items: start;
	align-items: center;
	gap: 1rem;
	margin-bottom: .5rem;
}

.q-input,
.q-select {
	width: 100%;
	background: var(--bgLight);
}

.q-toggle {
	// justify-self: end;
	// justify-self: end;
}

label {
	text-align: left;
	line-height: 1.2;

	&.start {
		align-self: start;
	}
}
</style>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

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
	after?: boolean
	navigate?: string
	text?: string
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
	after: false,
	navigate: '',
	text: '',
	// group: [{ label: 'one', val: 'one' }],
})

const rasp = ref(props.startValue)

const main = defineModel<string>('main')
const check = defineModel<boolean>('check')

const navigate = () => {
	router.push(props.navigate)
}
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


	.text-bold(v-if='props.text') {{props.text}}

	q-select(v-if="props.select"
		v-model="main"
		:options="props.options"
		dense outlined
		:disable="props.disable"
		:readonly="props.readonly"
		)
		template(v-slot:after v-if='props.after' )
			q-btn(flat round dense icon="mdi-arrow-right-circle-outline" color="primary" @click='navigate') 

	q-input(v-model="main" v-if='props.textarea' outlined autogrow :disable="props.disable")

	q-input(v-if='!props.text && !props.select && !props.textarea && !props.toggle && !props.checkbox && !props.radio'
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
	margin-top: 0.5rem;
	margin-bottom: 0.5rem;
	margin-left: -1rem;
	margin-right: -1rem;
	background: hsl(217 40% 92% / 1);
}

.dat {
	display: grid;
	grid-template-columns: 110px 1fr;
	justify-items: start;
	align-items: center;
	gap: 1rem;
	margin-bottom: 0.5rem;
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
:deep(.q-field--dense .q-field__control, .q-field--dense .q-field__marginal) {
	height: 32px;
}

:deep(.q-field--auto-height.q-field--dense .q-field__native) {
	min-height: 32px;
}

:deep(.q-field--auto-height.q-field--dense .q-field__native) {
	min-height: 32px;
}
:deep(
	.q-field--auto-height.q-field--dense .q-field__control,
	.q-field--auto-height.q-field--dense .q-field__native
) {
	min-height: 32px;
}
:deep(.q-field--dense .q-field__marginal) {
	height: 32px;
}
</style>

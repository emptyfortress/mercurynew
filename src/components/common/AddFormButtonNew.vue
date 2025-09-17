<script setup lang="ts">
import { ref, computed, nextTick, markRaw } from 'vue'
import { useWindowSize } from '@vueuse/core'
import CarbonStringText from '@/components/icons/CarbonStringText.vue'
import CarbonStringInteger from '@/components/icons/CarbonStringInteger.vue'
import MaterialSymbolsInsertTextRounded from '@/components/icons/MaterialSymbolsInsertTextRounded.vue'
import MdiCalendar from '@/components/icons/MdiCalendar.vue'
import MaterialSymbolsAccountCircle from '@/components/icons/MaterialSymbolsAccountCircle.vue'
import { Kind } from '@/types/enum'
import { motion } from 'motion-v'

const props = defineProps({
	elementId: {
		type: String,
		required: true,
		default: 'element',
	},
	mode: {
		type: String,
		required: false,
		default: '',
	},
})

const Div = motion.div

const input = ref()
const form = ref()

const adding = ref(false)

const add = () => {
	// firstTime.value = false
	adding.value = !adding.value
	nextTick(() => {
		if (adding.value == true) {
			input.value.focus()
		}
	})
}

const { width, height } = useWindowSize()

const left = computed(() => {
	return width.value / 2 - 270 + 64 + 'px'
})
const top = computed(() => {
	return height.value / 2 - 300 + 'px'
})

const emit = defineEmits(['create'])
const model = ref(null)
const model1 = ref(null)
const typeModel = ref({
	type: Kind.String,
	pic: CarbonStringText,
	value: 'Строка',
	label: 'Строка',
})
const options = [
	{ type: Kind.String, pic: markRaw(CarbonStringText), value: 'Строка', label: 'Строка' },
	{ type: Kind.Num, pic: markRaw(CarbonStringInteger), value: 'Число', label: 'Число' },
	{
		type: Kind.Text,
		pic: markRaw(MaterialSymbolsInsertTextRounded),
		value: 'Текст',
		label: 'Текст',
	},
	{ type: Kind.Date, pic: markRaw(MdiCalendar), value: 'Дата', label: 'Дата' },
	{
		type: Kind.Man,
		pic: markRaw(MaterialSymbolsAccountCircle),
		value: 'Ссылка на справочник',
		label: 'Ссылка на справочник',
	},
]

const resetForm = () => {
	nextTick(() => {
		input.value?.resetValidation()
	})
	model.value = null
	model1.value = null
	typeModel.value = {
		type: Kind.String,
		pic: markRaw(CarbonStringText),
		value: 'Строка',
		label: 'Строка',
	}
}
const submitForm = () => {
	emit('create', {
		id: +Date.now(),
		label: model.value,
		caption: model1.value,
		selected: false,
		type: typeModel.value.type,
		pic: typeModel.value.pic,
	})
	resetForm()
	add()
}

const otmena = () => {
	add()
	resetForm()
}

const spring = {
	type: 'spring',
	visualDuration: 0.25,
	bounce: 0.25,
}

// const firstTime = ref(true)

// const calcDelay = computed(() => {
// 	return firstTime
// 		? { opacity: 1, rotate: 0, transition: { delay: 1.2 } }
// 		: { opacity: 1, rotate: 0 }
// })
</script>

<template lang="pug">
// .fucking
Div.button1(v-show='!adding'
	:layoutId='props.elementId'
	:transition='spring'
	@click="add"
	)
	q-icon(name="mdi-plus" color="white" size="24px")

Teleport(to="body")
	.backdrop1(v-if='adding')

	Div.dialog1(v-if='adding'
		:layoutId='props.elementId'
		:transition='spring'
		:class="{ active: adding }"
		)
		q-btn.close(round icon="mdi-close"
			v-if="adding"
			color='negative' @click="otmena"
			) 

		q-form(ref='form' @submit="submitForm"
			)
			.hd
				span(v-if='props.mode == "status"') Добавить статус
				span(v-else) Добавить поле
			.section
				label Название:
				q-input(ref="input"
					v-model="model"
					autofocus
					dense
					clearable
					outlined
					:rules="[val => !!val || 'Это обязательное поле']"
					hint='Название должно быть уникальным'
					)

			.section(v-if='props.mode !== "status"')
				label Тип:
				q-select(
					v-model="typeModel"
					:options='options'
					dense
					outlined
					:rules="[val => !!val || 'Это обязательное поле']"
					)

			.section(v-if='props.mode !== "status"')
				label Описание:
				q-input(
					v-model="model1"
					dense
					clearable
					outlined
					hint='Описание не обязательно'
					)


			q-card-actions(align="right" v-if='adding'
				v-motion
				:initial="{ opacity: 0 }"
				:enter='{ opacity: 1, transition: { delay: 200 } }'
				)
				q-btn(flat color="primary" label="Отмена" @click="otmena") 
				q-btn(unelevated color="primary" label="Создать" type='submit') 

</template>

<style scoped lang="scss">
.button1 {
	background: $primary;
	width: 36px;
	height: 36px;
	border-radius: 24px;
	display: flex;
	justify-content: center;
	align-items: center;
	cursor: pointer;
}

.dialog1 {
	width: 400px;
	background: #fff;
	position: fixed;
	left: v-bind(left);
	top: v-bind(top);
	border-radius: 0.5rem;
	box-shadow: var(--shad0);
	display: none;
	padding: 1rem;

	&.active {
		display: block;
	}
}

.backdrop1 {
	width: 100vw;
	height: 100vh;
	background-color: rgba(0, 0, 0, 0.2);
	backdrop-filter: blur(2px);
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
}

.hd {
	font-size: 1.1rem;
	text-align: center;
}

.close {
	z-index: 100;
	position: absolute;
	top: -1.2rem;
	right: -1.2rem;
}

.section {
	margin-top: 1rem;
	margin-bottom: 1rem;
	margin-left: 0.5rem;
	margin-right: 0.5rem;
}

label {
	font-weight: 600;
}

.fucking {
	width: 100px;
	background: transparent;
	display: flex;
	justify-content: center;
	align-items: center;
	cursor: default;

	&:hover {
		border: none;
		box-shadow: none;
	}
}
</style>

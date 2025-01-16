<script setup lang="ts">
import { ref, computed, nextTick, } from 'vue'
import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'
import { useWindowSize } from '@vueuse/core'

gsap.registerPlugin(Flip)

const input = ref()
const form = ref()

const adding = ref(false)

const add = (() => {
	const state = Flip.getState('.button1, .dialog1')
	adding.value = !adding.value
	nextTick(() => {
		Flip.from(state, {
			duration: 0.4,
			ease: 'power3.inOut',
			targets: '.button1, .dialog1',
			absolute: true,
			fade: true,
		})
	})

	nextTick(() => {
		if (adding.value == true) {
			input.value.focus()
		}
	})
})

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
const model2 = ref(null)
const options = [
	'Строка', 'Число', 'Текст', 'Дата', 'Ссылка на справочник',
]


const resetForm = (() => {
	nextTick(() => {
		input.value.resetValidation()
	})
	model.value = null
	pic.value = false

})
const submitForm = (() => {
	emit('create', model.value)
	resetForm()
	add()
	input.value.resetValidation()
})

const otmena = (() => {
	pic.value = false
	add()
	resetForm()
	input.value.resetValidation()
})


const pic = ref(false)
</script>

<template lang="pug">
.fucking
	.button1(v-if='!adding'
		data-flip-id='element'
		@click="add"
		)
		q-icon(name="mdi-plus" color="white" size="24px")

Teleport(to="body")
	.backdrop1(v-if='adding'
		data-flip-id='element'
		v-motion
		:initial="{ opacity: 0 }"
		:enter='{ opacity: 1, transition: { delay: 400 } }'
		style="transform: none"
		)

	.dialog1(
		:class="{ active: adding }"
		data-flip-id='element'
		)
		q-btn.close(round icon="mdi-close"
			v-if="adding"
			color='negative' @click="otmena"
			) 

		q-form(ref='form' @submit="submitForm"
			)
			.hd Добавить поле
			.section
				label Название поля:
				q-input(ref="input"
					v-model="model"
					autofocus
					dense
					clearable
					filled
					:rules="[val => !!val || 'Это обязательное поле']"
					hint='Название должно быть уникальным'
					)

			.section
				label Тип поля:
				q-select(
					v-model="model2"
					:options='options'
					dense
					filled
					:rules="[val => !!val || 'Это обязательное поле']"
					)

			.section
				label Описание:
				q-input(
					v-model="model1"
					dense
					clearable
					filled
					hint='Описание не обязательно'
					)


				q-checkbox(v-model="pic" label="Иконка")

			.section(v-if='pic'
				v-motion
				:initial="{ y: 20, opacity: 0 }"
				:enter='{ y: 0, opacity: 1, transition: { delay: 200 } }'
				)
				label Иконка (png, jpg, webp, gif):
				q-uploader(
				url="http://localhost:4444/upload"
				label="Загрузить картинку"
				color="secondary"
				flat
				bordered
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
	width: 42px;
	height: 42px;
	border-radius: 24px;
	display: flex;
	justify-content: center;
	align-items: center;
	// margin-left: 2rem;
	cursor: pointer;
}


.dialog1 {
	width: 400px;
	background: #fff;
	position: fixed;
	left: v-bind(left);
	top: v-bind(top);
	border-radius: .5rem;
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
	margin-left: .5rem;
	margin-right: .5rem;
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

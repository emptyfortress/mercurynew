<script setup lang="ts">
import { ref, computed, nextTick, markRaw } from 'vue'
import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'
import IconList from '@/components/IconList.vue'
import IconRoleList from '@/components/IconRoleList.vue'
import IconApp from '@/components/icons/list/IconApp.vue'

const props = defineProps({
	mode: {
		type: String,
		required: true,
		default: 'app',
	},
})

const IconApp1 = markRaw(IconApp)

const header = computed(() => {
	switch (props.mode) {
		case 'role':
			return 'Новая роль'
		case 'form':
			return 'Новая форма'
		case 'list':
			return 'Новая папка'
		default:
			if (group.value) return 'Новая группа'
			return 'Новое приложение'
	}
})

gsap.registerPlugin(Flip)

const input = ref()
const form = ref()

const adding = ref(false)
const group = ref(false)

const add = () => {
	trans.value = false
	const state = Flip.getState('.button, .dialog')
	adding.value = !adding.value
	nextTick(() => {
		Flip.from(state, {
			duration: 0.4,
			ease: 'power3.inOut',
			targets: '.button, .dialog',
			absolute: true,
			fade: true,
		})
	})

	nextTick(() => {
		if (adding.value == true) {
			input.value.focus()
		}
	})
}

const left = computed(() => {
	return window.innerWidth / 2 - 270 + 64 + 'px'
})
const top = computed(() => {
	return window.innerHeight / 2 - 200 + 'px'
})

const emit = defineEmits(['create'])
const model = ref(null)
const model1 = ref(null)

const resetForm = () => {
	nextTick(() => {
		input.value.resetValidation()
	})
	model.value = null
	group.value = false
	cancelPress()
}
const submitForm = () => {
	emit('create', {
		label: model.value,
		description: model1.value,
		pic: icon.value,
		group: group.value == true ? 2 : 1,
		avatar: avatar.value,
	})
	resetForm()
	add()
	input.value.resetValidation()
}

const otmena = () => {
	add()
	resetForm()
	input.value.resetValidation()
}

const trans = ref(true)
const start = { opacity: 0, rotate: -720, scale: 0.5 }
const second = { opacity: 1, rotate: 0, scale: 1, transition: { delay: 500 } }

const calcStart = computed(() => {
	return trans.value ? start : { opacity: 1, rotate: 0, scale: 1 }
})
const calcFinish = computed(() => {
	return trans.value ? second : { opacity: 1, rotate: 0, scale: 1 }
})

const icon = ref(IconApp1)
const avatar = ref('src/assets/img/avatar/avatar1.svg')
const setIcon = (e: any) => {
	icon.value = e
}

const setRoleIcon = (e: string) => {
	avatar.value = e
}

const holdTimeout = ref<ReturnType<typeof setTimeout> | null>(null)
const wasLongPress = ref(false)
const HOLD_DELAY = 700 // длительность удержания в мс
const intervalStep = 10
const progress = ref(0)

let holdTimer: ReturnType<typeof setTimeout> | null = null
let progressInterval: ReturnType<typeof setInterval> | null = null

// SVG circle calculations
const radius = 18
const circumference = 2 * Math.PI * radius

const progressOffset = computed(() => {
	return circumference - (progress.value / 100) * circumference
})

function startPress(): void {
	wasLongPress.value = false
	progress.value = 0
	let steps = HOLD_DELAY / intervalStep
	let currentStep = 0

	progressInterval = setInterval(() => {
		currentStep++
		progress.value = (currentStep / steps) * 100
	}, intervalStep)

	holdTimer = setTimeout(() => {
		wasLongPress.value = true
		createGroup()
		cancelPress()
	}, HOLD_DELAY)
}

function endPress(): void {
	if (!wasLongPress.value) {
		cancelPress()
		createApplication()
	}
}

function cancelPress(): void {
	if (holdTimer) {
		clearTimeout(holdTimer)
		holdTimer = null
	}
	if (progressInterval) {
		clearInterval(progressInterval)
		progressInterval = null
	}
	progress.value = 0
}

function createApplication(): void {
	add()
}

function createGroup(): void {
	group.value = true
	add()
}
</script>

<template lang="pug">
.fucking(
	@mousedown="startPress"
	@mouseup="endPress"
	@mouseleave="cancelPress"
	@touchstart="startPress"
	@touchend="endPress"
)
	.button(v-if='!adding'
		data-flip-id='fuck'
		v-motion
		:initial="calcStart"
		:enter='calcFinish')
		q-icon(name="mdi-plus" color="white" size="24px")

		svg(class="progress-ring" width="41" height="41")
			circle(
        class="progress-ring__circle"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="progressOffset"
        stroke="#a6a5fc"
        stroke-width="4"
        fill="transparent"
        r="18"
        cx="20"
        cy="21")

	Teleport(to='body')
		.backdrop(v-if='adding'
			data-flip-id='fuck'
			v-motion
			:initial="{ opacity: 0 }"
			:enter='{ opacity: 1, transition: { delay: 400 } }'
			)

	Teleport(to='body')
		.dialog(
			:class="{ active: adding }"
			data-flip-id='fuck'
			)
			q-btn.close(round icon="mdi-close"
				v-if="adding"
				color='negative' @click="otmena"
				) 

			q-form(ref='form' @submit="submitForm")
				.hd {{ header }}
				.section
					label Название:
					q-input(ref="input"
						v-model="model"
						autofocus
						dense
						clearable
						filled
						:rules="[val => !!val || 'Это обязательное поле']"
						hint='Название должно быть уникальным'
						)


				div(v-if='!group && props.mode == "app" || props.mode == "list"')
					.section
						label Описание:
						q-input(
							v-model="model1"
							dense
							clearable
							filled
							hint='Описание не обязательно'
							)

					IconList(v-if="props.mode == 'app'" @select='setIcon')

				div(v-if="props.mode == 'role'")
					IconRoleList(@select='setRoleIcon')

				q-card-actions(align="right" v-if='adding'
					v-motion
					:initial="{ opacity: 0 }"
					:enter='{ opacity: 1, transition: { delay: 200 } }'
					)
					q-btn(flat color="primary" label="Отмена" @click="otmena") 
					q-btn(unelevated color="primary" label="Создать" type='submit') 

</template>

<style scoped lang="scss">
.fucking {
	width: 100%;
	height: 100%;
	border-radius: 0.5rem;
	background: rgb(255 255 255 / 40%);
	display: flex;
	justify-content: center;
	align-items: center;
	cursor: pointer;
	&:hover {
		box-shadow: var(--shad0);
	}
}
.button {
	background: $primary;
	width: 42px;
	height: 42px;
	border-radius: 24px;
	display: flex;
	justify-content: center;
	align-items: center;
	// margin-left: 2rem;
	cursor: pointer;
	position: relative;
}
.progress-ring {
	position: absolute;
	top: 0;
	left: 0;
	transform: rotate(-90deg); /* начинать с верха */
	z-index: 1;
}

.progress-ring__circle {
	transition: stroke-dashoffset 0.1s linear;
}

.dialog {
	width: 400px;
	// height: 200px;
	background: #fff;
	position: fixed;
	left: v-bind(left);
	top: v-bind(top);
	border-radius: 0.5rem;
	box-shadow: var(--shad0);
	display: none;
	padding: 1rem;
	z-index: 20;

	&.active {
		display: block;
	}
}

.backdrop {
	width: 100vw;
	height: 100vh;
	background-color: rgba(0, 0, 0, 0.2);
	backdrop-filter: blur(2px);
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	z-index: 19;
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

.icon {
	margin-left: 0.5rem;
	display: flex;
	gap: 0.5rem;
	align-items: center;
	.ic {
		font-size: 1.7rem;
		color: var(--icon);
		cursor: pointer;
	}
}
.ii {
	display: grid;
	grid-template-columns: repeat(4, auto);
	font-size: 1.8rem;
	color: var(--icon);
	.selected {
		background: var(--selection);
	}
}
</style>

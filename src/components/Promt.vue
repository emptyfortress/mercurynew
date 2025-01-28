<script setup lang="ts">
import { ref, computed } from 'vue'

const loading = ref(false)
const result = ref(false)
const query = ref('')
const place = ref('Опишите ваше приложение как можно подробнее')

const voice = ref(false)
const toggleVoice = (() => {
	voice.value = !voice.value
})
const calcSize = computed(() => {
	return voice.value ? 'lg' : 'sm'
})
const ask = () => {
	loading.value = true
	setTimeout(() => {
		loading.value = false
		result.value = true
		query.value = ''
		place.value = 'Вы можете уточнить вопрос.'
	}, 2000)
}
</script>

<template lang="pug">
.q-mr-lg
	q-linear-progress(indeterminate color="primary" v-if='loading')
	.input
		q-input(v-model="query" type='textarea' outlined autogrow :placeholder='place')
			template(v-slot:append)
				q-btn.mic(unelevated round :size="calcSize" icon="mdi-microphone" @click="toggleVoice" :class="{ active: voice }") 
					.wave

	.search Вы всегда сможете дополнить и уточнить свой запрос.
		q-btn(unelevated color="primary" icon-right='mdi-arrow-right' label="Отправить" @click="ask") 
</template>

<style scoped lang="scss">
.input {
	position: relative;
}

:deep(.q-field__control) {
	background: #fff;
}

:deep(.q-textarea .q-field__native) {
	padding-top: 0.5rem;
	padding-bottom: 1.5rem;
	font-size: 1rem;
	min-height: 200px;
}

.mic {
	position: absolute;
	bottom: .5rem;
	left: .5rem;
	background: #aaa;
	color: white;
	width: 24px;
	height: 24px;
	transition: .3s ease all;

	&.active {
		background: red;

		.wave {
			animation: pulse 1s ease-out infinite;
		}
	}

	.wave {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 0;
		height: 0;
		background-color: rgba(0, 0, 0, 0.5);
		border-radius: 50%;
		transform: translate(-50%, -50%);
		opacity: 0;
		z-index: 1;
	}
}


/* Keyframes for the wave effect */
@keyframes pulse {
	0% {
		width: 0;
		height: 0;
		opacity: 0.5;
	}

	100% {
		width: 200px;
		height: 200px;
		opacity: 0;
	}
}

.search {
	margin-top: 0.5rem;
	display: flex;
	justify-content: space-between;
	align-items: center;
	font-size: 0.9rem;
}
</style>

<script setup lang="ts">
import { useRouter, } from 'vue-router'

const router = useRouter()
import imgUrl from '@/assets/img/diagram.svg'

const props = defineProps({
	result: Boolean,
})
const navigate = (() => {
	router.push('process')
})

</script>

<template lang="pug">
.q-ml-lg
	q-card
		.grey(v-if='!props.result') Превью BPMN схемы процесса
		q-img(v-else :src='imgUrl')

	.info(v-if="props.result == true"
		v-motion
		:initial="{ y: 20, opacity: 0 }"
		:enter="{ y: 0, opacity: 1 }"
		:delay='300'
		)
		q-icon(name="mdi-information-outline" color="primary" size="lg")
		div Проверьте диаграмму, насколько она соответствует вашим замыслам. Это стартовая точка вашего приложения. Вы сможете отредактировать ее позже. Если она вас устраивает, нажмите "Завершить". В противном случае, попробуйте еще раз.

	.text-center(v-if='props.result'
		v-motion
		:initial="{ y: 20, opacity: 0 }"
		:enter="{ y: 0, opacity: 1 }"
		:delay='400'
		)
		q-btn(color="primary" label="Завершить" @click="navigate") 

</template>

<style scoped lang="scss">
.q-card {
	min-height: 300px;
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 1rem;
}

.grey {
	color: #bbb;
}

.info {
	margin-top: 2rem;
	margin-bottom: .5rem;
	padding: 1rem;
	background: hsl(213 24% 78% / 1);
	display: grid;
	grid-template-columns: auto 1fr;
	justify-items: start;
	align-items: start;
	column-gap: 1rem;
	font-size: .8rem;
	border-radius: var(--rad);
}
</style>

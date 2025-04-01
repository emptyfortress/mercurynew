<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useKeys } from '@/stores/keys'

const mykeys = useKeys()

const isLoaded = ref(false)

const load = () => {
	setTimeout(() => {
		isLoaded.value = true
	}, 1500)
}

onMounted(() => {
	setTimeout(() => {
		isLoaded.value = true
	}, 1000)
})

const rows = [
	{
		id: 0,
		date: '2025-02-20',
		date1: '2025-01-20',
		author: 'Иванов И.И.',
		comment: 'Внеочередной',
	},
	{
		id: 1,
		date: '2025-02-21',
		date1: '2025-03-21',
		author: 'Сидоров А.А.',
	},
	{
		id: 2,
		date: '2025-02-22',
		date1: '2025-03-22',
		author: 'Петров П.П.',
		comment: 'За прошлый год',
	},
	{
		id: 3,
		date: '2025-02-23',
		date1: '2025-02-23',
		author: 'Васильев В.В.',
		comment: 'Учебный',
	},
	{
		id: 4,
		date: '2025-02-24',
		date1: '2025-03-24',
		author: 'Козлов Д.Д.',
	},
]
</script>

<template lang="pug">
.loading
	.ready(v-if='isLoaded')
		q-table(bordered
			flat
			:columns="mykeys.activeColumns"
			:rows="rows"
			hide-bottom
		)
		.water Образец

	q-markup-table(v-else)
		thead
			tr
				th.text-left()
					q-skeleton( type="text")
				th.text-right
					q-skeleton( type="text")
				th.text-right
					q-skeleton( type="text")
				th.text-right
					q-skeleton( type="text")
		tbody
			tr(v-for="n in 5" :key="n")
				td.text-right
					q-skeleton( type="text" width="50px")
				td.text-right
					q-skeleton( type="text" width="35px")
				td.text-right
					q-skeleton( type="text" width="65px")
				td.text-right
					q-skeleton( type="text" width="25px")

</template>

<style scoped lang="scss">
.loading {
	margin-top: 1rem;
}

.ready {
	position: relative;
}

.water {
	font-size: 6.5rem;
	font-weight: 600;
	position: absolute;
	transform-origin: center center;
	top: 9rem;
	left: 50%;
	transform: translateX(-50%) rotate(-15deg);
	z-index: 3;
	color: red;
	opacity: 0.1;
	line-height: 0;
}
:deep(.q-table th) {
	font-size: 0.7rem;
	font-weight: 400;
	border: 1px solid #fff;
}
:deep(.q-table thead tr) {
	height: 28px;
	background: #ebebebeb;
}
</style>

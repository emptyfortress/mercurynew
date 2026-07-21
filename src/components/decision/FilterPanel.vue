<script setup lang="ts">
import { ref } from 'vue'

const data = ref('folder')
const poisk = ref('')
const one = ref(false)
const three = ref(false)
const two = ref(0)
const four = ref(0)
</script>

<template lang="pug">
fieldset
	legend Источник данных представления
	.column.q-gutter-y-md
		q-radio(dense v-model="data" val="folder" label="Карточки текущей папки")
		div
			q-radio(dense v-model="data" val="query" label="Карточки, удовлетворяющие условиям запроса:")
			.row.items-center
				q-input.poisk(v-model="poisk" dense outlined)
					template(v-slot:append)
						q-btn(flat round dense icon="mdi-dots-horizontal" color="primary") 
						q-btn(flat round dense icon="mdi-close" color="primary") 

br
br
fieldset
	legend Глубина просмотра
	.grid
		q-checkbox(v-model='one' label='Подчиненных карточек:' dense)
		q-input.num(v-model="two" dense type='number' outlined)
		q-checkbox(v-model='three' label='Подчиненных папок:' dense)
		q-input.num(v-model="four" dense type='number' outlined)
</template>

<style lang="scss" scoped>
fieldset {
	border: 1px solid var(--my-border-color);
	padding: 1rem;
}
legend {
	padding: 0 0.5rem;
}
.poisk {
	margin-top: 0.5rem;
	width: 400px;
	margin-left: 2rem;
}
.grid {
	display: grid;
	grid-template-columns: 200px 100px;
	// justify-items: start;
	// align-items: stretch;
	column-gap: 1rem;
	row-gap: 0.5rem;
	.num {
		width: 80px;
	}
}
</style>

<script setup lang="ts">
import { ref } from 'vue'

const group = ref(['due'])
const options = ref([
	{ id: 0, label: 'Выделить просроченные', value: 'due', color: 'red' },
	{ id: 1, label: 'Выделить завершенные', value: 'fin', color: 'green' },
	{ id: 2, label: 'Выделить важные', value: 'imp', color: 'orange' },
])

const option2 = [
	{ label: 'Тревожный', color: 'red' },
	{ label: 'Положительный', color: 'green' },
	{ label: 'Внимание', color: 'blue' },
	{ label: 'Яркий', color: 'orange' },
]

const set = (item: any, e: string) => {
	item.color = e
}
</script>

<template lang="pug">
div
	q-list(dense)
		q-item(v-ripple v-for="item in options" :key='item.id' )
			q-item-section(side)
				q-checkbox(v-model="group" :val='item.value' dense)
			q-item-section
				q-item-label {{ item.label }}
			q-item-section(side)
				.square(:class="item.color" @click.stop)
					q-menu
						q-list
							q-item(clickable v-for="el in option2" :key="el.color" @click="set(item, el.color)" v-close-popup)
								q-item-section(side)
									.square(:class="el.color")
								q-item-section {{ el.label }}

</template>

<style scoped lang="scss">
.color {
	width: 20px;
	height: 20px;
	border: 1px solid #aaa;
}

.square {
	width: 20px;
	height: 20px;
	border: 1px solid #ccc;
	background: #fff;
	border-radius: 50%;

	&.red {
		background: red;
	}

	&.green {
		background: green;
	}

	&.blue {
		background: blue;
	}

	&.orange {
		background: orange;
	}
}
</style>

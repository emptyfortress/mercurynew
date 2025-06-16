<script setup lang="ts">
import { ref } from 'vue'

const group = ref(['one', 'two', 'three'])
const options = ref([
	{ id: 1, label: 'Просрочен незавершенный процесс', value: 'one', color: 'red' },
	{ id: 2, label: 'Просрочены задания в незавершенном процессе', value: 'two', color: 'orange' },
	{ id: 3, label: 'Просрочен  завершенный процесс', value: 'three', color: 'blue' },
	{ id: 0, label: 'Незавершенный процесс', value: 'four', color: 'green' },
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
q-list(dense)
	q-item(v-ripple v-for="item in options" :key='item.id' )
		q-item-section(side)
			q-checkbox(v-model="group" :val='item.value' dense size="sm")
		q-item-section
			q-item-label(:class='item.color') {{ item.label }}
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
.q-item {
	text-align: left;
	margin-left: 0.5rem;
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
.q-item__label {
	&.red {
		color: red;
		font-weight: 600;
	}
	&.orange {
		color: $orange-6;
		font-weight: 600;
	}
	&.blue {
		color: $blue-9;
	}
	&.green {
		color: $teal-7;
	}
}
</style>

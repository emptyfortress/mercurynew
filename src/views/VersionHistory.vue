<script setup lang="ts">
import { ref } from 'vue'

const list1 = ref([
	{ id: 0, label: 'label1' },
	{ id: 1, label: 'label2' },
	{ id: 2, label: 'label3' },
])

const list2 = ref([{ id: 3, label: 'label4' }])
</script>

<template lang="pug">
q-page(padding)
	.cont()
		.hd История изменений приложения
		.grid
			.constructor
				.hd1
					img.q-mr-sm(src="@/assets/img/kp-favicon.svg", width="18" height="18")
					|Конструктор
				q-list
					q-item(clickable v-for="item in list1" :key="item.id")
						q-item-section(side)
							q-icon(name="mdi-close" color="primary")
						q-item-section {{ item.label }}
			.server
				.hd1.lin
					q-icon.ic(name="mdi-server-network-outline")
					|DV-test
					q-icon.q-ml-sm(name="mdi-chevron-down" color="primary")
				q-list
					q-item(clickable v-for="item in list2" :key="item.id")
						q-item-section(side)
							q-icon(name="mdi-close" color="primary")
						q-item-section {{ item.label }}


</template>

<style scoped lang="scss">
.cont {
	max-width: 1400px;
	margin: 0 auto;
}
.current {
	background: var(--selection);
}

.hd {
	font-size: 1.3rem;
	text-align: center;
}
.hd1 {
	font-size: 1.1rem;
	text-align: center;
	&.lin {
		color: $primary;
		cursor: pointer;
		.ic {
			font-size: 1.6rem;
			margin-right: 0.5rem;
			color: $primary;
		}
	}
}
.grid {
	margin-top: 1rem;
	display: grid;
	grid-template-columns: 1fr 1fr;
	column-gap: 1rem;
	row-gap: 0.5rem;
	.server,
	.constructor {
		padding: 1rem;
		background: #ffffff77;
	}
}
</style>

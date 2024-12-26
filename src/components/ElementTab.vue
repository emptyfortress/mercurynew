<script setup lang="ts">
// import IconLayout from '@/components/icons/IconLayout.vue'
import IconLayout1 from '@/components/icons/IconLayout1.vue'
import IconLayout2 from '@/components/icons/IconLayout2.vue'
import IconLayout3 from '@/components/icons/IconLayout3.vue'
import IconLayout4 from '@/components/icons/IconLayout4.vue'
import IconLayout5 from '@/components/icons/IconLayout5.vue'
import IconLayout6 from '@/components/icons/IconLayout6.vue'

const layouts = [
	{
		id: 0,
		label: '1 колонка на всю ширину',
		icon: IconLayout1
	},
	{
		id: 5,
		label: '1 колонка фиксированной ширины',
		icon: IconLayout6
	},
	{
		id: 1,
		label: '2 колонки по 50% каждая',
		icon: IconLayout2
	},
	{
		id: 2,
		label: '3 колонки по 33% каждая',
		icon: IconLayout3
	},
	{
		id: 3,
		label: '2 колонки, одна фиксирована',
		icon: IconLayout4
	},
	{
		id: 4,
		label: '2 колонки 3/7',
		icon: IconLayout5
	},
]
</script>

<template lang="pug">
q-list(bordered separator)
	q-item(v-for="item in layouts" :key="item.id" :draggable="true")
		q-item-section(avatar)
			component.big(:is="item.icon")
		q-item-section {{ item.label }}
</template>

<style scoped lang="scss">
.q-list {
	text-align: left;
}

.q-item {
	cursor: all-scroll;
	color: $secondary;

	&:hover {
		color: $primary;
		// background: var(--dvblue);
		background: #efefef;
	}

}

.big {
	font-size: 3rem;
}
</style>

<script setup lang="ts">
import frame1 from '@/assets/img/frame1.png'
import frame2 from '@/assets/img/frame2.png'
import frame3 from '@/assets/img/frame3.png'
import frame4 from '@/assets/img/frame4.png'
import frame5 from '@/assets/img/frame5.png'
import { useKeys } from '@/stores/keys'

const mykeys = useKeys()

const colors = [
	{ label: 'По умолчанию', val: 0, pic: frame3 },
	{ label: 'Контраст', val: 1, pic: frame1 },
	{ label: 'Мексика', val: 2, pic: frame2 },
	{ label: 'Лето', val: 3, pic: frame4 },
	{ label: 'Водный мир', val: 4, pic: frame5 },
]
</script>

<template lang="pug">
q-list(dense)
	q-item(tag='label' v-for="item in colors" :key='item.val')
		q-item-section(side)
			q-radio(v-model="mykeys.theme" :val='item.val' dense)
		q-item-section {{ item.label }}
		q-item-section(side)
			q-img(:src='item.pic' width='100px' height='34px' fit='cover' position='0 -8px')
</template>

<style scoped lang="scss">
.q-item {
	background: #fff;
	text-align: left;
	margin-left: 0.5rem;
}
</style>

<script setup lang="ts">
import { ref, markRaw } from 'vue'
import IconApp from '@/components/icons/IconApp.vue'
import IconTravel from '@/components/icons/IconTravel.vue'
import IconBeach from '@/components/icons/IconBeach.vue'
import IconLetter from '@/components/icons/IconLetter.vue'
import IconPresentation from '@/components/icons/IconPresentation.vue'
import IconMicrophone from '@/components/icons/IconMicrophone.vue'
import IconPrinter from '@/components/icons/IconPrinter.vue'
import IconPic from '@/components/icons/IconPic.vue'

import Icon1 from '@/components/icons/TablerHexagonNumber1.vue'
import Icon2 from '@/components/icons/TablerHexagonNumber2.vue'
import Icon3 from '@/components/icons/TablerHexagonNumber3.vue'
import Icon4 from '@/components/icons/TablerHexagonNumber4.vue'
import Icon5 from '@/components/icons/TablerHexagonNumber5.vue'
import Icon6 from '@/components/icons/TablerHexagonNumber6.vue'
import Icon7 from '@/components/icons/TablerHexagonNumber7.vue'
import Icon8 from '@/components/icons/TablerHexagonNumber8.vue'
import Icon9 from '@/components/icons/TablerHexagonNumber9.vue'

const IconApp1 = markRaw(IconApp)
const IconTravel1 = markRaw(IconTravel)
const IconBeach1 = markRaw(IconBeach)
const IconLetter1 = markRaw(IconLetter)
const IconPresentation1 = markRaw(IconPresentation)
const IconMicrophone1 = markRaw(IconMicrophone)
const IconPrinter1 = markRaw(IconPrinter)
const IconPic1 = markRaw(IconPic)

const Icon1Raw = markRaw(Icon1)
const Icon2Raw = markRaw(Icon2)
const Icon3Raw = markRaw(Icon3)
const Icon4Raw = markRaw(Icon4)
const Icon5Raw = markRaw(Icon5)
const Icon6Raw = markRaw(Icon6)
const Icon7Raw = markRaw(Icon7)
const Icon8Raw = markRaw(Icon8)
const Icon9Raw = markRaw(Icon9)

const icons = ref([
	{ id: 0, selected: true, pic: IconApp1 },
	{ id: 1, selected: false, pic: IconTravel1 },
	{ id: 2, selected: false, pic: IconBeach1 },
	{ id: 3, selected: false, pic: IconLetter1 },
	{ id: 4, selected: false, pic: IconMicrophone1 },
	{ id: 5, selected: false, pic: IconPrinter1 },
	{ id: 6, selected: false, pic: IconPresentation1 },
	{ id: 7, selected: false, pic: IconPic1 },

	{ id: 8, selected: false, pic: Icon1Raw },
	{ id: 9, selected: false, pic: Icon2Raw },
	{ id: 10, selected: false, pic: Icon3Raw },
	{ id: 11, selected: false, pic: Icon4Raw },
	{ id: 12, selected: false, pic: Icon5Raw },
	{ id: 13, selected: false, pic: Icon6Raw },
	{ id: 14, selected: false, pic: Icon7Raw },
	{ id: 15, selected: false, pic: Icon8Raw },
	{ id: 16, selected: false, pic: Icon9Raw },
])

const select = (icon: any) => {
	selectedIcon.value = icon.pic
	icons.value.map((item) => (item.selected = false))
	icon.selected = true
}
const selectedIcon = ref(IconApp1)
</script>

<template lang="pug">
.icon
	label Иконка:
	component.ic(:is='selectedIcon')
	q-menu
		q-list.ii
			q-item(clickable,
				v-for="icon in icons",
				:key='icon.id',
				@click='select(icon)'
				v-close-popup
				:class='{selected: icon.selected}')
				q-item-section
					component(:is='icon.pic')
</template>

<style scoped lang="scss">
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
.q-menu {
	z-index: 5;
}
</style>

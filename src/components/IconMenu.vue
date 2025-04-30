<script setup lang="ts">
import { ref } from 'vue'
import { allIcons } from '@/utils/icons'

const props = defineProps<{
	icon: any
}>()

const icons = ref(allIcons)

const emit = defineEmits(['select'])
const select = (icon: any) => {
	icons.value.map((item) => (item.selected = false))
	icon.selected = true
	emit('select', icon.pic)
}
</script>

<template lang="pug">
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
.ii {
	display: grid;
	grid-template-columns: repeat(8, auto);
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

<script setup lang="ts">
import { ref, watch } from 'vue'
import { allAvatars } from '@/utils/avatars'

const props = defineProps({
	icon: {
		type: String,
		default: '',
	},
})

const icons = ref(allAvatars)
const emit = defineEmits(['select'])
const selectedIcon = ref<string>('')

const isSelected = (e: string) => {
	return selectedIcon.value === e ? 'selected' : ''
}

watch(
	() => props.icon,
	(val) => (selectedIcon.value = val),
	{ immediate: true }
)

const select = (icon: any) => {
	selectedIcon.value = icon.name
	emit('select', icon.pic) // передаём URL svg
}
</script>

<template lang="pug">
q-menu
	q-list.ii
		q-item(
			clickable
			v-for="icon in icons"
			:key="icon.id"
			@click="select(icon)"
			v-close-popup
			:class="{ selected: isSelected(icon.name) }"
		)
			q-item-section
				q-img.ava(:src="icon.pic", :alt="icon.name")
</template>

<style scoped lang="scss">
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
.ava {
	width: 48px;
	height: 48px;
	object-fit: contain;
	border-radius: 50%;
}
</style>

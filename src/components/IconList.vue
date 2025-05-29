<script setup lang="ts">
import { ref, markRaw } from 'vue'
import IconMenu from '@/components/IconMenu.vue'

const IconApp1 = markRaw(IconApp)

const emit = defineEmits(['select'])

const select = (icon: any) => {
	selectedIcon.value = icon
	emit('select', selectedIcon.value)
}
const selectedIcon = ref('src/assets/img/avatar/avatar5.svg')
const temp = ref('src/assets/img/avatar/avatar5.svg')
</script>

<template lang="pug">
.icon
	label Иконка:
	img.ic(:src='selectedIcon')
	IconMenu(@select='select' :icon='temp')

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
</style>

<script setup lang="ts">
import { ref, markRaw } from 'vue'
import IconMenu from '@/components/IconMenu.vue'
import MdiApplicationBracesOutline from '@/components/icons/MdiApplicationBracesOutline.vue'

const MdiApplicationBracesOutline1 = markRaw(MdiApplicationBracesOutline)

const emit = defineEmits(['select'])

const select = (icon: any) => {
	selectedIcon.value = icon
	emit('select', selectedIcon.value)
}
const selectedIcon = ref(MdiApplicationBracesOutline1)
const temp = ref('MdiApplicationBracesOutline')
</script>

<template lang="pug">
.icon
	label Иконка:
	component.ic(:is='selectedIcon')
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

<script setup lang="ts">
import { ref, markRaw } from 'vue'
import IconMenu from '@/components/IconMenu.vue'
import IconApp from '@/components/icons/IconApp.vue'

const IconApp1 = markRaw(IconApp)

const emit = defineEmits(['select'])

const select = (icon: any) => {
	selectedIcon.value = icon
	emit('select', selectedIcon.value)
}
const selectedIcon = ref(IconApp1)
const temp = ref('IconApp')
</script>

<template lang="pug">
.icon
	label Иконка:
	component.ic(:is='selectedIcon')
	// IconMenu(@select='select' :icon='temp')

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

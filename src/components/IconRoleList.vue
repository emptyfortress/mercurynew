<script setup lang="ts">
import { ref, markRaw } from 'vue'
import IconMenuRole from '@/components/IconMenuRole.vue'

const emit = defineEmits(['select'])

const avatar = ref('avatar1')
const select = (icon: any) => {
	avatar.value = icon
	emit('select', icon)
}

const getImageUrl = (src?: string) => {
	if (!src) return ''
	if (src.includes('/avatar/')) return src
	return new URL(`../assets/img/${src}.svg`, import.meta.url).href
}
</script>

<template lang="pug">
.icon
	label Иконка:
	q-img.av(:src='getImageUrl(avatar)')
	IconMenuRole(@select='select' :avatar='avatar')

</template>

<style scoped lang="scss">
.icon {
	margin-left: 0.5rem;
	display: flex;
	gap: 0.5rem;
	align-items: center;
	.av {
		cursor: pointer;
		width: 50px;
		height: 50px;
		border-radius: 0.5rem;
	}
}
</style>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import IconMenuRole from '@/components/IconMenuRole.vue'

const emit = defineEmits(['select'])
const avatar = ref('avatar7')

const getImageUrl = (name?: string): string => {
	return new URL(`../assets/img/avatar/${name}.svg`, import.meta.url).href
}

const select = (name: string) => {
	avatar.value = name
	emit('select', name)
}
onMounted(() => {
	emit('select', avatar.value)
})
</script>

<template lang="pug">
.icon
  label Иконка:
  .av
    img(:src='getImageUrl(avatar)')
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
		img {
			width: 48px;
		}
	}
}
</style>

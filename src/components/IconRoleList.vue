<script setup lang="ts">
import { ref, markRaw } from 'vue'
import IconMenuRole from '@/components/IconMenuRole.vue'

const emit = defineEmits(['select'])

const avatar = ref('src/assets/img/avatar/avatar5.svg')
const select = (icon: any) => {
	avatar.value = icon
	emit('select', icon)
}
</script>

<template lang="pug">
.icon
	label Иконка:
	.av
		img(:src='avatar')
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

<script setup lang="ts">
import { allAvatars } from '@/utils/avatars'

const props = defineProps({
	avatar: {
		type: String,
		default: '',
	},
})

const emit = defineEmits(['select'])

const isSelected = (name: string) => (props.avatar === name ? 'selected' : '')

const select = (icon: any) => {
	emit('select', icon.name) // ⬅️ emit только имя
}

const icons = allAvatars
</script>

<template lang="pug">
q-menu
  q-list.ii
    q-item(
      clickable
      v-for="item in icons"
      :key="item.id"
      @click="select(item)"
      v-close-popup
      :class="{ selected: isSelected(item.name) }"
    )
      q-item-section
        q-img.ava(:src="item.url")
</template>

<style scoped lang="scss">
.ii {
	display: grid;
	grid-template-columns: repeat(4, auto);
	font-size: 1.8rem;
}
.selected {
	background: var(--selection);
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

<script setup lang="ts">
import { ref } from 'vue'
import { useDraggable } from '@vueuse/core'
import { useControl } from '@/stores/controls'
// import { useLayoutStore } from '@/stores/layout'

// const lstore = useLayoutStore()
//
const el = ref<HTMLElement | null>(null)
const { x, y, style } = useDraggable(el, {
	initialValue: { x: 570, y: 148 },
})

const preview = () => {
	const url = 'https://google.com'
	window.open(url, '_blank')!.focus()
}

const control = useControl()

const removeAll = (() => {
	control.removeAll()
})
</script>

<template lang="pug">

.toolbar(ref="el" :style="style" style="position: fixed")
	.square.q-mt-sm(@click='')
		q-icon(name="mdi-cellphone" size='18px') 
		q-tooltip.bg-primary(anchor="center right" self="center left") Телефон
	.square(@click='' )
		q-icon(name="mdi-tablet" size='18px') 
		q-tooltip.bg-primary(anchor="center right" self="center left") Планшет
	.square(@click='' )
		q-icon(name="mdi-monitor" size='18px') 
		q-tooltip.bg-primary(anchor="center right" self="center left") Десктоп
	q-separator.q-mt-sm
	.square(@click='preview' style="padding-top: 5px;")
		q-icon(name="mdi-eye" size='18px') 
		q-tooltip.bg-primary(anchor="center right" self="center left") Превью
	q-separator.q-mb-sm
	.square(@click='removeAll')
		q-icon(name="mdi-trash-can-outline" size='18px' color="negative") 
		q-tooltip.bg-negative(anchor="center right" self="center left") Очистить форму
</template>

<style scoped lang="scss">
.square {
	background: #fefefe;
	text-align: center;
	margin-bottom: 1px;
	cursor: pointer;

	.q-icon {
		transform: translateY(-2px);
		color: $secondary;
	}

	&.selected {
		background: $primary;

		.q-icon {
			color: #fff;
		}
	}
}

.toolbar {
	padding: 2px;
	width: 32px;
	background: #fff;
	border: 1px solid #ccc;
	box-shadow: var(--shad0);

	&:hover {
		box-shadow: var(--shad);
	}
}
</style>

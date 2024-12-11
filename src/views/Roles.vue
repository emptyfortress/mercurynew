<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { Container, Draggable } from 'vue3-smooth-dnd'
import { applyDrag } from '@/utils/utils'
import profile from '@/assets/img/profile.svg'

const roles = ref([
	{
		id: 0,
		label: 'Инициатор'
	},
	{
		id: 1,
		label: 'Руководитель'
	},
	{
		id: 2,
		label: 'Кадровик'
	},

])

const onDrop = (dropResult: number) => {
	roles.value = applyDrag(roles.value, dropResult)
}

const expanded = ref<boolean>(false)

const expand = (item: any) => {
	const state = Flip.getState('.item')
	expanded.value = !expanded.value
	item.expand = !item.expand
	nextTick(() => {
		Flip.from(state, {
			duration: 0.4,
			ease: 'power3.inOut',
			absolute: true,
			onEnter: (elements) =>
				gsap.fromTo(
					elements,
					{ opacity: 0 },
					{ opacity: 1, duration: 0.6, ease: 'linear', delay: 0.2 }
				),
			onLeave: (elements) =>
				gsap.fromTo(elements, { opacity: 1 }, { opacity: 0, duration: 0.2, ease: 'linear' }),
		})
	})
}

const calcClass = (item: App) => {
	if (expanded.value == true && item.expand == true) return 'active'
	if (expanded.value == true && item.expand == false) return 'inactive'
	if (item.group == true) return 'group'
	else return ''
}
</script>

<template lang="pug">
q-page(padding)
	.header Роли
	Container(@drop="onDrop" orientation='horizontal' group-name='column' :tag="{ value: 'div', props: { class: 'list' } }")
		Draggable(v-for="(item, index) in roles"
			:key="item.id")
			.text-center
				.item(
					v-motion
					:initial="{ y: 100, opacity: 0 }"
					:enter='{ y: 0, opacity: 1, transition: { delay: 300 + (100 * index) } }'
					@click='expand(item)'
					)
					svg(viewBox="0 0 81 98" fill="none" xmlns="http://www.w3.org/2000/svg")
						path(d="M14.2 42.3C14.8 44.3 15.9 48.2 18.3 50.5C20.1 57.4 25.5 65.3 34.1 68.3C36.2 69 38.3 69.4 40.5 69.4C42.7 69.4 44.9 69 47 68.3C55.6 65.2 61 57.4 62.8 50.6C65.2 48.3 66.3 44.4 66.9 42.4C67.8 39.2 68.8 34.5 66.3 31.2C66.2 31.1 66.1 30.9 66 30.8C67.4 22.2 66.4 15.7 63.1 11.5C61.5 9.5 59.8 8.5 58.4 7.9C57.3 6.5 55.4 4.6 52.5 3C49.1 1 45.3 0 41.1 0C40.4 0 39.7 2.23517e-08 38.9 0.1C37 0.2 35.2 0.6 33.4 1.2C31.4 1.9 29.4 2.9 27.6 4.2C25.5 5.5 23.6 7.1 21.9 8.9C18.6 12.3 16.4 16.1 15.4 20.3C14.6 23.4 14.6 26.8 15.3 30.8C15.2 30.9 15.1 31 15 31.2C12.3 34.4 13.3 39.1 14.2 42.3ZM20.4 33.3C20.5 33.3 20.6 33.3 20.7 33.3C20.7 33.3 22.2 13.4 38.3 20.3C46.7 23.9 53 23.7 57 22.8C62.1 26.3 60.6 32.2 60.3 33.2V33.3C60.4 33.3 60.5 33.3 60.6 33.3C62.3 33.3 64 34.6 62.1 41C60.7 46 59.4 47.4 58.4 47.5C57.5 53.5 52.7 61 45.3 63.7C43.7 64.3 42.1 64.5 40.5 64.5C38.9 64.5 37.3 64.2 35.7 63.7C28.1 61.1 23.5 53.5 22.6 47.5C21.6 47.4 20.3 46 18.9 41C17 34.6 18.7 33.3 20.4 33.3Z" fill="currentColor")
						path(d="M61 63.8C57.9 67.5 53.8 70.8 48.6 72.7C46 73.6 43.3 74.1 40.5 74.1C37.8 74.1 35.1 73.6 32.5 72.7C27.2 70.8 23.1 67.6 20 63.8C15.6 66.1 8 70.5 0 76.3C9.1 88.9 23.8 97.1 40.5 97.1C57.2 97.1 71.9 88.9 81 76.4C73.1 70.5 65.4 66.2 61 63.8Z" fill="currentColor")
				div {{ item.label }}

		q-btn.q-ml-xl(round icon="mdi-plus" color="primary" @click="") 

</template>

<style scoped lang="scss">
.header {
	font-size: 1.5rem;
	text-align: center;
}

.smooth-dnd-container.horizontal.list {
	display: flex;
	align-items: center;
	flex-wrap: wrap;
}

.item {
	width: 150px;
	height: 150px;
	border-radius: 50%;
	text-align: center;

	svg {
		color: hsl(199 23% 69% / 1);
	}
}

.add {
	width: 80px;
	height: 80px;
	border-radius: 50%;
	background: #fff;
	margin-top: -1rem;
	margin-left: 5rem;
	background: hsl(199 23% 69% / 1);
}
</style>

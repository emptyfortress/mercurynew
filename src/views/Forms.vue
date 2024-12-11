<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { Container, Draggable } from 'vue3-smooth-dnd'
import { applyDrag } from '@/utils/utils'

const forms = ref([
	{
		id: 0,
		label: 'Создание'
	},
	{
		id: 1,
		label: 'Редактирование'
	},
	{
		id: 2,
		label: 'Просмотр'
	},

])

const onDrop = (dropResult: number) => {
	forms.value = applyDrag(forms.value, dropResult)
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
	.header Формы
	Container(@drop="onDrop" orientation='horizontal' group-name='column' :tag="{ value: 'div', props: { class: 'list' } }")
		Draggable(v-for="(item, index) in forms"
			:key="item.id")
			.text-center
				.item(
					v-motion
					:initial="{ y: 100, opacity: 0 }"
					:enter='{ y: 0, opacity: 1, transition: { delay: 300 + (100 * index) } }'
					@click='expand(item)'
					:class="calcClass(item)"
					)
					svg(xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24")
						path(fill="currentColor" d="M12.308 16.25q-.343 0-.576-.232t-.232-.576V8.558q0-.343.232-.576t.576-.232h6.884q.344 0 .576.232t.232.576v6.884q0 .344-.232.576t-.576.232zm.192-1H19v-6.5h-6.5zM4.5 20q-.213 0-.356-.144T4 19.499t.144-.356T4.5 19h15q.213 0 .356.144t.144.357t-.144.356T19.5 20zm0-3.75q-.213 0-.356-.144T4 15.749t.144-.356t.356-.143h4.116q.212 0 .356.144t.144.357t-.144.356t-.356.143zm0-3.75q-.213 0-.356-.144T4 11.999t.144-.356t.356-.143h4.116q.212 0 .356.144t.144.357t-.144.356t-.356.143zm0-3.75q-.213 0-.356-.144T4 8.249t.144-.356t.356-.143h4.116q.212 0 .356.144t.144.357t-.144.356t-.356.143zM4.5 5q-.213 0-.356-.144T4 4.499t.144-.356T4.5 4h15q.213 0 .356.144t.144.357t-.144.356T19.5 5z")
				div {{ item.label }}

		q-btn.q-ml-xl(round icon="mdi-plus" color="primary" @click="action") 
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
	height: 180px;
	border-radius: .5rem;
	text-align: center;

	svg {
		color: hsl(199 23% 69% / 1);
	}
}
</style>

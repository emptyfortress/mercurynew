<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { Container, Draggable } from 'vue3-smooth-dnd'
import { applyDrag } from '@/utils/utils'
import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'
import cadrovik from '@/assets/img/cadrovik.png'

gsap.registerPlugin(Flip)

const forms = ref([
	{
		id: 1,
		label: 'Создание',
		expand: false,
		avatar: 'create'
	},
	{
		id: 2,
		label: 'Редактирование',
		expand: false,
		avatar: 'edit'
	},
	{
		id: 3,
		label: 'Просмотр',
		expand: false,
		avatar: 'view'
	},

])

const onDrop = (dropResult: number) => {
	forms.value = applyDrag(forms.value, dropResult)
}

const expanded = ref<boolean>(false)

const expand = async (item: any) => {
	const state = Flip.getState('.item1, .img')
	expanded.value = !expanded.value
	item.expand = !item.expand
	await nextTick(() => {
		Flip.from(state, {
			duration: 0.4,
			ease: 'power3.inOut',
			targets: '.item1, .img',
			absolute: true,
			absoluteOnLeave: true,
			nested: true,

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

const calcClass = (item: any) => {
	if (expanded.value == true && item.expand == true) return 'active'
	if (expanded.value == true && item.expand == false) return 'inactive'
	else return ''
}

const getImageUrl = (name: string) => new URL(`../assets/img/${name}.svg`, import.meta.url).href
</script>

<template lang="pug">
q-page(padding)
	.header Формы
	Container(@drop="onDrop" orientation='horizontal' group-name='column' :tag="{ value: 'div', props: { class: 'list' } }")
		Draggable(v-for="(item, index) in forms"
			:key="item.id")
			.text-center
				.item1(
					v-motion
					:initial="{ y: 100, opacity: 0 }"
					:enter='{ y: 0, opacity: 1, transition: { delay: 300 + (100 * index) } }'
					@click='expand(item)'
					:class="calcClass(item)"
					)

					q-img.img(:src='getImageUrl(item.avatar)')
					.hg {{ item.label }}

					.content(v-if='item.expand'
						v-motion
						:initial="{ x: 100, opacity: 0 }"
						:enter="{ x: 0, opacity: 1, transition: { type: 'spring', stiffness: 500, damping: 30, delay: 300 } }")
						br
						// img(:src='cadrovik')


		q-btn.q-ml-xl(v-if='!expanded' round icon="mdi-plus" color="primary" @click=""
			v-motion
			:initial="{ y: 20, opacity: 0 }"
			:enter='{ y: 0, opacity: 1, transition: { delay: 800 } }'
			) 

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

.item1 {
	width: 150px;
	// height: 150px;
	text-align: center;
	margin: 0.5rem;
	cursor: pointer;
	padding: 1rem;
	position: relative;
	background: #fff;

	.img {
		width: 120px;
		margin-bottom: .5rem;
	}

	&:hover {
		border: 1px solid #ccc;
		box-shadow: 2px 2px 6px rgba($color: #000000, $alpha: 0.2);
	}

	&.active {
		position: fixed;
		height: 70vh;
		width: 900px;
		margin: 0 auto;
		left: 60px;
		right: 0;
		border: 1px solid #ccc;
		box-shadow: 2px 2px 6px rgba($color: #000000, $alpha: 0.2);
		text-align: left;

		.img {
			width: 220px;
		}
	}

	&.inactive {
		display: none;
	}

	img {
		user-select: none;
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

.list {
	display: flex;
}
</style>

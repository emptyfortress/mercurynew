<script setup lang="ts">
import { ref, nextTick, watch } from 'vue'
import { Container, Draggable } from 'vue3-smooth-dnd'
import { applyDrag } from '@/utils/utils'
import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'
import cadrovik from '@/assets/img/cadrovik.png'
import { useQuasar } from 'quasar'
import AddButton from '@/components/common/AddButton.vue'
import Trash from '@/components/common/Trash.vue'

gsap.registerPlugin(Flip)

const roles = ref([
	{
		id: 1,
		label: 'Инициатор',
		expand: false,
		avatar: 'avatar1'
	},
	{
		id: 2,
		label: 'Руководитель',
		expand: false,
		avatar: 'avatar2'
	},
	{
		id: 3,
		label: 'Кадровик',
		expand: false,
		avatar: 'avatar3'
	},
])

const $q = useQuasar()
const onDrop = (dropResult: number) => {
	roles.value = applyDrag(roles.value, dropResult)
	dragging.value = false
}

watch(
	() => roles.value.length,
	(newval, oldval) => {
		if (oldval > newval) {
			$q.notify({
				message: 'Роль удалена',
				color: 'negative',
				icon: 'mdi-check-bold',
				actions: [
					{ label: 'Отмена', color: 'white', handler: () => { /* ... */ } }
				]
			})
		}
	})

const expanded = ref<boolean>(false)

const expand = (item: any) => {
	const state = Flip.getState('.item1')
	expanded.value = !expanded.value
	item.expand = !item.expand
	nextTick(() => {
		Flip.from(state, {
			duration: 0.4,
			ease: 'power3.inOut',
			targets: '.item1',
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

const dragging = ref(false)

const onDragLeave = (() => {
	dragging.value = true
})
const onDragEnter = (() => {
	dragging.value = false
})

const create = ((e: string) => {
	let tmp = {
		id: +new Date(),
		label: e,
		expand: false,
		avatar: 'avatar1'
	}
	roles.value.push(tmp)
	setTimeout(() => {
		$q.notify({
			icon: 'mdi-check-bold',
			color: 'positive',
			message: 'Добавлена роль'
		})
	}, 1200)
})
</script>

<template lang="pug">
q-page(padding)
	.header Роли
	Container(@drop="onDrop"
		@drag-leave='onDragLeave'
		@drag-enter='onDragEnter'
		orientation='horizontal'
		group-name='column'
		:remove-on-drop-out='true'
		:tag="{ value: 'div', props: { class: 'list' } }")
		Draggable(v-for="(item, index) in roles"
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
						img(:src='cadrovik')

		AddButton(v-if='!expanded' @create='create' mode="role")
	Trash(:dragging="dragging")

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
	height: 150px;
	border-radius: .5rem;
	text-align: center;
	margin: 0.5rem;
	cursor: pointer;
	padding: 1rem;
	position: relative;
	background: #fff;

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
	}

	&.inactive {
		display: none;
	}

	.img {
		width: 100px;
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

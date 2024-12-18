<script setup lang="ts">
import { ref, nextTick, watch } from 'vue'
import { Container, Draggable } from 'vue3-smooth-dnd'
import { applyDrag } from '@/utils/utils'
import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'
import { useQuasar } from 'quasar'
import AddButton from '@/components/common/AddButton.vue'
import Trash from '@/components/common/Trash.vue'

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

const $q = useQuasar()
const onDrop = (dropResult: number) => {
	forms.value = applyDrag(forms.value, dropResult)
	dragging.value = false
}

watch(
	() => forms.value.length,
	(newval, oldval) => {
		if (oldval > newval) {
			$q.notify({
				message: 'Форма удалена',
				color: 'negative',
				icon: 'mdi-check-bold',
				actions: [
					{ label: 'Отмена', color: 'white', handler: () => { /* ... */ } }
				]
			})
		}
	})

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
		avatar: 'edit'
	}
	forms.value.push(tmp)
	setTimeout(() => {
		$q.notify({
			icon: 'mdi-check-bold',
			color: 'positive',
			message: 'Добавлена форма'
		})
	}, 1200)
})
</script>

<template lang="pug">
q-page(padding)
	.header Формы
	Container(@drop="onDrop"
		@drag-leave='onDragLeave'
		@drag-enter='onDragEnter'
		orientation='horizontal'
		group-name='column'
		:remove-on-drop-out='true'
		:tag="{ value: 'div', props: { class: 'list' } }")
		Draggable(v-for="(item, index) in forms"
			:key="item.id")
			.text-center
				.item1(
					v-motion
					:initial="{ scale: 0, opacity: 0 }"
					:enter='{ scale: 1, opacity: 1, transition: { delay: 300  } }'
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
						.text-h6.text-center Здесь свойства формы
						// img(:src='cadrovik')


		AddButton(v-if='!expanded' @create='create' mode="form")
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

.trash {
	position: fixed;
	bottom: 6rem;
	left: 50%;
	font-size: 3rem;
	color: darkred;
	transform: translateX(-50%);
	vertical-align: middle;
	text-align: center;
	line-height: 1.0;

	label {
		display: block;
		font-size: 1rem;
	}

}
</style>

<script setup lang="ts">
import { ref, nextTick, watch, onMounted } from 'vue'
import { Container, Draggable } from 'vue3-smooth-dnd'
import { applyDrag } from '@/utils/utils'
import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'
import { useApps } from '@/stores/apps'
import AddButton from '@/components/common/AddButton.vue'
import Trash from '@/components/common/Trash.vue'
import { useQuasar } from 'quasar'
import AppPreview from '@/components/AppPreview.vue'
import GroupPreview from '@/components/GroupPreview.vue'
import forum from '@/assets/img/forum1.png'
import newspapers from '@/assets/img/newspapers.png'

const tapes = defineModel<App[]>('tapes')

tapes.value?.map((item) => (item.expand = false))

gsap.registerPlugin(Flip)

const $q = useQuasar()
const onDrop = (dropResult: number) => {
	tapes.value = applyDrag(tapes.value, dropResult)
	dragging.value = false
}

const expanded = ref<boolean>(false)

const expand = (item: any) => {
	const state = Flip.getState('.item, .group')
	item.expand = !item.expand
	expanded.value = !expanded.value
	nextTick(() => {
		Flip.from(state, {
			duration: 0.4,
			ease: 'power3.inOut',
			targets: '.item, .group',
			// absolute: true,
			// absoluteOnLeave: true,
			// nested: true,

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

const myapps = useApps()


const emit = defineEmits(['create'])
const create = ((e: string) => {
	emit('create', e)
})

const dragging = ref(false)

const onDragLeave = (() => {
	dragging.value = true
})
const onDragEnter = (() => {
	dragging.value = false
})

watch(
	() => tapes.value?.length,
	(newval, oldval) => {
		if (oldval && newval && oldval > newval && !myapps.grouping) {
			$q.notify({
				message: 'Приложение удалено',
				color: 'negative',
				icon: 'mdi-check-bold',
				actions: [
					{ label: 'Отмена', color: 'white', handler: () => { /* ... */ } }
				]
			})
		}
		if (oldval && newval && oldval > newval && myapps.grouping) {
			$q.notify({
				message: 'Группа создана',
				color: 'positive',
				icon: 'mdi-check-bold',
				actions: [
					{ label: 'Отмена', color: 'white', handler: () => { /* ... */ } }
				]
			})
		}
	})

const calcClass = (item: any) => {
	if (expanded.value && item.expand) return 'active'
	if (expanded.value && !item.expand) return 'inactive'
	else return ''
}

</script>

<template lang="pug">
div
	Container(@drop="onDrop"
		@drag-leave='onDragLeave'
		@drag-enter='onDragEnter'
		orientation='horizontal'
		group-name='column'
		:remove-on-drop-out='true'
		:tag="{ value: 'div', props: { class: 'list' } }")

		Draggable(v-for="(item, index) in tapes"
			:key="item.id")

			.item(v-if="item.group == 1"
				v-motion
				:initial="{ scale: 0, opacity: 0 }"
				:enter='{ scale: 1, opacity: 1, transition: { delay: 300 + 100 * index } }'
				@click='expand(item)'
				:class="calcClass(item)"
				)
				.hg {{ item.label }}
				q-img.myicon(:src='item.pic' fit='contain' height="100px" width='100px')

				AppPreview(v-if='expanded && item.group == 1' :item='item')

			.group(v-if="item.group > 1"
				v-motion
				:initial="{ scale: 0, opacity: 0 }"
				:enter='{ scale: 1, opacity: 1, transition: { delay: 300 + 100 * index } }'
				@click='expand(item)'
				:class="calcClass(item)"
				)
				template(v-if='!expanded')
					.hg1 Приложения отдела маркетинга
					.img
						q-img(:src='newspapers' fit='contain' height="32px" width='32px')
						q-img(:src='forum' fit='contain' height="32px" width='32px')

				div(v-if='expanded')
					.zag(
						v-motion
						:initial="{ y: 30, opacity: 0 }"
						:enter='{ y: 0, opacity: 1, transition: { delay: 300 } }'
						) Приложения отдела маркетинга
					GroupPreview()

		AddButton(v-if='!expanded' @create='create' mode="app")


	Trash(v-if='!expanded' :dragging="dragging")

</template>

<style scoped lang="scss">
.smooth-dnd-container.horizontal.list {
	display: flex;
	align-items: center;
	flex-wrap: wrap;
}

.group {
	width: 170px;
	min-height: 170px;
	position: relative;
	cursor: pointer;
	padding: 1rem;
	background: var(--middle);
	border: 2px solid var(--green);
	border-radius: var(--rad);
	margin: .5rem;

	&:hover {
		box-shadow: 2px 2px 6px rgba($color: #000000, $alpha: 0.3);
	}

	&.active {
		position: fixed;
		padding: 1rem;
		height: auto;
		// height: 221px;
		width: 1200px;
		margin: 0 auto;
		top: 150px;
		left: 0;
		right: 0;
		box-shadow: none;
		background: var(--middle);
		border: 2px solid var(--green);
	}

	&.inactive {
		display: none;
	}
}

.myicon {
	position: absolute;
	bottom: 0;
	left: .5rem;
}

.zag {
	width: 100%;
	font-size: 1.1rem;
	position: absolute;
	top: -2rem;
	text-align: center;
}
</style>

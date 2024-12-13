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


const tapes = defineModel<App[]>('tapes')

tapes.value?.map((item) => (item.expand = false))

gsap.registerPlugin(Flip)

const $q = useQuasar()
const onDrop = (dropResult: number) => {
	tapes.value = applyDrag(tapes.value, dropResult)
	dragging.value = false
}

const expanded = ref<boolean>(false)
const groupExpanded = ref<boolean>(false)

const groupExpand = (item: App) => {
	const state = Flip.getState('.item, .ani')
	groupExpanded.value = !groupExpanded.value
	item.expand = !item.expand
	nextTick(() => {
		Flip.from(state, {
			duration: .6,
			targets: '.item, .ani',
			absolute: true,
			absoluteOnLeave: true,
			ease: "elastic.out(.5, 0.9)",

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

const expand = (item: App) => {
	if (item.group == 1) {
		const state = Flip.getState('.item, .ani')
		expanded.value = !expanded.value
		item.expand = !item.expand
		nextTick(() => {
			Flip.from(state, {
				duration: 0.4,
				ease: 'power3.inOut',
				targets: '.item, .ani',
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
	} else groupExpand(item)
}

const calcClass = (item: App) => {
	if (expanded.value == true && item.expand == true) return 'active'
	if (expanded.value == true && item.expand == false) return 'inactive'
	if (groupExpanded.value == true && item.expand == true) return 'groupactive'
	if (item.group > 1) return 'group'
	else return ''
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

const delay = ref(true)
onMounted(() => {
	nextTick(() => {
		delay.value = false
	})
})

const calcDelay = (ind: number) => {
	return delay.value ? (300 + ind * 100) : 300
}
</script>

<template lang="pug">
Container(@drop="onDrop"
	@drag-leave='onDragLeave'
	@drag-enter='onDragEnter'
	orientation='horizontal'
	group-name='column'
	:remove-on-drop-out='true'
	:tag="{ value: 'div', props: { class: 'list' } }")

	Draggable(v-for="(item, index) in tapes"
		:key="item.id")

		.item(
			v-motion
			:initial="{ scale: 0, opacity: 0 }"
			:enter='{ scale: 1, opacity: 1, transition: { delay: calcDelay(index) } }'
			@click='expand(item)'
			:class="calcClass(item)"
			)

			.zag.ani(v-if='item.group > 1 && !groupExpanded') Группа {{ item.group }}
			.hg.ani(v-if='item.group == 1') {{ item.label }}
			q-icon.ani.img(v-if='item.group == 1' name="mdi-application-braces-outline" color="secondary" size="lg")

			AppPreview(:item='item' v-if='item.expand && !groupExpanded')

			GroupPreview(:expanded="item.expand && groupExpanded")



	AddButton(v-show='!expanded' @create='create' mode='app')

	Trash(:dragging="dragging")

</template>

<style scoped lang="scss">
.smooth-dnd-container.horizontal.list {
	display: flex;
	flex-wrap: wrap;
	gap: 1rem;
	justify-items: start;
	align-items: center;

}

.content {
	margin-top: 3rem;
}

.item.active {
	text-align: left;

	.hg {
		font-size: 1.2rem;
	}
}

.img {
	position: absolute;
	bottom: 1rem;
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

.item.groupactive {
	position: fixed;
	height: 100vh;
	width: 100vw;
	left: 0;
	right: 0;
	top: 50px;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 80, 80, 0.15);
	backdrop-filter: blur(3px);
	z-index: 10;
}

.zag {
	font-size: 1rem;
	text-align: center;

	.groupactive & {
		font-size: 1.2rem;
		margin-top: 10px;
		margin-bottom: 1rem;
	}
}
</style>

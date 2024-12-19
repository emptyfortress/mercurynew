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
const groupexpanded = ref<boolean>(false)

const expand = (item: App) => {
	const state = Flip.getState('.item, .ani')
	expanded.value = !expanded.value
	item.expand = !item.expand
	if (item.group > 1) {
		groupexpanded.value = !groupexpanded.value
	}
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
}

const calcClass = (item: App) => {
	if (expanded.value == true && item.expand == true && item.group > 1) return 'groupactive'
	if (expanded.value == true && item.expand == true) return 'active'
	if (expanded.value == true && item.expand == false) return 'inactive'
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
const calcLabel = ((item: any) => {
	return item.group > 1 ? 'Группа' : item.label
})
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

			.hg.ani {{ calcLabel(item) }}
			q-icon.ani.img(v-if='item.group == 1' name="mdi-application-braces-outline" color="secondary" size="lg")

			q-icon.q-mt-lg.q-ml-lg(name="mdi-arrow-left-circle-outline"
				v-if='groupexpanded'
				v-motion
				:initial='{ opacity: 0, x: 100 }'
				:enter='{ opacity: 1, x: 0 }'
				:delay=900
				color="secondary" size='64px')


			AppPreview(:item='item' v-if='item.expand && item.group == 1 && expanded')

	GroupPreview(:expanded="groupexpanded")

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


.item.groupactive {
	box-shadow: 1px 1px 5px rgba($color: #000000, $alpha: 0.2);
	margin-right: 6rem;

	&:before {
		content: '';
		display: block;
		width: 170px;
		height: 170px;
		background: #fff;
		position: absolute;
		top: 0px;
		left: 0px;
		transform: rotate(3deg);
		z-index: -2;
		box-shadow:
			2px 2px 3px rgba($color: #000000, $alpha: 0.2),
			-1px -1px 2px rgba($color: #000000, $alpha: 0.2);
	}
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

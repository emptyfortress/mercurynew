<script setup lang="ts">
import { ref, watch, nextTick, onBeforeUnmount, onMounted } from 'vue'
import { animations, state } from '@formkit/drag-and-drop'
import { useDragAndDrop } from '@formkit/drag-and-drop/vue'
import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'
import { useKeyModifier } from '@vueuse/core'
import AddButton from '@/components/common/AddButton.vue'
import { useApps } from '@/stores/apps'
import { uid, useQuasar } from 'quasar'
import GroupPreview1 from '@/components/GroupPreview1.vue'
import Trash from '@/components/common/Trash.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import IconApp from '@/components/icons/IconApp.vue'
import AppPreview from '@/components/AppPreview.vue'
import { useRouter, useRoute } from 'vue-router'
import Empty from '@/components/Empty.vue'
// import { useFlip } from '@/stores/flip'
// import { useStorage } from '@vueuse/core'

const router = useRouter()
const route = useRoute()

// const flip = useFlip()
gsap.registerPlugin(Flip)

const shift = useKeyModifier('Shift')
const expanded = ref<boolean>(false)
const dragStatus = ref(false)

state.on('dragStarted', () => {
	dragStatus.value = true
})

state.on('dragEnded', () => {
	dragStatus.value = false
})

watch(shift, (val) => {
	if (val) {
		updateConfig(config1)
	} else {
		updateConfig(config)
	}
})
watch(expanded, (val) => {
	if (val) {
		updateConfig({ draggable: () => false })
	} else {
		updateConfig(config)
	}
})

const hoverItem = ref(100)
const draggedItem = ref(100)

const onDragEnter = (index: number) => {
	if (shift.value) {
		hoverItem.value = index
	}
}
const onDragLeave = () => {
	hoverItem.value = 100
}

const onDrop1 = () => {
	if (shift.value) {
		let tmp = {} as App
		if (tapes.value[hoverItem.value].group == 1) {
			tmp.id = uid()
			tmp.label = 'Группа'
			tmp.descr = ''
			tmp.expand = false
			tmp.version = ''
			tmp.author = ''
			tmp.group = 1
			tmp.published = 0
			tmp.list = []
		} else tmp = tapes.value[hoverItem.value]

		tmp.group += 1
		tmp.list.push(tapes.value[hoverItem.value])
		tmp.list.push(tapes.value[draggedItem.value])

		tapes.value.splice(hoverItem.value, 1, tmp)
		tapes.value.splice(draggedItem.value, 1)

		draggedItem.value = 100
		hoverItem.value = 100
	}
}

const config = {
	plugins: [animations()],
	dragPlaceholderClass: 'ghost',
	sortable: true,
	draggable: (child: HTMLElement) => {
		return child.classList.contains('chil')
	},
	onDragstart: (e: any) => {
		draggedItem.value = e.draggedNode.data.index
	},
}
const config1 = {
	plugins: [animations()],
	dragPlaceholderClass: 'ghost',
	sortable: false,
	draggable: (child: HTMLElement) => {
		return child.classList.contains('chil')
	},
	onDragstart: (e: any) => {
		draggedItem.value = e.draggedNode.data.index
	},
}

const myapps = useApps()

const [parent, tapes, updateConfig] = useDragAndDrop(myapps.apps, config)

onMounted(() => {
	tapes.value.map((item: any) => (item.expand = false))
})

const calcClass = (item: any, index: number) => {
	if (item.group > 1 && expanded.value && item.expand) return 'group1 active'
	if (expanded.value && item.expand) return 'active'
	if (expanded.value && !item.expand) return 'inactive'
	if (item.group > 1 && hoverItem.value == index && index !== draggedItem.value)
		return 'group1 over'
	if (item.group > 1) return 'group1'
	if (draggedItem.value == hoverItem.value) return ''
	if (hoverItem.value == index && index !== draggedItem.value) return 'over'
	else return ''
}

const preexpand = (item: App) => {
	if (item.expand && expanded) return
	else expand(item)
}

// const app = useStorage('app', localStorage)

const close = (item: App) => {
	expanded.value = false
	item.expand = false
	item.list.map((el) => (el.expand = false))
	// tapes.value.map((el) => el.expand = false)
}

const expand = (item: App) => {
	const state = Flip.getState('.chil')
	expanded.value = !expanded.value
	item.expand = !item.expand
	nextTick(() => {
		Flip.from(state, {
			duration: 0.4,
			ease: 'power3.inOut',
			targets: '.chil',
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

const $q = useQuasar()
const create = (e: any) => {
	let tmp = {
		id: uid(),
		label: e.label,
		descr: e.description,
		expand: false,
		over: false,
		version: '0.0.0',
		author: 'Орлов П.С.',
		created: '22.09.2022',
		published: 0,
		group: 1,
		list: [],
		pic: IconApp,
	}

	tapes.value?.push(tmp)
	// myapps.createApp(tmp)
	setTimeout(() => {
		$q.notify({
			icon: 'mdi-check-bold',
			color: 'positive',
			message: 'Добавлено новое приложение',
		})
	}, 1200)
}

const showGroup = (item: any) => {
	if (item.group > 1 && item.expand == true) return false
	return true
}

const confirm = ref(false)

const removeGroup = () => {
	tapes.value.splice(draggedItem.value, 1)
	$q.notify({
		icon: 'mdi-check-bold',
		color: 'negative',
		message: 'Группа удалена',
	})
}

const remove = () => {
	if (tapes.value[draggedItem.value].group > 1) {
		confirm.value = true
	} else {
		tapes.value.splice(draggedItem.value, 1)
		$q.notify({
			icon: 'mdi-check-bold',
			color: 'negative',
			message: 'Приложение удалено',
			actions: [
				{
					label: 'Отмена',
					color: 'white',
					handler: () => {
						/* ... */
					},
				},
			],
		})
	}
}

const duple = ref(false)
const onDragEnterPlus = () => {
	duple.value = true
}
const onDragLeavePlus = () => {
	duple.value = false
}
const onDropPlus = () => {
	duple.value = false
}
</script>

<template lang="pug">
q-page(padding)
	.all
		.pa(ref='parent')
			div(v-if='tapes.length == 0' id="no-drag"
				v-motion
				:initial="{ y: 40, opacity: 0 }"
				:enter='{ y: 0, opacity: 1, transition: { delay: 400 } }'
				)
				Empty(mode='app')
			.chil(v-else v-for="(item, index) in tapes" :key="item.id" :id="item.id"
				v-motion
				:initial="{ y: 40, opacity: 0 }"
				:enter='{ y: 0, opacity: 1, transition: { delay: 400 + 100 * index } }'
				@click.stop='preexpand(item)'
				:class="calcClass(item, index)"
				@dragover.prevent="onDragEnter(index)"
				@dragenter.prevent
				@dragleave="onDragLeave"
				@drop='onDrop1'
				)
				.con(v-if='showGroup(item)'
					v-motion
					:initial="{ y: -20, opacity: 0 }"
					:enter='{ y: 0, opacity: 1, transition: { delay: 300 } }'
					)
					span {{ item.label }}
					q-popup-edit(v-if='item.expand' v-model="item.label" auto-save v-slot="scope" style='width: 300px')
						q-input(v-model="scope.value" dense autofocus counter @keyup.enter="scope.set")

				.con1(v-if='!showGroup(item)'
					v-motion
					:initial="{ y: 20, opacity: 0 }"
					:enter='{ y: 0, opacity: 1, transition: { delay: 300 } }'
					@click.stop
					)
					span {{ item.label }}
					q-popup-edit(v-model="item.label" auto-save v-slot="scope")
						q-input(v-model="scope.value" dense autofocus @keyup.enter="scope.set")

				.img(v-if='item.group == 1')
					component(:is='item.pic')
					// .edit1(v-if='item.expand' @click.stop)
					// 	q-icon(name="mdi-pencil-outline" color="primary")


				template(v-if='item.group > 1 && !item.expand')
					.img1
						component(:is='el.pic' v-for="el in item.list" :key="el.id")

				.inner(v-if='item.group > 1 && item.expand')
					GroupPreview1(:list="item.list"
						@close='close(item)'
						)

				AppPreview(:item='item'
					v-if='expanded && item.expand && item.group == 1'
					v-motion
					:initial='{ x: 100, opacity: 0 }'
					:enter='{ x: 0, opacity: 1 }'
					:delay=500
					@close='close(item)'
					)

				q-btn.close(v-if='item.expand && expanded'
					round color="negative"
					icon='mdi-close'
					@click.stop="expand(item)"
					v-motion
					:initial='{ scale: 0.1, opacity: 0 }'
					:enter='{ scale: 1, opacity: 1 }'
					:delay='200'
					) 


			.plusCont(id="no-drag"
				@dragover.prevent="onDragEnterPlus"
				@dragenter.prevent
				@dragleave="onDragLeavePlus"
				@drop='onDropPlus'
				:class="{ duplicate: duple }"
				)
				AddButton(v-if='!expanded' @create='create' mode="app")

		Trash(v-model="dragStatus" @remove="remove" :group='expanded' :duple='duple')
		ConfirmDialog(v-model="confirm" @remove="removeGroup")
</template>

<style scoped lang="scss">
.q-page {
	position: relative;
}

.all {
	margin: 0 auto;
	padding: 0;
	width: 728px;
}

.pa {
	display: grid;
	grid-template-columns: repeat(4, 170px);
	column-gap: 1rem;
	align-items: center;
	row-gap: 1rem;
	margin: 0 auto;
	width: 728px;
	border: none;
	outline: none;
}

.chil {
	width: 170px;
	height: 170px;
	background: #fff;
	cursor: pointer;
	padding: 1rem;
	position: relative;
	border-radius: var(--rad);
	position: relative;

	&.active {
		padding: 2rem;
		position: fixed;
		// height: 52vh;
		width: 800px;
		height: 370px;

		margin: 0 auto;
		top: 150px;
		left: 0;
		right: 0;
		border: 1px solid #ccc;
		box-shadow: 2px 2px 6px rgba($color: #000000, $alpha: 0.2);
		z-index: 10;
		cursor: default;
	}

	&.group1 {
		background: hsl(213deg 83.95% 94.68%);
		border: 2px solid var(--green);

		&.over {
			background: #a8d7a8;
		}

		&.active {
			height: 206px;
			width: 850px;
			padding: 1rem;
		}
	}

	&.over {
		background: #a8d7a8;
	}

	&.inactive {
		display: none;
	}

	&:hover {
		box-shadow: 2px 2px 6px rgba($color: #000000, $alpha: 0.2);
	}
}

.active .con {
	font-size: 1.2rem;
	color: $primary;
	margin-bottom: 0.5rem;

	span {
		border-bottom: 1px dotted $primary;
		cursor: pointer;
	}
}

.ghost {
	background: hsl(213 38% 81% / 1) !important;
	box-shadow: none !important;
	border: none !important;

	.con,
	.img,
	.img1 {
		display: none;
	}
}

.con1 {
	width: 100%;
	position: absolute;
	top: -2.5rem;
	text-align: center;
	color: $primary;

	span {
		border-bottom: 1px dotted $primary;
	}
}

.backdrop {
	width: 100vw;
	height: 100vh;
	background-color: rgba(0, 100, 200, 0.1);
	backdrop-filter: blur(2px);
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
}

.img,
.img1 {
	position: absolute;
	bottom: 0;
	left: 0.5rem;
	font-size: 3rem;
	line-height: 1;
	color: hsl(199 23% 45% / 1);
}

.active .img,
.active .img1 {
	bottom: 1rem;
	left: 1rem;
	font-size: 5rem;

	.edit1 {
		font-size: 0.9rem;
		position: absolute;
		top: 0;
		right: 0;
		display: none;
	}

	&:hover {
		.edit1 {
			display: block;
		}
	}
}

.img1 {
	bottom: 0.5rem;
	left: 0.8rem;
	font-size: 1.5rem;
}

.inner {
	display: flex;
	gap: 1rem;
}

.close {
	position: absolute;
	top: -1.2rem;
	right: -1.2rem;
}

.rectangle {
	width: 100px;
	height: 100px;
	background-color: blue;
	cursor: pointer;
}

.plusCont {
	width: 170px;
	height: 170px;
	border-radius: var(--rad);
	display: flex;
	justify-content: center;
	align-items: center;

	&.duplicate {
		background: hsl(213 38% 81% / 1) !important;
		border: 2px dashed $primary;
	}
}
</style>

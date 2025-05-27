<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { animations, state } from '@formkit/drag-and-drop'
import { useDragAndDrop } from '@formkit/drag-and-drop/vue'
// import { gsap } from 'gsap'
// import { Flip } from 'gsap/Flip'
import { useQuasar } from 'quasar'
import AddButtonNew from '@/components/common/AddButtonNew.vue'
import ItemRole from '@/components/ItemRole.vue'
import Empty from '@/components/Empty.vue'
import { useRouter } from 'vue-router'
import RoleRulesDialog from '@/components/RoleRulesDialog.vue'

const router = useRouter()

// gsap.registerPlugin(Flip)

const roles = ref([
	{
		id: 1,
		label: 'Инициатор',
		expand: false,
		avatar: 'avatar1',
	},
	{
		id: 2,
		label: 'Руководитель',
		expand: false,
		avatar: 'avatar2',
	},
	{
		id: 3,
		label: 'Кадровик',
		expand: false,
		avatar: 'avatar3',
	},
])

const $q = useQuasar()

// const dragStatus = ref(false)
// state.on('dragStarted', () => {
// 	dragStatus.value = true
// })
// state.on('dragEnded', () => {
// 	dragStatus.value = false
// })

const expanded = ref<boolean>(false)

// const expand = (item: any) => {
// 	const state = Flip.getState('.item1')
// 	expanded.value = !expanded.value
// 	item.expand = !item.expand
// 	nextTick(() => {
// 		Flip.from(state, {
// 			duration: 0.4,
// 			ease: 'power3.inOut',
// 			targets: '.item1',
// 			absolute: true,
// 			absoluteOnLeave: true,
// 			nested: true,
//
// 			onEnter: (elements) =>
// 				gsap.fromTo(
// 					elements,
// 					{ opacity: 0 },
// 					{ opacity: 1, duration: 0.6, ease: 'linear', delay: 0.2 }
// 				),
// 			onLeave: (elements) =>
// 				gsap.fromTo(elements, { opacity: 1 }, { opacity: 0, duration: 0.2, ease: 'linear' }),
// 		})
// 	})
// }

// const calcClass = (item: any) => {
// 	if (expanded.value == true && item.expand == true) return 'active'
// 	if (expanded.value == true && item.expand == false) return 'inactive'
// 	else return ''
// }

const getImageUrl = (name: string) => new URL(`../assets/img/${name}.svg`, import.meta.url).href

const create = (e: any) => {
	let tmp = {
		id: +new Date(),
		label: e.label,
		expand: false,
		avatar: 'avatar1',
	}
	tapes.value.push(tmp)
	setTimeout(() => {
		$q.notify({
			icon: 'mdi-check-bold',
			color: 'positive',
			message: 'Добавлена роль',
		})
	}, 1200)
}
const config = {
	plugins: [animations()],
	dragPlaceholderClass: 'ghost',
	sortable: true,
	draggable: (child: HTMLElement) => {
		return child.classList.contains('it')
	},
}

const [parent, tapes] = useDragAndDrop(roles.value, config)

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
const form = ref('Просмотр')
const options = ['Создание', 'Просмотр', 'Редактирование']

const dialog = ref(false)

const toggleDialog = () => {
	dialog.value = !dialog.value
}
const goto = () => {
	router.push('/form')
}

const role = ref()
const setRole = (e: string) => {
	role.value = e
}

// new code **************************************

const activeItem = ref('')
const back = () => {
	router.push('/roles')
	expanded.value = false
}
const spring = {
	type: 'spring',
	visualDuration: 0.3,
	bounce: 0.25,
}
const calcPlusClass = computed(() => {
	if (duple.value) return 'duplicate'
	if (expanded.value) return 'cl-0'
	// if (expanded.value) return `cl-${tapes.value.length}`
	return ''
})

const row = computed(() => {
	return Math.floor(tapes.value.length / 4 + 1)
})
const row1 = computed(() => {
	return tapes.value.length + 1
})
</script>

<template lang="pug">
q-page(padding)
	.header Роли
	.parent(ref='parent'
		:class="{'end': expanded}"
		@click.stop='back'
	)

		Div.plus(
			layout
			:transition='spring'
			@click.stop
			@dragover.prevent="onDragEnterPlus"
			@dragenter.prevent
			@dragleave="onDragLeavePlus"
			@drop='onDropPlus'
			:class="calcPlusClass"
		)
			AddButtonNew(mode='app' @create='create')

		.cen( v-if='tapes.length == 0')
			Empty(mode='role')

		ItemRole(
			v-model:expanded="expanded",
			v-model:tapes='tapes',
			v-model:activeItem="activeItem",
		)

	// 	div(v-if='tapes.length == 0' id="no-drag"
	// 		v-motion
	// 		:initial="{ y: 40, opacity: 0 }"
	// 		:enter='{ y: 0, opacity: 1, transition: { delay: 400 } }'
	// 		)
	// 		Empty(mode='role')
	// 	.item1(v-else v-for="(item, index) in tapes" :key="item.id"
	// 		v-motion
	// 		:initial="{ y: 40, opacity: 0 }"
	// 		:enter='{ y: 0, opacity: 1, transition: { delay: 400 + 100 * index } }'
	// 		@click.stop='expand(item)'
	// 		:class="calcClass(item)"
	// 		)
	// 		q-img.img(:src='getImageUrl(item.avatar)')
	// 		.hg {{ item.label }}
	//
	// 		.content(v-if='item.expand'
	// 			v-motion
	// 			:initial="{ x: 100, opacity: 0 }"
	// 			:enter="{ x: 0, opacity: 1, transition: { type: 'spring', stiffness: 500, damping: 30, delay: 300 } }")
	// 			br
	// 			.grid
	// 				label Название роли:
	// 				.val()
	// 					span(@click.stop) {{ item.label }}
	// 						q-popup-edit(v-model="item.label" auto-save v-slot="scope")
	// 							q-input(v-model="scope.value" dense autofocus counter @keyup.enter="scope.set")
	//
	// 				label Правила определения роли:
	// 				.val(v-if='role' @click.stop="toggleDialog")
	// 					span {{ role }}
	// 				q-btn(v-else unelevated color="primary" label="Задать" @click.stop="toggleDialog" size='sm') 
	//
	// 			.hr Форма для показа в папках
	// 			.grid(@click.stop)
	// 				label Форма:
	// 				.row.items-center
	// 					q-select(filled dense v-model="form" :options="options" )
	// 						template(v-slot:after)
	// 							q-btn(flat icon="mdi-arrow-right-circle-outline" label='Перейти' color="primary" @click="goto" dense) 
	// 						template(v-slot:after-options)
	// 							q-separator
	// 							q-item
	// 								q-item-section
	// 									q-btn(flat color="primary" label="Создать форму" icon="mdi-plus-circle" @click="dialog = true" size='sm' v-close-popup) 
	//
	// 			RoleRulesDialog(v-model="dialog" v-model:role='item.label' @set='setRole')
	//
	// 	.plusCont(id="no-drag"
	// 		@dragover.prevent="onDragEnterPlus"
	// 		@dragenter.prevent
	// 		@dragleave="onDragLeavePlus"
	// 		@drop='onDropPlus'
	// 		:class="{ duplicate: duple }"
	// 		)
	// 		AddButton(v-if='!expanded' @create='create' mode="list")
	//
	// Trash(v-model="dragStatus" @remove="remove" :group='expanded' :duple='duple')

</template>

<style scoped lang="scss">
.parent {
	grid-template-rows: repeat(v-bind(row), 170px);
	&.end {
		grid-template-rows: repeat(v-bind(row1), 80px);
	}
}

.header {
	font-size: 1.5rem;
	text-align: center;
}

.ghost {
	background: hsl(213 38% 81% / 1) !important;
	box-shadow: none !important;
	border: none !important;

	* {
		display: none;
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

.plusCont {
	width: 150px;
	height: 150px;
	border-radius: var(--rad);
	display: flex;
	justify-content: center;
	align-items: center;

	&.duplicate {
		background: hsl(213 38% 81% / 1) !important;
		border: 2px dashed $primary;
	}
}

.grid {
	width: 400px;
	margin: 1rem auto 0;
	display: grid;
	grid-template-columns: auto 1fr;
	justify-items: start;
	align-items: center;
	column-gap: 1rem;
	row-gap: 0.5rem;
	justify-content: center;
}

.hr {
	width: 400px;
	margin: 1rem auto;
	border-top: 1px solid #dedede;
	text-align: left;
	padding-top: 1rem;
	// grid-column: 1/-1;
}
.val span {
	color: $primary;
	border-bottom: 1px dotted $primary;
}
</style>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { motion } from 'motion-v'
import { useRouter, useRoute } from 'vue-router'
import { useApps } from '@/stores/apps'
import { useDragAndDrop } from '@formkit/drag-and-drop/vue'
import AppPreviewNew from '@/components/AppPreviewNew.vue'
import { useQuasar } from 'quasar'
import IconMenu from '@/components/IconMenu.vue'

const props = defineProps(['id', 'item'])

const myapps = useApps()
const router = useRouter()
const route = useRoute()

const Div = motion.div

const spring = {
	type: 'spring',
	visualDuration: 0.3,
	bounce: 0.25,
}

const back = () => {
	const path = route.fullPath
	const parts = path.split('/')
	parts.pop()
	parts.splice(0, 2)
	const newUrl = '/' + parts
	router.push(newUrl)
}

const group = computed(() => {
	return myapps.apps.find((el: App) => el.id == props.id) || ({} as App)
})

const config = {
	dragPlaceholderClass: 'ghost',
	sortable: true,
	group: 'items',
	draggable: (child: HTMLElement) => {
		return child.classList.contains('it')
	},
}
const [parent, tapes] = useDragAndDrop(group.value.list, config)

const calcClass = (str: string) => {
	if (str == props.item) return 'big'
	return ''
}

const action = (item: App) => {
	if (route.params.item == item.id) {
		back()
	} else {
		router.push({
			params: {
				item: item.id,
			},
		})
	}
}

const $q = useQuasar()
const remove = (el: App) => {
	const ind = tapes.value?.findIndex((item) => item.id == el.id)
	if (ind !== undefined) {
		tapes.value?.splice(ind, 1)
	}
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

	const last = tapes.value?.at(-1)
	if (last) {
		router.push({
			params: {
				item: last.id,
			},
		})
	}
}

watch(tapes.value, (val: any) => {
	if (val.length == 0) {
		router.push(myapps.path)
	}
})

const activeIndex = computed(() => {
	return tapes.value.findIndex((el) => el.id == route.params.item)
})

const calcGhost = computed(() => {
	if (activeIndex.value > -1) {
		return `cl-${activeIndex.value}`
	}
	return ''
})

const label = computed(() => {
	let item = tapes.value?.find((el) => el.id == route.params.item)
	if (item) return item.label
	return ''
})

function stopClick(item: App, event: MouseEvent) {
	if (item.id === route.params.item) {
		event.stopPropagation()
	}
}

const setIcon = (icon: any) => {
	let item = tapes.value?.find((el) => el.id == route.params.item)
	if (item) {
		item.pic = icon
	}
}
</script>

<template lang="pug">
q-page(padding)
	Div.box(
		@click='back'
		:layout-id="id"
		:transition='spring'
	)
		Div.hd(layout-id='hd') {{ group.label }}
		.parent1(ref='parent')
			Div.it(v-for="(item, index) in tapes", :key="item.id",
				:layout-id='item.id'
				:transition="spring"
				:class='calcClass(item.id)'
				@click.stop='action(item)',
			)
				template(v-if='item.id == route.params.item')
					.head
						span(@click.stop) {{ item.label }}
							q-popup-edit(v-model="item.label" auto-save v-slot="scope")
								q-input(v-model="scope.value" dense autofocus counter @keyup.enter="scope.set")
				template(v-else)
					span {{ item.label }}

				AppPreviewNew(
					v-if='route.params.item == item.id'
					:item='item',
					@remove='remove(item)'
				)

				.img(@click='stopClick(item, $event)')
					component(:is='item.pic')
					IconMenu(v-if='item.id == route.params.item' @select='setIcon')

			.ghostItem(:class='calcGhost')
				div {{ label }}

</template>

<style scoped lang="scss">
.header {
	text-align: center;
	color: $primary;
	margin-bottom: 0.8rem;
	span {
		font-size: 1.2rem;
		border-bottom: 1px dotted $primary;
	}
}
.ic {
	font-size: 1.9rem;
	margin-bottom: -5px;
	margin-right: 0.5rem;
}
.box {
	margin: 0 auto;
	margin-top: 1rem;
	width: 950px;
	height: 500px;
	padding: 1rem;
	background: hsl(213deg 83.95% 94.68%);
	border: 2px solid var(--green);
	border-radius: 0.5rem;
	z-index: 10;
}
.it {
	border-radius: 0.5rem;
	cursor: pointer;
	padding: 0.5rem;
	background: #fff;
	border: 1px solid #fff;
	position: relative;
	border: 1px solid $secondary;
	&:hover {
		border: 1px solid #ccc;
		box-shadow: 2px 2px 6px rgba($color: #000000, $alpha: 0.2);
	}
	&.big {
		grid-column: 2/3;
		grid-row: 1/5;
		font-size: 1.2rem;
		padding: 1rem;
		.img {
			font-size: 4rem;
		}
	}
	.img {
		font-size: 1.5rem;
	}
}
.hd {
	font-size: 1.2rem;
}
.parent1 {
	display: grid;
	grid-template-columns: repeat(1, 200px);
	grid-template-rows: repeat(5, 80px);
	gap: 1rem;
	margin: 1rem auto;
}
.img {
	position: absolute;
	bottom: 0;
	left: 0.5rem;
	font-size: 3rem;
	line-height: 1;
	color: hsl(199 23% 45% / 1);
}
.plus {
	display: flex;
	width: 100%;
	height: 100%;
	justify-content: center;
	align-items: center;
	&.duplicate {
		background: hsl(213 38% 81% / 1) !important;
		border: 2px dashed $primary;
		border-radius: 0.5rem;
	}
}
.ghostItem {
	height: 100%;
	background: hsl(211 74% 89% / 1);
	border-radius: 0.5rem;
	box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.15);
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 0.7rem;
	color: hsl(212 38% 55% / 1);
}
.head span {
	color: $primary;
	border-bottom: 1px dotted $primary;
	cursor: pointer;
}
</style>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, watch, markRaw } from 'vue'
import { motion } from 'motion-v'
import { useRouter, useRoute } from 'vue-router'
import { useApps } from '@/stores/apps'
import { useDragAndDrop } from '@formkit/drag-and-drop/vue'
import { animations, state } from '@formkit/drag-and-drop'
import AddButtonNew from '@/components/common/AddButtonNew.vue'
// import Trash from '@/components/common/Trash.vue'
// import { uid, useQuasar } from 'quasar'
// import IconApp from '@/components/icons/IconApp.vue'
import AppPreviewNew from '@/components/AppPreviewNew.vue'

const props = defineProps(['id', 'item'])

const myapps = useApps()
const router = useRouter()
const route = useRoute()
// const IconApp1 = markRaw(IconApp)

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
	plugins: [animations()],
	dragPlaceholderClass: 'ghost',
	sortable: true,
	draggable: (child: HTMLElement) => {
		return child.classList.contains('it')
	},
}
const [parent, tapes] = useDragAndDrop(group.value.list, config)

// const tapes = computed(() => {
// 	if (group.value) return group.value.list || []
// })

const row = computed(() => {
	return (tapes.value?.length || 1) + 1
})

const calcClass = (str: string) => {
	if (str == props.item) return 'big'
	return ''
}

const action = (item: App) => {
	router.push({
		params: {
			item: item.id,
		},
	})
}

const remove = (el: App) => {
	const ind = tapes.value?.findIndex((item) => item.id == el.id)
	if (ind !== undefined) {
		tapes.value?.splice(ind, 1)
	}
	const last = tapes.value?.at(-1)
	if (last) {
		router.push({
			params: {
				item: last.id,
			},
		})
	}
}
</script>

<template lang="pug">
q-page(padding)
	Div.box(
		@click='back'
		layout-id="gr"
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
				span {{ item.label }} - {{ item.id }}

				AppPreviewNew(
					v-if='route.params.item == item.id'
					:item='item',
					@remove='remove(item)'
				)

				.img()
					component(:is='item.pic')
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
</style>

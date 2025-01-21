<script setup lang="ts">
import { ref, computed, watch, nextTick, } from 'vue'
import { animations, } from "@formkit/drag-and-drop"
import { useDragAndDrop } from "@formkit/drag-and-drop/vue"
import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'
import { useKeyModifier } from '@vueuse/core'
import AddButton from '@/components/common/AddButton.vue'
import { useApps } from '@/stores/apps'
import { uid, useQuasar } from 'quasar'
// import AppPreview from '@/components/AppPreview.vue'
// import GroupPreview from '@/components/GroupPreview.vue'

gsap.registerPlugin(Flip)

const shift = useKeyModifier('Shift')

watch(shift, (val) => {
	if (val) {
		updateConfig({ 
			plugins: [animations(),],
			dragPlaceholderClass: 'ghost',
			sortable: false,
			draggable: (el: any) => {
				return el.id !== 'no-drag'
			},
		})
	} else {
		updateConfig({ 
			plugins: [animations(),],
			dragPlaceholderClass: 'ghost',
			sortable: true,
			draggable: (el: any) => {
				return el.id !== 'no-drag'
			},
		})

	}
})

const config = {
	plugins: [animations(),],
	dragPlaceholderClass: 'ghost',
	sortable: true,
	draggable: (el: any) => {
		return el.id !== 'no-drag'
	},
}

const myapps = useApps()
const applications = ref([...myapps.apps])

const [parent, tapes, updateConfig] = useDragAndDrop(applications.value, config)

const expanded = ref<boolean>(false)

const calcClass = ((item: any) => {
	if (item.group > 1 && expanded.value && item.expand) return 'group1 active'
	if (expanded.value && item.expand) return 'active'
	if (expanded.value && !item.expand) return 'inactive'
	if (item.group > 1) return 'group1'
	else return ''

})

const expand = ((item: any) => {
	const state = Flip.getState('.chil')
	item.expand = !item.expand
	expanded.value = !expanded.value
	nextTick(() => {
		Flip.from(state, {
			duration: 0.4,
			ease: 'power3.inOut',
			targets: '.chil',

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
})

const sort = ref(false)

const $q = useQuasar()
const create = (e: string) => {
	let tmp = {
		id: uid(),
		label: e,
		descr: 'description',
		expand: false,
		version: '0.0.0',
		author: 'Орлов П.С.',
		created: '22.09.2022',
		group: 1,
		pic: '',
	}

	tapes.value?.push(tmp)
	setTimeout(() => {
		$q.notify({
			icon: 'mdi-check-bold',
			color: 'positive',
			message: 'Добавлено приложение'
		})
	}, 1200)
	myapps.createApp(tmp)
}

const showGroup = ((item: any) => {
	if (item.group > 1 && item.expand == true) return false
	return true
})
</script>

<template lang="pug">
q-page(padding)
	.all
		.pa(ref='parent')
			.chil(v-for="(item, index) in tapes" :key="item.id" :id="item.id"
				v-motion
				:initial="{ y: 40, opacity: 0 }"
				:enter='{ y: 0, opacity: 1, transition: { delay: 400 + 100 * index } }'
				@click='expand(item)'
				:class="calcClass(item)"
				)
				.con(v-if='showGroup(item)'
					v-motion
					:initial="{ y: -20, opacity: 0 }"
					:enter='{ y: 0, opacity: 1, transition: { delay: 300 } }'
					) {{ item.label }}
				.con1(v-if='!showGroup(item)'
					v-motion
					:initial="{ y: 20, opacity: 0 }"
					:enter='{ y: 0, opacity: 1, transition: { delay: 300 } }'
					) {{ item.label }}

				.img(v-if='item.group == 1')
					component(:is='item.pic')
				template(v-if='item.group > 1 && !item.expand')
					.img1
						component(:is='el.pic' v-for="el in item.list")
				.inner(v-if='item.group > 1 && item.expand')
					.chil(v-for="el in item.list ")

			div(id="no-drag")
				AddButton(v-if='!expanded' @create='create' mode="app")

</template>

<style scoped lang="scss">
.all {
	margin: 0 auto;
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

	&.active {
		position: fixed;
		height: 70vh;
		width: 900px;
		margin: 0 auto;
		top: 150px;
		left: 0;
		right: 0;
		border: 1px solid #ccc;
		box-shadow: 2px 2px 6px rgba($color: #000000, $alpha: 0.2);
		z-index: 10;
		draggable: false;
	}

	&.group1 {
		background: hsl(213deg 83.95% 94.68%);
		border: 2px solid var(--green);
		&.active {
			height: 206px;
		}
	}

	&.inactive {
		display: none;
	}

	&:hover {
		box-shadow: 2px 2px 6px rgba($color: #000000, $alpha: 0.2);
	}
}

.ghost {
	background: hsl(213 38% 81% / 1) !important;
	box-shadow: none !important;
	border: none !important;

	.con, .img, .img1 {
		display: none;
	}

}
.con1 {
	width: 100%;
	position: absolute;
	top: -2rem;
	text-align: center;
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

.img, .img1 {
	position: absolute;
	bottom: 0;
	left: 0.5rem;
	font-size: 3rem;
	line-height: 1;
	color: hsl(199 23% 45% / 1);
}
.img1 {
	bottom: .5rem;
	left: .8rem;
	font-size: 1.5rem;
}
.inner {
	display: flex;
	gap: 1rem;
}
</style>

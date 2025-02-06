<script setup lang="ts">
import { ref, watch, nextTick, } from 'vue'
import { useDragAndDrop } from "@formkit/drag-and-drop/vue"
import { animations } from "@formkit/drag-and-drop"
import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'
import AppPreview from '@/components/AppPreview.vue'
import AddButton from '@/components/common/AddButton.vue'

const props = defineProps<{
	list: App[]
}>()

const mylist = ref(props.list)

gsap.registerPlugin(Flip)

const config = {
	plugins: [animations(),],
	dragPlaceholderClass: 'ghost',
	sortable: true,
	draggable: (el: any) => {
		return el.id !== 'no-drag'
	},
}
const [parent, tapes, updateConfig] = useDragAndDrop(mylist.value, config)

const expanded = ref<boolean>(false)
const actionExpand = ((item: App) => {
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

const calcClass = ((item: any, index: number) => {
	if (expanded.value && item.expand) return 'active'
	if (expanded.value && !item.expand) return 'inactive'
	else return ''

})

const emit = defineEmits(['close'])
const close = (() => {
	emit('close')
})

</script>

<template lang="pug">
.par(ref='parent')
	.chil(v-for="(item, index) in tapes"
		:key="item.id" :id="item.id"
		@click.stop='actionExpand(item)'
		:class="calcClass(item, index)"
		)
		.con
			span {{ item.label }}
			.img
				component(:is='item.pic')

		AppPreview(:item='item'
			v-if='item.expand && item.group == 1'
			v-motion
			:initial='{ x: 100, opacity: 0 }'
			:enter='{ x: 0, opacity: 1 }'
			:delay=500
			@close='close'
			)
		q-btn.close(v-if='item.expand'
			round color="negative"
			icon='mdi-close'
			@click.stop="actionExpand(item)"
			v-motion
			:initial='{ scale: 0.1, opacity: 0 }'
			:enter='{ scale: 1, opacity: 1 }'
			:delay='400'
			) 

	div(id="no-drag")
		.button(v-if='!expanded'
			v-motion
			:initial='{ scale: 0.1, opacity: 0, rotate: 720 }'
			:enter='{ scale: 1, rotate: 0, opacity: 1 }'
			:delay='400')
			q-icon(name="mdi-plus" color="white" size="24px")

		// AddButton(v-if='!expanded' mode="role")

</template>

<style scoped lang="scss">
.par {
	display: flex;
	gap: 1rem;
	justify-content: start;
	align-items: center;
}

.button {
	background: $primary;
	width: 42px;
	height: 42px;
	border-radius: 24px;
	display: flex;
	justify-content: center;
	align-items: center;
	margin-left: 2rem;
	cursor: pointer;
}

.chil {
	width: 170px;
	height: 170px;
	background: #fff;
	cursor: pointer;
	padding: 1rem;
	position: relative;
	border-radius: var(--rad);
	border: 1px solid $secondary;

	&.active {
		position: fixed;
		height: 50vh;
		width: 900px;
		margin: 0 auto;
		top: -40px;
		left: -2px;
		right: 0;
		border: 1px solid #ccc;
		box-shadow: 2px 2px 6px rgba($color: #000000, $alpha: 0.2);
		z-index: 10;
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

	.con,
	.img,
	.img1 {
		display: none;
	}

}

.img {
	position: absolute;
	bottom: 0;
	left: 0.5rem;
	font-size: 3rem;
	line-height: 1;
	color: hsl(199 23% 45% / 1);
}

.close {
	position: absolute;
	top: -1.2rem;
	right: -1.2rem;
}

.active .active .con {
	font-size: 1.2rem;
	color: $primary;
	margin-bottom: .5rem;

	span {
		border-bottom: 1px dotted $primary;
		cursor: pointer;
	}
}
</style>

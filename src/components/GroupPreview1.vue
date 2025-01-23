<script setup lang="ts">
import { ref, watch, nextTick, } from 'vue'
import { useDragAndDrop } from "@formkit/drag-and-drop/vue"
import { animations } from "@formkit/drag-and-drop"
import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'

const props = defineProps<{
	list: App[]
}>()

const mylist = ref(props.list)

gsap.registerPlugin(Flip)

const config = {
	plugins: [animations(),],
	dragPlaceholderClass: 'ghost',
	sortable: true,
}
const [parent, tapes, updateConfig] = useDragAndDrop(mylist.value, config)

</script>

<template lang="pug">
.par(ref='parent')
	.chil(v-for="(item, index) in tapes" :key="item.id" :id="item.id")
		.con {{ item.label }}
			.img
				component(:is='item.pic')
</template>

<style scoped lang="scss">
.par {
	display: flex;
	gap: 1rem;
	justify-content: start;
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
		height: 70vh;
		width: 900px;
		margin: 0 auto;
		top: 150px;
		left: 0;
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
</style>

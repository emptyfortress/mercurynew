<script setup lang="ts">
import { ref, computed, onMounted, watch, markRaw } from 'vue'
import { motion } from 'motion-v'
import { useRouter, useRoute } from 'vue-router'
import { useApps } from '@/stores/apps'
import { useDragAndDrop } from '@formkit/drag-and-drop/vue'
import { animations, state } from '@formkit/drag-and-drop'
import AddButtonNew from '@/components/common/AddButtonNew.vue'
import Trash from '@/components/common/Trash.vue'
import { uid, useQuasar } from 'quasar'
import IconApp from '@/components/icons/IconApp.vue'
import AppPreviewNew from '@/components/AppPreviewNew.vue'

const myapps = useApps()
const router = useRouter()
const route = useRoute()
const IconApp1 = markRaw(IconApp)

const Div = motion.div
const spring = {
	type: 'spring',
	visualDuration: 0.3,
	bounce: 0.25,
}

const calcId = computed(() => {
	return route.params.id.toString()
	// return 'list'
})

const back = () => {
	router.push('/3')
}
</script>

<template lang="pug">
q-page(padding)
	Div.box(
		@click='back'
		:layout-id="calcId"
		:transition='spring'
	)
		div fuck
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
	width: 850px;
	height: 400px;
	padding: 0.5rem;
	background: hsl(213deg 83.95% 94.68%);
	border: 2px solid var(--green);
	border-radius: 0.5rem;
	z-index: 10;
}
.it1 {
	border-radius: 0.5rem;
	cursor: pointer;
	padding: 1rem;
	background: #fff;
	border: 1px solid #fff;
	position: relative;
	border: 1px solid $secondary;
	&:hover {
		border: 1px solid #ccc;
		box-shadow: 2px 2px 6px rgba($color: #000000, $alpha: 0.2);
	}
	&.active {
		font-size: 1.2rem;
	}
}
.parent1 {
	display: grid;
	grid-template-columns: repeat(4, 170px);
	grid-template-rows: repeat(v-bind(row), 170px);
	gap: 1rem;
	margin: 0 auto;
	margin-top: 1rem;

	&.end {
		grid-template-columns: repeat(1, 200px);
		grid-template-rows: repeat(v-bind(row1), 80px);
		.it1 {
			padding: 0.5rem;
			font-size: 0.85rem;
			grid-column: 1/2;
			.img {
				font-size: 1.2rem;
			}
			&.active {
				grid-column: 2/4;
				grid-row: 1/6;
				padding: 1rem;
				font-size: 1.2rem;
				.img {
					font-size: 4rem;
				}
			}
		}
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

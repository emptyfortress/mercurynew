<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
	stat: Stat
}>()

const emit = defineEmits(['kill'])

const par = computed(() => {
	return props.stat.data.parents
})

const kill = () => {
	emit('kill')
}
</script>

<template lang="pug">
.node
	div
		.txt
			template(v-for="item in par" :key="item")
				div {{ item }}
				.q-mx-sm >
			div {{ props.stat.data.text}}
	.but
		q-btn.close(flat round icon="mdi-close" @click="kill" size="sm")
</template>

<style scoped lang="scss">
.param .node {
	cursor: pointer;
	position: relative;
	transition: 0.2s ease transform;
	display: grid;
	grid-template-columns: auto 1fr 1fr 0.5fr 80px;
	justify-content: start;
	align-items: center;
	background: #dddaff;
	padding: 0.2rem 0.5rem;
	border: 1px solid #bbb3c2;
	border-radius: 4px;
	margin-bottom: 2px;
	position: relative;
	height: 100%;
	&:hover {
		border-color: #a142f4;
	}
	.close {
		position: absolute;
		right: 0.5rem;
		top: 50%;
		transform: translateY(-50%);
	}
	.but {
		display: none;
	}
	&:hover {
		.but {
			display: block;
		}
	}
}
.txt {
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	font-size: 0.9rem;
	.syn {
		margin-left: 1rem;
		visibility: hidden;
	}
	&:hover {
		.syn {
			visibility: visible;
		}
	}
}
</style>

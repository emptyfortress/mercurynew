<script setup lang="ts">
import TreeQuery from '@/components/TreeQuery.vue'

const props = defineProps<{
	stat: Stat
}>()

const toggle = (stat: any) => {
	stat.open = !stat.open
}
const next = (() => {
	props.stat.data.and = !props.stat.data.and
})
</script>

<template lang="pug">
.node
	.zero(v-if='props.stat.data.type == 10')
		q-icon.trig(name="mdi-chevron-down" v-if="stat.children.length" @click.stop="toggle(stat)" :class="{ 'closed': !stat.open }")
		.oper(@click="next")
			span(v-if='props.stat.data.and') И
			span(v-else) ИЛИ

	TreeQuery(v-else :arr="props.stat.data")
	// q-btn(v-if='props.stat.data.type !== 10' flat round color="secondary" dense @click="props.stat.checked = !props.stat.checked" size="sm") 
	// 	q-icon(v-if='props.stat.checked' name="mdi-eye" color="secondary" size='16px')
	// 	q-icon(v-else name="mdi-eye-off" color="secondary" size='16px')

</template>

<style scoped lang="scss">
.zero {
	display: flex;
	align-items: center;
	cursor: pointer;
}

.oper {
	border: 1px solid #ccc;
	padding: .1rem .5rem;
	border-radius: .25rem;
	min-width: 40px;
	text-align: center;

	&:hover {
		border-color: $primary;
		background: white;
	}


}

.trig {
	font-size: 1.3rem;
	transition: 0.2s ease all;

	&.closed {
		transform: rotate(-90deg);
	}
}

.node {
	min-height: 32px;
	position: relative;
	display: flex;
	align-items: center;
	cursor: pointer;

	.close {
		display: none;
		// position: absolute;
		// right: .25rem;
		// top: 50%;
		// transform: translateY(-50%);
	}

	&:hover {
		background-color: #ededed;

		.close {
			display: block;
		}
	}
}
</style>

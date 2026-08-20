<script setup lang="ts">
// import Component from '@/components/condition/StartCondition.vue'
import { reactive } from 'vue'
import Component from '@/components/view/Data.vue'

const draft = reactive({
	id: 'col-1787214856080-1',
	type: '',
	text: 'Колонка 1',
	kind: null,
	newkind: null,
	children: [] as any,
	sort: false,
	order: 'up',
	hide: false,
	source: 'field',
})
</script>

<template lang="pug">
q-page(padding)
	.cont
		div
			Component(v-model:draft="draft")
</template>

<style scoped lang="scss">
.cont {
	display: flex;
	> div {
		margin: auto;
		width: 500px;
		justify-content: center;
		align-items: center;
	}
}
</style>

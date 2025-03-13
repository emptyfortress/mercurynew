<script setup lang="ts">
import { computed } from 'vue'
import IconFaceMask from '@/components/icons/IconFaceMask.vue'
import IconRocket from '@/components/icons/IconRocket.vue'
import { usePanels } from '@/stores/panels'
import { useTree } from '@/stores/tree'

const panels = usePanels()
const mytree = useTree()

const zero = computed(() => {
	return mytree.len == 0 ? true : false
})
const hid = computed(() => {
	if (mytree.len > 0 && panels.condL.length == 0) {
		return true
	} else return false
})

</script>

<template lang="pug">
.preview
	// .empty(v-if='panels.condL.length == 0')
	.empty(v-if='zero')
		IconFaceMask.big
		div() Запрос не настроен.
	.empty(v-if='hid')
		IconRocket.big
		div() Запрос не содержит параметров.
	.grid(v-else)
		template(v-for="item in panels.condL")
			div {{ item[0].text }}:
			q-input(v-model="item[2].text" dense filled :disable="item[0].selected")
			q-toggle(:model-value="!item[0].selected" @update:model-value="(val) => item[0].selected = !val" dense size="sm")

	.action(v-if='hid || !zero')
		q-btn(unelevated color="primary" label="Искать" @click="") 

</template>

<style scoped lang="scss">
.preview {
	padding: 1rem;
}

.action {
	grid-column: 1/-1;
	margin-top: 1rem;
	width: 100%;
}

.empty {
	text-align: center;
	color: $secondary;
}

.big {
	font-size: 3rem;
	color: $secondary;
}

.grid {
	display: grid;
	grid-template-columns: auto 1fr auto;
	justify-items: start;
	align-items: center;
	column-gap: 1rem;
	row-gap: .5rem;

	.q-input {
		width: 100%;
	}
}

.hid {
	opacity: .5;
	background: #dedede;
}
</style>

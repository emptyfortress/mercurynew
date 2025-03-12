<script setup lang="ts">
import IconFaceMask from '@/components/icons/IconFaceMask.vue'
import { usePanels } from '@/stores/panels'

const panels = usePanels()
</script>

<template lang="pug">
.preview
	.empty(v-if='panels.condL.length == 0')
		IconFaceMask.big
		div Запрос не настроен, либо все поля скрыты.
	.grid(v-else)
		template(v-for="item in panels.condL")
			div {{ item[0].text }}:
			q-input(v-model="item[2].text" dense filled)
			q-toggle(:model-value="!item[0].selected" @update:model-value="(val) => item[0].selected = !val" dense size="sm")

</template>

<style scoped lang="scss">
.preview {
	padding: 1rem;
}

.empty {
	text-align: center;
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
</style>

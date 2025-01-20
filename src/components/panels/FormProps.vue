<script setup lang="ts">
import { ref } from 'vue'
import IconAttribute from '@/components/icons/IconAttribute.vue'
import IconRelation from '@/components/icons/IconRelation.vue'
import FormPropsMain from '@/components/panels/FormPropsMain.vue'

const item1 = ref(true)
const item2 = ref(true)
</script>

<template lang="pug">
q-list(separator)
	q-expansion-item(v-model="item1")
		template(v-slot:header)
			q-item-section(side)
				IconAttribute.ic
			q-item-section.zg Атрибуты формы

		// q-list.prop
		// 	PropField
		FormPropsMain

	q-expansion-item(v-model="item2")
		template(v-slot:header)
			q-item-section(side)
				IconRelation.ic
			q-item-section.zg Дополнительно
</template>

<style scoped lang="scss">
.ic {
	font-size: 1.5rem;
	margin-right: .5rem;
	color: $secondary;
}

.zg {
	text-transform: uppercase;
	color: $secondary;
	text-align: left;
}
</style>

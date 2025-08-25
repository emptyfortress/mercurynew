<script setup lang="ts">
import { ref } from 'vue'
import IcBaselineDriveFileRenameOutline from '@/components/icons/IcBaselineDriveFileRenameOutline.vue'
// import CarbonPropertyRelationship from '@/components/icons/CarbonPropertyRelationship.vue'
import FormPropsMain from '@/components/panels/FormPropsMain.vue'

const item1 = ref(true)
const item2 = ref(true)
</script>

<template lang="pug">
q-list(separator)
	q-expansion-item(v-model="item1")
		template(v-slot:header)
			q-item-section(side)
				IcBaselineDriveFileRenameOutline.ic
			q-item-section.zg Атрибуты формы

		// q-list.prop
		// 	PropField
		FormPropsMain

	// q-expansion-item(v-model="item2")
		template(v-slot:header)
			q-item-section(side)
				CarbonPropertyRelationship.ic
			q-item-section.zg Дополнительно
</template>

<style scoped lang="scss">
.ic {
	font-size: 1.5rem;
	margin-right: 0.5rem;
	color: $secondary;
}

.zg {
	text-transform: uppercase;
	color: $secondary;
	text-align: left;
}
</style>

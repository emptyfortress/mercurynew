<script setup lang="ts">
import IcBaselineDriveFileRenameOutline from '@/components/icons/IcBaselineDriveFileRenameOutline.vue'
// import CarbonPropertyRelationship from '@/components/icons/CarbonPropertyRelationship.vue'
import FormPropsMain from '@/components/panels/FormPropsMain.vue'
import ExpansionItem from '@/components/ExpansionItem.vue'
</script>

<template lang="pug">
q-list(separator)
	ExpansionItem(title="Атрибуты формы" :icon="IcBaselineDriveFileRenameOutline")
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
</style>

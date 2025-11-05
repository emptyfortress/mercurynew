<script setup lang="ts">
import { computed } from 'vue'
import SiTableColumnsLine from '@/components/icons/SiTableColumnsLine.vue'
import ColumnList from '@/components/ColumnList.vue'
import ThemeList from '@/components/ThemeList.vue'
import SolarPallete2Linear from '@/components/icons/SolarPallete2Linear.vue'
import MaterialSymbolsColors from '@/components/icons/MaterialSymbolsColors.vue'
import DrawBottom from '@/components/DrawBottom.vue'
import { useKeys } from '@/stores/keys'
import ExpansionItem from '@/components/ExpansionItem.vue'

const { columns } = useKeys()

const hei = computed(() => {
	let tmp = window.innerHeight - 205
	return 'height: ' + tmp + 'px;'
})
</script>

<template lang="pug">
q-scroll-area(:style='hei')
	q-list(separator)
		ExpansionItem(title="Колонки" :icon="SiTableColumnsLine")
			ColumnList(:cols='columns')

		ExpansionItem(title="Тема оформления" :icon="SolarPallete2Linear" :start-expanded="false")
			ThemeList

		ExpansionItem(title="Подсветка" :icon="MaterialSymbolsColors" :start-expanded="false")
			DrawBottom
</template>

<style scoped lang="scss">
:deep(.q-scrollarea) {
	// height: calc(100vh - 120px);
	// background: #ccc;
	overflow: auto;
}
.info {
	position: absolute;
	bottom: 0;
}

.q-tab {
	label {
		text-transform: capitalize;
		cursor: pointer;
	}
}
</style>

<script setup lang="ts">
import { ref, computed } from 'vue'
import IconTableColumns from '@/components/icons/IconTableColumns.vue'
import ColumnList from '@/components/ColumnList.vue'
import ThemeList from '@/components/ThemeList.vue'
import IconPallete from '@/components/icons/IconPallete.vue'
import IconPaint from '@/components/icons/IconPaint.vue'
import DrawBottom from '@/components/DrawBottom.vue'
import { useKeys } from '@/stores/keys'

const { columns } = useKeys()

const item1 = ref(true)
const item2 = ref(false)
const item3 = ref(false)

const hei = computed(() => {
	let tmp = window.innerHeight - 205
	return 'height: ' + tmp + 'px;'
})
</script>

<template lang="pug">
q-scroll-area(:style='hei')
	q-list(separator)
		q-expansion-item(v-model="item1")
			template(v-slot:header)
				q-item-section(side)
					IconTableColumns.ic
				q-item-section.zg Колонки
			ColumnList(:cols='columns')

		q-expansion-item(v-model="item2")
			template(v-slot:header)
				q-item-section(side)
					IconPallete.ic
				q-item-section.zg Тема оформления
			ThemeList

		q-expansion-item(v-model="item3")
			template(v-slot:header)
				q-item-section(side)
					IconPaint.ic
				q-item-section.zg Подсветка
			DrawBottom
</template>

<style scoped lang="scss">
:deep(.q-scrollarea) {
	// height: calc(100vh - 120px);
	// background: #ccc;
	overflow: auto;
}
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

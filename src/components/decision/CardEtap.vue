<script setup lang="ts">
import { computed, ref } from 'vue'
import ParamPanel from '@/components/cardpanels/ParamPanel.vue'

const activeTab = ref('param')
</script>

<template lang="pug">
.q-ma-md
	q-tabs(v-model="activeTab" align="left" activeColor="primary" indicatorColor="primary")
		q-tab(name='param' label='Параметры этапа')
		q-tab(name='task' label='Настройки заданий')
		q-tab(name='addition' label='Дополнительные настройки')
		q-tab(name='logic' label='Специальная логика этапа')

	q-tab-panels(v-model="activeTab" animated)
		q-tab-panel(name="param")
			ParamPanel
		q-tab-panel(name="task")
		q-tab-panel(name="addition")
		q-tab-panel(name="logic")
</template>

<style scoped lang="scss">
.q-tabs {
	border-bottom: 1px solid var(--my-border-color);
}
.q-tab-panels {
	background: transparent;
	// border-top: 1px solid #999;
}
</style>

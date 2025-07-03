<script setup lang="ts">
import { ref } from 'vue'
import VersionDb from '@/components/VersionDb.vue'
import VersionHistory1 from '@/components/VersionHistory1.vue'
import Access from '@/components/Access.vue'
import VersionLog from '@/components/VersionLog.vue'
import VersionTable from '@/components/VersionTable.vue'

const tab = ref('db')
</script>

<template lang="pug">
q-page(padding)
	.cont()
		.hd
			q-icon(name="mdi-cloud-cog-outline" color="primary")
			|Настройки публикаций
		q-tabs(
			v-model="tab"
			no-caps
			align="center"
		)
			q-tab(name="db" label="Базы данных")
			q-tab(name="version" label="Управление версиями")
			q-tab(name="access" label="Права на публикацию")
			q-tab(name="log" label="Журнал публикаций")

		q-tab-panels(v-model="tab" animated transition-prev="jump-up" transition-next="jump-up")
			q-tab-panel(name='db')
				VersionDb
			q-tab-panel(name='version')
				VersionHistory1
			q-tab-panel(name='access')
				Access
			q-tab-panel(name='log')
				VersionLog
				br
				VersionTable
</template>

<style scoped lang="scss">
// .cont {
// 	max-width: 1000px;
// 	margin: 0 auto;
// }
.hd {
	font-size: 1.5rem;
	text-align: center;
	margin-bottom: 1rem;
	.q-icon {
		margin-bottom: 4px;
		margin-right: 0.5rem;
	}
}
.q-tabs {
	border-bottom: 1px solid $secondary;
}
.q-tab-panel {
	min-height: calc(100vh - 190px);
}
.q-tab-panels {
	background: transparent;
}
</style>

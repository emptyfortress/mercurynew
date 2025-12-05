<script setup lang="ts">
import { computed } from 'vue'
import { useStorage } from '@vueuse/core'
import { useRoute } from 'vue-router'
import { date } from 'quasar'
import { useChangesStore } from '@/stores/changes'
import { storeToRefs } from 'pinia'

const route = useRoute()
const app = useStorage('app', localStorage)

const changesStore = useChangesStore()
const { hasChanges } = storeToRefs(changesStore)

const footerState = computed(() => {
	return route.meta.footer ? true : false
})

const modified = computed(() => {
	if (!app.value.versions || !app.value.versions[0] || !app.value.versions[0].modified) return ''
	return date.formatDate(app.value.versions[0].modified, 'DD.MM.YY  HH:mm')
})

const localCreated = computed(() => {
	if (!app.value.versions || !app.value.versions[0] || !app.value.versions[0].created) return ''
	return date.formatDate(app.value.versions[0].created, 'DD.MM.YY HH:mm')
})
</script>

<template lang="pug">
q-footer.footer(v-if='footerState')
	.cent(data-tour='footer-main')
		div(v-if="app.versions && app.versions.length > 0") Версия: {{ app.versions[0].label }}
		div(v-if="app.versions && app.versions.length > 0") Автор: {{ app.versions[0].author }}
		div(v-if="app.versions && app.versions.length > 0") Создано: {{ localCreated }}

	.cent(data-tour='footer-save')
		div(v-if='app.versions && app.versions.length > 0 && app.versions[0].modified == null && !hasChanges')
			q-icon.q-mr-sm(name="mdi-circle-slice-8" color="positive")
			span Все изменения сохранены
		div(v-if='app.versions && app.versions.length > 0 && app.versions[0].modified !== null && !hasChanges')
			q-icon.q-mr-sm(name="mdi-circle-slice-8" color="positive")
			span Сохранено: {{modified}} -- Орлов П.С.
		div(v-if='hasChanges')
			q-icon.q-mr-sm(name="mdi-circle-slice-8" color="negative")
			span Есть несохраненные изменения (доступ к странице для других пользователей ограничен)

</template>

<style scoped lang="scss">
.footer {
	background: hsl(202 33% 92% / 1);
	box-shadow: 0 -1px 4px rgba($color: #000000, $alpha: 0.15);
	color: #444;
	padding: 3px 2rem;
	display: flex;
	justify-content: space-between;
	.cent {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 3rem;
		font-size: 0.8rem;
	}
}
</style>

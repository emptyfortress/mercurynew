<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { processHomePath } from '@/composables/useProcessExplorer'
const route = useRoute()
const homePath = computed(() => processHomePath(route.query.from))
defineProps<{ name: string; dirty: boolean; canSave: boolean; canRun: boolean; canAddStep: boolean }>()
const emit = defineEmits<{ save: []; run: []; addStep: [] }>()
</script>

<template lang="pug">
.constructor-toolbar
	.row.items-center.justify-between.q-gutter-sm
		div
			.text-overline.text-blue-grey-6 Шаблон процесса
			.text-subtitle2 {{ name || 'Выберите шаблон' }}
		.row.items-center.q-gutter-xs
			q-chip(v-if="dirty" size="sm" color="amber") Есть изменения
	.row.items-center.q-gutter-xs.q-mt-sm
		q-btn(flat dense size="sm" color="primary" icon="dashboard" label="Все процессы" :to="homePath")
		q-btn(unelevated size="sm" color="primary" icon="save" label="Сохранить" :disable="!canSave" @click="emit('save')")
		q-btn(unelevated size="sm" color="positive" icon="play_arrow" label="Запустить экземпляр" :disable="!canRun" @click="emit('run')")
		q-btn(flat dense size="sm" color="primary" icon="add" label="Добавить шаг" :disable="!canAddStep" @click="emit('addStep')")
		q-btn(flat dense size="sm" color="primary" icon="mdi-glasses" label="Монитор экземпляра" :to="{ path: '/dvmain/process/monitorsingle', query: { from: homePath } }")
		q-btn(flat dense size="sm" color="primary" icon="monitor_heart" label="Мониторинг" :to="{ path: '/dvmain/process/monitor', query: { from: homePath } }")
</template>

<style scoped>
.constructor-toolbar { flex-shrink: 0; padding-bottom: 1rem; border-bottom: 1px solid var(--my-border-color); }
</style>

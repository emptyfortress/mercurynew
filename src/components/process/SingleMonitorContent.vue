<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { processHomePath } from '@/composables/useProcessExplorer'
import { workflowPrototype } from '@/composables/useWorkflowPrototype'
import ProcessInstanceSteps from './ProcessInstanceSteps.vue'
import ProcessInstanceDetails from './ProcessInstanceDetails.vue'
import ProcessInstanceEvents from './ProcessInstanceEvents.vue'
import ProcessStatusBadge from './ProcessStatusBadge.vue'

const route = useRoute()
const router = useRouter()
const homePath = computed(() => processHomePath(route.query.from))
const instanceId = computed(() =>
	String(route.query.instance ?? workflowPrototype.instances[0]?.id ?? '')
)
const instance = computed(
	() => workflowPrototype.instances.find((item) => item.id === instanceId.value) ?? null
)
const template = computed(
	() => workflowPrototype.templates.find((item) => item.id === instance.value?.templateId) ?? null
)

function openTemplate() {
	if (!instance.value || !template.value) return
	void router.push({
		path: '/dvmain/process/constructor',
		query: { template: instance.value.templateId, from: homePath.value },
	})
}
</script>

<template lang="pug">
.workflow-page
	.row.items-center.justify-between.q-mb-md
		div
			.text-h5 Монитор экземпляра
			.text-caption.text-grey-7 Детали выполнения и история событий
		.row.items-center.q-gutter-sm
			q-btn(flat color="primary" icon="dashboard" label="Все процессы" :to="homePath")
			q-btn(flat color="primary" icon="list" label="К мониторингу" :to="{ path: '/dvmain/process/monitor', query: { from: homePath } }")
			q-btn(flat color="primary" icon="account_tree" label="Открыть шаблон" :disable="!template" @click="openTemplate")

	q-card.flat.bordered(v-if="instance")
		q-card-section
			.row.items-start.justify-between.q-gutter-md
				div
					.text-h6 {{ instance.templateName }}
					.text-body2.text-grey-7 {{ instance.id }}
				ProcessStatusBadge.q-mt-xs(:status="instance.status")
		q-separator
		.row.q-col-gutter-md
			.col-12.col-md-7
				q-card-section
					.text-subtitle1.q-mb-md Ход процесса
					ProcessInstanceSteps(:instance="instance" :template="template")
			.col-12.col-md-5
				ProcessInstanceDetails(:instance="instance" compact)
				q-separator
		q-card-section
			.text-subtitle1.q-mb-sm История событий
			ProcessInstanceEvents(:instance="instance")
	q-card.flat.bordered(v-else)
		q-card-section.text-center.text-grey-7 Экземпляр не найден. Вернитесь к мониторингу и выберите процесс.
</template>

<style scoped>
.workflow-page { max-width: 1440px; margin: 0 auto; }
</style>

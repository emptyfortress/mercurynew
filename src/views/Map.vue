<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import AppVersionTable from '@/components/AppVersionTable.vue'
import Mapping from '@/components/Mapping.vue'
import DbListTable from '@/components/DbListTable.vue'
import { useStorage } from '@vueuse/core'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const app = useStorage('app', localStorage)

const step = ref(3)

const selection1 = ref<any[]>([])
const selection2 = ref<any[]>([])
const autoMoved = ref(false) // флаг, чтобы переходить только 1 раз

const step1Title = computed(() =>
	selection1.value.length ? `Версия: ${selection1.value[0].version}` : 'Выберите версию приложения'
)
const step2Title = computed(() =>
	selection2.value.length
		? `БД: ${selection2.value[0].server}`
		: 'Выберите базу данных для публикации'
)

watch(selection1, (val) => {
	if (val.length && !autoMoved.value) {
		autoMoved.value = true
		setTimeout(() => {
			step.value = 2
		}, 500)
	}
})
watch(selection2, (val) => {
	if (val.length) {
		step.value = 3
	}
})

const action = () => {
	router.push('/publications')
}
</script>

<template lang="pug">
q-page(padding)
	.cont
		.hd Публикация приложения: {{ app.app }}
		q-stepper(
			flat
			v-model="step"
			vertical
			color="primary"
			inactive-color="secondary"
			done-color="primary"
			header-nav
			animated)

			q-step(
				:name="1"
				:title="step1Title"
				prefix="1"
				:done="step > 1")
				AppVersionTable(v-model:selection="selection1")

			q-step(
				:name="2"
				:title="step2Title"
				prefix="2"
				:done="step > 2")
				DbListTable(v-model:selection="selection2")

			q-step(
				:name="3"
				title="Настройте маппинг справочников"
				prefix="3"
				:done="step > 3")
				Mapping

		br
		q-card-actions(align='center')
			q-btn(flat color="primary" label="Отмена" ) 
			q-btn(unelevated color="primary" label="Опубликовать" @click='action') 

</template>

<style scoped lang="scss">
.q-page {
	--width: 1000px;
}
.cont {
	max-width: var(--width);
	margin: 1rem auto;
}
.hd {
	font-size: 1.3rem;
}
.q-stepper {
	background: initial;
	// font-size: 0.9rem;
	// max-width: 1200px;
}
</style>

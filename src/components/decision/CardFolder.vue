<script setup lang="ts">
import { ref, watch } from 'vue'
import { useApproveStore } from '@/stores/approveStore'
import MaterialSymbolsAltRoute from '@/components/icons/MaterialSymbolsAltRoute.vue'
import CreateDialog2 from '@/components/decision/CreateDialog2.vue'
import type { NameTranslations } from '@/constants/locales'
import { translationLocales } from '@/constants/locales'

const approveStore = useApproveStore()
const name = ref(approveStore.selectedElement?.text)
const nameTranslations = ref<NameTranslations>({
	...(approveStore.selectedElement?.nameTranslations ?? {}),
})
const showNameTranslations = ref(false)

const creationDate = '2024-01-15'
const author = approveStore.selectedElement?.author || 'System'

watch(name, (val) => {
	if (val) {
		approveStore.tempName = val
	}
})

watch(
	nameTranslations,
	(val) => {
		approveStore.tempNameTranslations = { ...val }
	},
	{ deep: true }
)

const dialog = ref(false)

const modes = ['folder', 'approve', 'route', 'etap'] as const
const mode = ref('folder')

const add = (n: number) => {
	mode.value = modes[n]
	dialog.value = !dialog.value
}
</script>

<template lang="pug">
.q-ma-md
	fieldset
		legend Общие
		.row.q-col-gutter-md
			.col-6
				q-input(v-model="name" label="Название" outlined dense)
					template(v-slot:append)
						q-btn(flat round dense icon="mdi-translate" color="secondary" type="button" @click="showNameTranslations = !showNameTranslations")
							q-tooltip Переводы названия
				.q-pl-sm.q-mt-md(v-if='showNameTranslations')
					.text-caption.q-mb-xs Локализации
					q-input(
						v-for="locale in translationLocales"
						:key="locale.code"
						v-model="nameTranslations[locale.code]"
						:label="locale.label"
						outlined
						dense
						class="q-mb-sm"
					)
			.col-3
				q-input(:model-value="creationDate" label="Дата создания" outlined dense readonly)
			.col-3
				q-input(:model-value="author" label="Автор" outlined dense readonly)

	.grid2
		fieldset
			legend Создать в текущей папке
			.q-gutter-x-sm
				q-btn(flat color="primary" label="Папка" @click="add(0)" icon="mdi-folder-plus-outline") 
				q-btn(flat  color="primary" label="Согласование" @click="add(1)" icon="mdi-message-check-outline") 
				q-btn(flat  color="primary" @click="add(2)") 
					.row.items-center.q-gutter-x-sm
						MaterialSymbolsAltRoute(style='font-size: 1.3rem')
						label Маршрут
				q-btn(flat color="primary" label="Этап" @click="add(3)" icon="mdi-flag-triangle") 
	CreateDialog2(v-model="dialog" :mode="mode")
</template>

<style scoped lang="scss">
.tt {
	float: left;
}
</style>

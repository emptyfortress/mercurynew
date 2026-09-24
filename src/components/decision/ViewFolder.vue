<script setup lang="ts">
import { ref, watch } from 'vue'
import { useSimpleStore } from '@/stores/simpleStore'
// import MaterialSymbolsAltRoute from '@/components/icons/MaterialSymbolsAltRoute.vue'
import CreateDialog3 from '@/components/decision/CreateDialog3.vue'
import { useRouter } from 'vue-router'
import type { NameTranslations } from '@/constants/locales'
import { translationLocales } from '@/constants/locales'

const router = useRouter()
const store = useSimpleStore()
const name = ref(store.selectedElement?.text)
const nameTranslations = ref<NameTranslations>({ ...(store.selectedElement?.nameTranslations ?? {}) })
const showNameTranslations = ref(false)

const changed = ref(false)

watch(name, (val) => {
	if (val) {
		changed.value = true
	}
}, { flush: 'sync' })

watch(nameTranslations, () => {
	changed.value = true
}, { deep: true, flush: 'sync' })

watch(() => store.selectedElement, (element) => {
	name.value = element?.text ?? ''
	nameTranslations.value = { ...(element?.nameTranslations ?? {}) }
	showNameTranslations.value = false
	changed.value = false
}, { immediate: true })

const save = () => {
	if (store.selectedElement && name.value) {
		store.selectedElement.text = name.value
		store.selectedElement.nameTranslations = Object.fromEntries(
			translationLocales
				.map(({ code }) => [code, nameTranslations.value[code]?.trim() ?? ''] as const)
				.filter(([, value]) => value.length > 0)
		) as NameTranslations
		changed.value = false
	}
}

const undo = () => {
	if (store.selectedElement && name.value) {
		name.value = store.selectedElement.text
		nameTranslations.value = { ...(store.selectedElement.nameTranslations ?? {}) }
		showNameTranslations.value = false
		changed.value = false
	}
}

const dialog = ref(false)

const modes = ['folder', 'view'] as const
const mode = ref('folder')

const add = (n: number) => {
	mode.value = modes[n]
	dialog.value = !dialog.value
}

const remove = () => {
	router.push('/dvmain/views/')
	setTimeout(() => {
		store.toggleDelete()
	}, 200)
}

const showRemove = ref(false)
</script>

<template lang="pug">
.q-ma-md
	fieldset
		legend Общие
		.grid
			.name-field
				q-input(v-model="name" label="Название" dense outlined)
					template(v-slot:append)
						q-btn(flat round dense icon="mdi-translate" color="secondary" type="button" aria-label="Переводы названия" @click="showNameTranslations = !showNameTranslations")
							q-tooltip Переводы названия
				.q-pl-sm.q-mt-md(v-if="showNameTranslations")
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
			q-btn(unelevated color="primary" label="Сохранить" :disable='!changed' @click="save") 
			q-btn(flat color="primary" label="Отмена" :disable='!changed' @click="undo") 

	// .grid2
		fieldset
			legend Создание
			.q-gutter-x-sm
				q-btn(unelevated color="primary" label="Папка" @click="add(0)" icon="mdi-folder-plus-outline") 
				q-btn(unelevated color="primary" label="Представление" @click="add(1)" icon="mdi-table") 

		fieldset
			legend Удаление
			.row.items-center
				q-btn(:disable='showRemove' unelevated color="primary" label="Удалить папку" @click="showRemove = true" icon="mdi-delete-outline") 
				.q-ml-xl.row.q-gutter-x-sm.text-negative.text-bold.items-center(v-if='showRemove')
					q-icon(name="mdi-alert-outline" color="negative" size="md")
					div Содержимое папки будет удалено!
					q-btn.q-ml-lg(flat color="primary" label="Отмена" @click="showRemove = false") 
					q-btn(unelevated color="negative" label="Удалить!" @click="remove") 

	CreateDialog3(v-model="dialog" :mode="mode")
</template>

<style scoped lang="scss">
.grid {
	display: grid;
	grid-template-columns: 1fr auto auto auto;
	align-items: center;
	column-gap: 1rem;
	row-gap: 0.5rem;
}
.name-field {
	min-width: 0;
}
.tt {
	float: left;
}
</style>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useSimpleStore } from '@/stores/simpleStore'
import type { NameTranslations } from '@/constants/locales'
import { translationLocales } from '@/constants/locales'

const props = defineProps({
	mode: {
		type: String,
		default: 'folder',
	},
})
const modelValue = defineModel<boolean>()

const store = useSimpleStore()

const model = ref('')
const nameTranslations = ref<NameTranslations>({})
const showNameTranslations = ref(false)
watch(modelValue, (isOpen) => {
	if (isOpen) {
		nameTranslations.value = {}
		showNameTranslations.value = false
	}
})

const modes = ['folder', 'view'] as const

const calcFileType = computed(() => {
	switch (props.mode) {
		case 'folder':
			return modes[0]
		case 'view':
			return modes[1]
		default:
			return modes[0]
	}
})

const submitForm = () => {
	store.toggleAdd({
		id: Date.now().toString(),
		text: model.value,
		nameTranslations: { ...nameTranslations.value },
		type: props.mode == 'folder' ? 0 : 1,
		children: [],
		parentId: store.selectedElement?.id,
	})
}
</script>

<template lang="pug">
q-dialog(v-model="modelValue" backdrop-filter="blur(4px) saturate(150%)"  @hide="model = ''")
	q-card(style="min-width: 400px;")
		q-btn.close(round color="negative" icon="mdi-close" v-close-popup)
		q-card-section
			.text-h6(v-if="props.mode == 'folder'") Создать папку
			.text-h6(v-if="props.mode == 'view'") Создать представление
			.text-h6(v-if="props.mode == 'approve'") Создать согласование
			.text-h6(v-if="props.mode == 'route'") Создать маршрут
			.text-h6(v-if="props.mode == 'etap'") Создать этап

		q-form(ref='form' @submit="submitForm")
			.section
				label Название:
				q-input(ref="input"
					v-model="model"
					autofocus
					dense
					clearable
					outlined
					:rules="[val => !!val || 'Это обязательное поле']"
					hint='Название должно быть уникальным?'
				)
					template(v-if='props.mode == "folder" || props.mode == "view"' v-slot:append)
						q-btn(flat round dense icon="mdi-translate" color="secondary" type="button" aria-label="Переводы названия" @click="showNameTranslations = !showNameTranslations")
							q-tooltip Переводы названия
				.q-pl-sm.q-mt-md(v-if='(props.mode == "folder" || props.mode == "view") && showNameTranslations')
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

			q-card-actions(align="right")
				q-btn(flat color="primary" label="Отмена" v-close-popup) 
				q-btn(unelevated color="primary" label="Создать" type='submit' v-close-popup) 

</template>

<style scoped lang="scss">
.section {
	margin: 1rem;
	margin-top: 0;
}
.q-card__actions {
	margin-right: 0.5rem;
	margin-bottom: 0.5rem;
}
</style>

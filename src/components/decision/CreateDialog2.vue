<script setup lang="ts">
import { ref, computed } from 'vue'
import { useApproveStore } from '@/stores/approveStore'
import { FileType } from '../condition/conditionTypes'

const props = defineProps({
	mode: {
		type: String,
		default: 'folder',
	},
})
const modelValue = defineModel<boolean>()

const approveStore = useApproveStore()

const model = ref('')

const modes = [FileType.Folder, FileType.Approving, FileType.Route, FileType.Stage] as const

const calcFileType = computed(() => {
	switch (props.mode) {
		case 'folder':
			return modes[0]
		case 'approve':
			return modes[1]
		case 'route':
			return modes[2]
		case 'etap':
			return modes[3]
		default:
			return modes[0]
	}
})

const submitForm = () => {
	approveStore.toggleAdd({
		id: Date.now().toString(),
		text: model.value,
		filetype: calcFileType.value,
		children: [],
	})
}
</script>

<template lang="pug">
q-dialog(v-model="modelValue" backdrop-filter="blur(4px) saturate(150%)"  @hide="model = ''")
	q-card(style="min-width: 400px;")
		q-btn.close(round color="negative" icon="mdi-close" v-close-popup)
		q-card-section
			.text-h6(v-if="props.mode == 'folder'") Создать папку
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

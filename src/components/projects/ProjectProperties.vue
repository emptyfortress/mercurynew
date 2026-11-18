<script setup lang="ts">
import { ref, watch } from 'vue'
import MaterialSymbolsListAltCheckOutline from '@/components/icons/MaterialSymbolsListAltCheckOutline.vue'
import type { IProject } from './Types'

const props = defineProps<{ project: IProject; readonly: boolean }>()
const iconFile = ref<File | null>(null)
const iconError = ref('')
let iconRequest = 0

watch(() => props.project, () => {
	iconRequest++
	iconFile.value = null
	iconError.value = ''
})

async function selectIcon(file: File | null) {
	const request = ++iconRequest
	iconError.value = ''
	if (!file || props.readonly) return
	if (!['image/png', 'image/svg+xml'].includes(file.type)) {
		iconError.value = 'Выберите изображение PNG или SVG.'
		return
	}
	const project = props.project
	const reader = new FileReader()
	reader.onload = () => {
		if (request !== iconRequest || props.readonly || props.project !== project) return
		project.icon = String(reader.result ?? '')
	}
	reader.onerror = () => { iconError.value = 'Не удалось прочитать изображение. Выберите файл снова.' }
	reader.readAsDataURL(file)
}

function removeIcon() {
	iconRequest++
	props.project.icon = ''
	iconFile.value = null
	iconError.value = ''
}
</script>

<template lang="pug">
.project-properties
	.project-properties__row
		label.project-properties__label(for="project-name") Название
		q-input(
			for="project-name" v-model="project.name" dense outlined hide-bottom-space
			:readonly="readonly"
			:rules="[value => !!value?.trim() || 'Введите название проекта']"
		)
	.project-properties__row
		label.project-properties__label(for="project-version") Версия
		q-input(
			for="project-version" v-model="project.version" dense outlined hide-bottom-space
			:readonly="readonly"
			:rules="[value => !!value?.trim() || 'Введите версию проекта']"
		)
	.project-properties__row
		span.project-properties__label(id="project-mode-label") Режим проекта
		div
			slot(name="mode")
	.project-properties__row
		label.project-properties__label(:for="readonly ? undefined : 'project-icon'") Иконка проекта
		.project-properties__icon
			q-avatar.project-properties__preview(size="40px" rounded)
				img(v-if="project.icon" :src="project.icon" alt="Иконка проекта")
				q-icon(v-else color="primary")
					MaterialSymbolsListAltCheckOutline
			q-file.project-properties__file(
				v-if="!readonly" for="project-icon" v-model="iconFile" dense outlined
				accept="image/png,image/svg+xml" :error="!!iconError" :error-message="iconError"
				hint="Необязательно · PNG или SVG" @update:model-value="selectIcon"
			)
			q-btn(
				v-if="project.icon && !readonly" flat round dense icon="mdi-close"
				title="Удалить иконку" @click="removeIcon"
			)
</template>

<style scoped lang="scss">
.project-properties {
	display: grid;
	gap: 1rem;
	width: 100%;
	max-width: 820px;
	container-type: inline-size;
}

.project-properties__row {
	display: grid;
	grid-template-columns: 220px minmax(0, 1fr);
	align-items: start;
	gap: 0.5rem;
}

.project-properties__label {
	padding-top: 10px;
	color: #555;
}

.project-properties__label::after {
	content: ':';
}

.project-properties__icon {
	display: flex;
	align-items: flex-start;
	gap: 0.75rem;
	min-width: 0;
}

.project-properties__file {
	flex: 1;
	min-width: 0;
}

.project-properties__preview {
	flex-shrink: 0;
	background: var(--bg-panel, #f5f5f5);
}

@container (max-width: 560px) {
	.project-properties__row {
		grid-template-columns: minmax(0, 1fr);
	}

	.project-properties__label {
		padding-top: 0;
	}
}
</style>

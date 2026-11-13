<script setup lang="ts">
import type { INumeratorAffix } from './types'

defineProps<{ label: string }>()
const affix = defineModel<INumeratorAffix>({ required: true })
const modes = [
	{ label: 'Текст', value: 'text' as const },
	{ label: 'Код XSLT', value: 'xslt' as const },
]
</script>

<template lang="pug">
.affix-editor
	.text-caption.text-black.q-mb-xs {{ label }}
	.row.no-wrap.items-start.q-gutter-x-md
		.col
			q-input(
				v-if="affix.mode === 'text'", :model-value="affix.text", outlined, dense, clearable,
				@update:model-value="affix.text = String($event ?? '')"
			)
			q-input.affix-editor__code(
				v-else, :model-value="affix.xslt", outlined, type="textarea", autogrow, clearable,
				:spellcheck="false",
				:rules="[value => !!value?.trim() || 'Введите код преобразования']",
				@update:model-value="affix.xslt = String($event ?? '')"
			)
		.affix-editor__modes.row.no-wrap.items-center.q-gutter-x-sm
			q-radio(
				v-for="mode in modes", :key="mode.value", v-model="affix.mode",
				:val="mode.value", :label="mode.label", dense, size="xs", color="primary"
			)
</template>

<style scoped lang="scss">
.affix-editor__modes {
	min-height: 40px;
	flex-shrink: 0;
}

.affix-editor__code :deep(textarea) {
	min-height: 120px;
	font-family: monospace;
}
</style>

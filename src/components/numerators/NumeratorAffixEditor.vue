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
	.row.items-center.justify-between.q-mb-sm.q-gutter-sm
		.text-caption.text-black {{ label }}
		.row.items-center.q-gutter-sm
			q-radio(
				v-for="mode in modes", :key="mode.value", v-model="affix.mode",
				:val="mode.value", :label="mode.label", dense, size="xs", color="primary"
			)
	q-input(
		v-if="affix.mode === 'text'", v-model="affix.text", outlined, dense,
		hint="Необязательно"
	)
	q-input.affix-editor__code(
		v-else, v-model="affix.xslt", outlined, type="textarea", autogrow,
		:spellcheck="false",
		:rules="[value => !!value?.trim() || 'Введите код преобразования']"
	)
</template>

<style scoped lang="scss">
.affix-editor__code :deep(textarea) {
	min-height: 120px;
	font-family: monospace;
}
</style>

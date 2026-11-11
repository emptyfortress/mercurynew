<script setup lang="ts">
import type { INumeratorAffix } from './types'

defineProps<{ label: string }>()
const affix = defineModel<INumeratorAffix>({ required: true })
const modes = [
	{ label: 'Текст', value: 'text' },
	{ label: 'Код XSLT', value: 'xslt' },
]
</script>

<template lang="pug">
.affix-editor
	.row.items-center.justify-between.q-mb-sm.q-gutter-sm
		.text-subtitle2 {{ label }}
		q-btn-toggle(
			v-model="affix.mode", :options="modes", no-caps, unelevated,
			toggle-color="primary", size="sm"
		)
	q-input(
		v-if="affix.mode === 'text'", v-model="affix.text", outlined, dense,
		:label="label", hint="Необязательно"
	)
	q-input.affix-editor__code(
		v-else, v-model="affix.xslt", outlined, type="textarea", autogrow,
		:label="label + ' — XSLT'", :spellcheck="false",
		:rules="[value => !!value?.trim() || 'Введите код преобразования']"
	)
</template>

<style scoped lang="scss">
.affix-editor__code :deep(textarea) {
	min-height: 120px;
	font-family: monospace;
}
</style>

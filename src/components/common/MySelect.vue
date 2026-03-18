<script setup lang="ts">
interface Props {
	options?: any[]
	checkbox?: boolean
	label?: string
	info?: string
	descr?: string
	disable?: boolean
	readonly?: boolean
	after?: boolean
	prepend?: boolean
	emitValue?: boolean
	mapOptions?: boolean
}

const props = withDefaults(defineProps<Props>(), {
	options: () => ['Options 1', 'Option 2'],
	readonly: false,
	checkbox: false,
	after: false,
})

const main = defineModel<string>('main')
</script>

<template lang="pug">
div
	.label(v-if='props.label') {{ props.label }}:
	q-select(
		v-model="main",
		outlined,  dense,
		:emit-value='props.emitValue',
		:map-options='props.mapOptions',
		:options="props.options"
		:disable="props.disable"
		:readonly="props.readonly"
	)
		template(v-slot:prepend v-if='prepend')
			q-icon(name="mdi-book-open-variant-outline")
</template>

<style scoped lang="scss">
:deep(.q-select) {
	width: 100%;
}
:deep(.q-field__control:before) {
	background: var(--bgLight);
}
:deep(.q-field--dense .q-field__control, .q-field--dense .q-field__marginal) {
	height: 32px;
}

:deep(.q-field--auto-height.q-field--dense .q-field__native) {
	min-height: 32px;
}

:deep(
	.q-field--auto-height.q-field--dense .q-field__control,
	.q-field--auto-height.q-field--dense .q-field__native
) {
	min-height: 32px;
}

:deep(.q-field--dense .q-field__marginal) {
	height: 32px;
}
.label {
	font-size: 0.8rem;
	color: hsl(198 23% 53% / 1);
}
</style>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { requests } from '@/stores/tree1'
import { useForms } from '@/stores/forms'
import { uid } from 'quasar'

const props = defineProps({
	kind: {
		type: String,
		required: true,
		default: 'request',
	},
})
const modelValue = defineModel<boolean>()

const close = () => {
	modelValue.value = false
}

const req = ref(requests)

const myform = useForms()

const temp = ref([])

const chips = computed(() => {
	switch (props.kind) {
		case 'request':
			return req.value
		case 'view':
			return req.value
		default:
			return temp.value
	}
})

const select = (e: any) => {
	chips.value.map((item: any) => {
		item.selected = false
	})
	e.selected = true
}
const reset = () => {
	chips.value.map((item: any) => {
		item.selected = false
	})
}

const emit = defineEmits(['load'])
const loadForm = () => {
	let tmp = chips.value.find((el) => el.selected)
	if (!!tmp) {
		emit('load', tmp.label)
	}
	close()
	reset()
}

const name = computed(() => {
	switch (props.kind) {
		case 'request':
			return 'запрос'
		case 'view':
			return 'представление'
		default:
			return 'форму'
	}
})
</script>

<template lang="pug">
q-dialog(v-model="modelValue")
	q-card(style="min-width: 400px;")
		q-btn.close(round color="negative" icon="mdi-close" v-close-popup)
		q-card-section
			.text-h6 Выбрать {{ name }} из доступных

		q-form(@submit="loadForm")
			q-card-section
				q-chip(v-for="chip in chips"
					clickable
					:label="chip.label"
					v-model:selected="chip.selected"
					:key="chip.id"
					@click="select(chip)"
					)

			q-card-actions.q-mx-sm.q-mb-md(align="right")
				q-btn(flat color="primary" label="Отмена" @click="close")
				q-space
				q-btn(flat color="primary" label="Сбросить" @click="reset")
				q-btn(unelevated color="primary" label="Выбрать" type="submit")
</template>

<style scoped lang="scss">
.q-chip--selected {
	background: $primary;
	color: white;
}

:deep(.q-chip__icon) {
	color: white;
}
</style>

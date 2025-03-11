<script setup lang="ts">
import { ref } from 'vue'
import PersonalRoleOptions from '@/components/PersonalRoleOptions.vue'
import GroupRoleOptions from '@/components/GroupRoleOptions.vue'

const modelValue = defineModel<boolean>()
const role = defineModel<string>('role')
const pers = defineModel<string>('pers')


const close = () => {
	modelValue.value = false
}
const tabs = ref('personal')

const emit = defineEmits(['set'])
const save = () => {
	emit('set', pers.value)
	modelValue.value = false
}
</script>

<template lang="pug">
q-dialog(v-model="modelValue")
	q-card(style="min-width: 900px;")
		q-btn.close(round color="negative" icon="mdi-close" v-close-popup)
		q-card-section
			.text-h6
				|Правила выбора роли
				span.zg {{ role }}
		q-card-section
			q-tabs(v-model="tabs" dense active-color="primary" indicator-color="primary" align='left')
				q-tab(name="personal" label="Персональные роли")
				q-tab(name="group" label="Групповые роли")
			q-separator

			q-tab-panels(v-model="tabs")
				q-tab-panel(name="personal")
					PersonalRoleOptions(v-model="pers")

				q-tab-panel(name="group")
					GroupRoleOptions(v-model="pers")

		q-card-actions.q-mr-md.q-mb-md(align='right')
			q-btn(flat color="primary" label="Отмена" v-close-popup) 
			q-btn(unelevated color="primary" label="Сохранить" @click="save") 
</template>

<style scoped lang="scss">
.zg {
	margin-left: 2rem;
	color: $primary;
}
</style>

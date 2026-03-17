<script setup lang="ts">
import { computed } from 'vue'
import { useSimpleStore } from '@/stores/simpleStore'

const props = defineProps({
	roleId: {
		type: String,
		required: true,
		default: '',
	},
})

const store = useSimpleStore()

const currentRole = computed(() => {
	return store.roles.find((role) => role.id === props.roleId)
})

const roleLabel = computed(() => {
	return currentRole.value?.label || props.roleId
})

const updateLabel = (newLabel: string) => {
	store.updateRoleLabel(props.roleId, newLabel)
}

const updateCommon = (common: boolean) => {
	store.updateRoleCommon(props.roleId, common)
}
</script>

<template lang="pug">
q-page(padding)
	.container
		.text-h6
			span.edit {{ roleLabel }}
				q-popup-edit(v-model="roleLabel" @save="updateLabel" auto-save v-slot="scope")
					q-input(v-model="scope.value" dense autofocus counter @keyup.enter="scope.set")

		q-checkbox.q-my-md(dense label='Общая роль' :model-value="currentRole?.common" @update:model-value="updateCommon")
		p Правила определения роли:
		.q-gutter-x-sm
			q-btn(unelevated color="primary" label="Отмена" @click="" size='sm') 
			q-btn(unelevated color="primary" label="Отмена" @click="" size='sm')
</template>

<style scoped lang="scss">
.container {
	max-width: 1200px;
	margin: 0 auto;
}
.edit {
	border-bottom: 1px dotted $primary;
	color: $primary;
}
</style>

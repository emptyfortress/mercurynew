<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useSimpleStore } from '@/stores/simpleStore'
import RoleRuleTable from '@/components//decision/RoleRuleTable.vue'

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

// Local editable copies
const roleLabel = ref('')
const common = ref(false)
const isDirty = ref(false)

// Initialize local copies from store
watch(
	currentRole,
	(role) => {
		if (role) {
			roleLabel.value = role.label
			common.value = role.common
		}
	},
	{ immediate: true }
)

// Mark as dirty when user changes anything
const markDirty = () => {
	isDirty.value = true
}

// Save changes to store
const save = () => {
	if (props.roleId) {
		store.updateRoleLabel(props.roleId, roleLabel.value)
		store.updateRoleCommon(props.roleId, common.value)
		isDirty.value = false
	}
}

const reload = () => {
	roleLabel.value = currentRole.value!.label
	common.value = currentRole.value!.common
	isDirty.value = false
}

const toggleDirty = () => {
	isDirty.value = !isDirty.value
}
</script>

<template lang="pug">
q-page(padding)
	.container
		.row.justify-between
			.text-h6
				span.edit {{ roleLabel }}
					q-popup-edit(v-model="roleLabel" auto-save v-slot="scope")
						q-input(v-model="scope.value" dense autofocus counter @keyup.enter="scope.set" @update:model-value="markDirty")

			.q-gutter-x-sm(v-if='isDirty')
				q-btn(flat round icon="mdi-lock" color="primary") 
					q-tooltip Блокировка активна
				q-btn(@click="reload" flat color="primary" label="Отмена")
				q-btn(@click="save" color="primary" label="Сохранить")

		q-checkbox.q-my-md(dense label='Общая роль' v-model="common" @update:model-value="markDirty")

		RoleRuleTable(@dirty='toggleDirty')
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

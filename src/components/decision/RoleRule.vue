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
</script>

<template lang="pug">
q-page(padding)
	.container
		.text-h6 {{ roleLabel }}
</template>

<style scoped lang="scss">
.container {
	max-width: 1200px;
	margin: 0 auto;
}
</style>

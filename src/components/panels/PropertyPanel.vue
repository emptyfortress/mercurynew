<script setup lang="ts">
import { computed } from 'vue'
import { useControl } from '@/stores/controls'
import FormProps from '@/components/panels/FormProps.vue'
import ControlProps from '@/components/panels/ControlProps.vue'

const control = useControl()
const modelValue = defineModel()

const activeComponent = computed(() => {
	return control.selectedControl ? ControlProps : FormProps
})
</script>

<template lang="pug">
.property(v-if='modelValue'
	v-motion
	:initial='{ opacity: 0 }'
	:enter='{ opacity: 1 }'
	:delay='600'
	)

	ControlProps(v-if='control.selectedControl'
		v-motion
		:initial='{ opacity: 0, y: 20 }'
		:enter='{ opacity: 1, y: 0 }'
		)
	FormProps(v-else
		v-motion
		:initial='{ opacity: 0, y: 20 }'
		:enter='{ opacity: 1, y: 0 }'
		)
</template>

<style scoped lang="scss">
.property {
	padding: 1rem;
}
</style>

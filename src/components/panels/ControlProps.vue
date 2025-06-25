<script setup lang="ts">
import { useControl } from '@/stores/controls'
import StringProp from '@/components/panels/StringProp.vue'
import TextProp from '@/components/panels/TextProp.vue'
import DateProp from '@/components/panels/DateProp.vue'
import ManProp from '@/components/panels/ManProp.vue'

const control = useControl()
</script>

<template lang="pug">
div
	StringProp()
	// TextProp(v-if='control.selectedControl?.type == 1')
	// DateProp(v-if='control.selectedControl?.type == 2')
	// ManProp(v-if='control.selectedControl?.type == 5')
</template>

<style scoped lang="scss">
.prop {
	margin: 1rem;
	font-size: 0.8rem;
}
</style>

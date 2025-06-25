<script setup lang="ts">
import { useControl } from '@/stores/controls'
import StringProp from '@/components/panels/StringProp.vue'
import TextProp from '@/components/panels/TextProp.vue'
import DateProp from '@/components/panels/DateProp.vue'
import ManProp from '@/components/panels/ManProp.vue'
import { Kind } from '@/types/enum'

const control = useControl()
</script>

<template lang="pug">
div
	StringProp(v-if='control.selectedControl?.type == Kind.String')
	TextProp(v-if='control.selectedControl?.type == Kind.Text')
	DateProp(v-if='control.selectedControl?.type == Kind.Date')
	ManProp(v-if='control.selectedControl?.type == Kind.Man')
</template>

<style scoped lang="scss">
.prop {
	margin: 1rem;
	font-size: 0.8rem;
}
</style>

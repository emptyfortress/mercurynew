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
	StringProp(v-if='control.selectedControl?.type == 0'
		v-motion
		:initial='{ opacity: 0, y: 20 }'
		:enter='{ opacity: 1, y: 0 }'
		)
	TextProp(v-if='control.selectedControl?.type == 1'
		v-motion
		:initial='{ opacity: 0, y: 20 }'
		:enter='{ opacity: 1, y: 0 }'
		)
	DateProp(v-if='control.selectedControl?.type == 2'
		v-motion
		:initial='{ opacity: 0, y: 20 }'
		:enter='{ opacity: 1, y: 0 }'
		)
	ManProp(v-if='control.selectedControl?.type == 5'
		v-motion
		:initial='{ opacity: 0, y: 20 }'
		:enter='{ opacity: 1, y: 0 }'
		)
</template>

<style scoped lang="scss">
.prop {
	margin: 1rem;
}
</style>

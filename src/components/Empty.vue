<script setup lang="ts">
import { computed } from 'vue'
import IconFaceMask from '@/components/icons/IconFaceMask.vue'

const props = defineProps({
	mode: {
		type: String,
		default: ''
	}
})

const txt = computed(() => {
	if (props.mode == "role") return 'Роли'
	if (props.mode == "form") return 'Формы'
	if (props.mode == "list") return 'Списки'
	if (props.mode == "app") return 'Приложения'
	else return ''
})
</script>

<template lang="pug">
.empt
	IconFaceMask.big
	div {{ txt }} не настроены.
</template>

<style scoped lang="scss">
.empt {
	border-radius: .5rem;
	text-align: center;
	margin: 0.5rem;
	padding: 1rem;
	color: $secondary;
	background: #ffffff44;
	line-height: 100%;
}

.big {
	font-size: 3rem;
	color: $secondary;
}
</style>

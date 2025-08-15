<script setup lang="ts">
import { useRouter } from 'vue-router'
import VersionList1 from '@/components/VersionList1.vue'

const props = defineProps<{
	item: App
}>()

const router = useRouter()
</script>

<template lang="pug">
q-page(padding)
	.cont()
		.hd Проверка и публикация
		br
		VersionList1


</template>

<style scoped lang="scss">
.cont {
	max-width: 1200px;
	margin: 0 auto;
}

.hd {
	font-size: 1.3rem;
}

.bt {
	padding: 0.5rem;
	border-radius: var(--rad);
	text-align: center;
	display: inline-flex;
	justify-content: center;
	align-items: center;
	color: $primary;
	cursor: pointer;
	margin-left: auto;

	&:hover {
		background: $primary;
		color: white;
	}
}

.ic {
	font-size: 1.5rem;
}
</style>

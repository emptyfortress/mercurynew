<script setup lang="ts">
import IconWizard from '@/components/icons/IconWizard.vue'
import AssistentInside from '@/components/AssistentInside.vue'
import { useRouter } from 'vue-router'
import { useTitle } from '@vueuse/core'
import { useStorage } from '@vueuse/core'

const app = useStorage('app', localStorage)
const title = useTitle('Мастер настройки')

const router = useRouter()

const navigate = () => {
	router.push('ai')
}
</script>

<template lang="pug">
q-page(padding)
	.cont()
		.row.justify-between.items-center
			.hd Первичные настройки
			.bt(@click='navigate')
				IconWizard.ic
				span ИИ-ассистент

		AssistentInside

</template>

<style scoped lang="scss">
.cont {
	max-width: 1000px;
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

<script setup lang="ts">
import IconFlag from '@/components/icons/IconFlag.vue'
import IconEntrance from '@/components/icons/IconEntrance.vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const navigate = (() => {
	router.push('try1')
})
</script>

<template lang="pug">
q-page(padding)
	.cont
		h2 Try

		.myrow
			.bt(@click.stop='navigate')
				div
					IconFlag.ic
					div Создать первичные настройки
			.bt(@click.stop='navigate')
				div
					IconEntrance.ic
					div Перейти к приложению
</template>

<style scoped lang="scss">
.cont {
	width: 1000px;
	margin: 0 auto;
}

.myrow {
	display: flex;
	justify-content: center;
	align-items: center;
	gap: .5rem;
	margin-top: 2rem;
}

.bt {
	width: 200px;
	height: 120px;
	padding: 1rem;
	border: 1px solid $secondary;
	border-radius: var(--rad);
	text-align: center;
	display: flex;
	justify-content: center;
	align-items: start;
	color: $secondary;
	font-weight: 600;
	cursor: pointer;

	&:hover {
		background: $secondary;
		color: white;
	}
}

.ic {
	font-size: 2rem;
}
</style>

<script setup lang="ts">
import { computed } from 'vue'
import { useStorage } from '@vueuse/core'
import { useRoute } from 'vue-router'
import { date } from 'quasar'
import { useChangesStore } from '@/stores/changes'
import { storeToRefs } from 'pinia'

const route = useRoute()
const app = useStorage('app', localStorage)

const changesStore = useChangesStore()
const { hasChanges } = storeToRefs(changesStore)

const footerState = computed(() => {
	return route.meta.footer ? true : false
	// return route.meta.footer
})
</script>

<template lang="pug">
q-footer.footer(v-if='footerState')
	.cent(data-tour='footer-main')
		div Версия: -- название версии --
		div Автор: -- автор --
		div Создано: -- дата --

	.cent(data-tour='footer-save')
		div
			q-icon.q-mr-sm(name="mdi-circle-slice-8" color="positive")
			span Все изменения сохранены

</template>

<style scoped lang="scss">
.footer {
	background: hsl(202 33% 92% / 1);
	box-shadow: 0 -1px 4px rgba($color: #000000, $alpha: 0.15);
	color: #444;
	padding: 3px 2rem;
	display: flex;
	justify-content: space-between;
	.cent {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 3rem;
		font-size: 0.8rem;
	}
}
</style>

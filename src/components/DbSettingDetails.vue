<script setup lang="ts">
import { ref, computed } from 'vue'
import { useApps } from '@/stores/apps'

const props = defineProps<{ id: string; type: string }>()

const myapps = useApps()

const current = computed(() => {
	return myapps.db.find((el) => el.id == props.id)
})
const check = ref(false)
</script>

<template lang="pug">
div
	h6
		q-icon(name="mdi-database-outline")
		|&nbsp;{{ current?.label || 'fuck'}}
	br
	q-checkbox(v-model="check" label="Разрешенa публикация поверх существующих версий. Старые данные уничтожаются.")

</template>

<style scoped lang="scss">
h6 .q-icon {
	margin-top: -3px;
	margin-right: 0.5rem;
	font-size: 1.8rem;
}
</style>

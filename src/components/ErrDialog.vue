<script setup lang="ts">
import Mapping from '@/components/Mapping.vue'
import { useApps } from '@/stores/apps'
import { useRouter } from 'vue-router'

const router = useRouter()
const myapps = useApps()

const props = defineProps({
	bd: {
		type: String,
		required: true,
		default: '',
	},
	row: {
		type: Object,
	},
})

const modelValue = defineModel<boolean>()

const close = () => {
	modelValue.value = false
}

const goto = () => {
	if (props.row) {
		let tmp = myapps.pathForEvent(props.row.app)
		if (tmp) {
			router.push(tmp)
			close()
		}
	}
}
const reject = () => {
	console.log('reject')
}
</script>

<template lang="pug">
q-dialog(v-model="modelValue")
	q-card(style="min-width: 680px;")
		q-btn.close(round color="negative" icon="mdi-close" v-close-popup)
		q-card-section
			.text-h6 Ошибка при публикации

		.q-mx-md
			div Публикация не удалась. В процессе возникла ошибка.
			.q-mt-md Stacktrace:
			code.code Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nisi unde qui ducimus odit quisquam? Aliquid rem harum libero ut. Sint enim harum voluptas! Et officiis nobis beatae officia numquam sunt?

		q-card-actions.q-mx-sm.q-mt-xl(align="right")
			q-btn(flat color="primary" label="Открыть версию" @click="goto")
			q-space
			q-btn(flat color="primary" label="Закрыть" @click="close")
			q-btn(unelevated color="primary" label="Отклонить публикацию" @click='reject')
</template>

<style scoped lang="scss">
.q-chip--selected {
	background: $primary;
	color: white;
}

:deep(.q-chip__icon) {
	color: white;
}
.code {
	display: block;
	width: 100%;
	padding: 0.5rem;
	background: #efefef;
	border: 1px solid #ccc;
}
</style>

<script setup lang="ts">
import { computed } from 'vue'
import { date } from 'quasar'

const props = defineProps({
	row: {
		type: Object,
		required: true,
	},
	dbName: {
		type: String,
		required: true,
		validator: (value: string) => ['DV-Main', 'DV-Prod'].includes(value),
	},
})

const emit = defineEmits(['prepublish', 'errPub'])

const isLoading = computed(() => {
	return props.dbName === 'DV-Main' ? props.row.loadingMain : props.row.loadingProd
})

const publicationDate = computed(() => {
	return props.dbName === 'DV-Main' ? props.row.dvmain : props.row.dvprod
})

const dat = (val: number) => {
	return date.formatDate(val, 'DD.MM.YY HH:mm')
}

const onPrepublish = () => {
	emit('prepublish', props.row, props.dbName)
}

const onErrPub = () => {
	emit('errPub', props.row)
}
</script>

<template lang="pug">
q-td.text-center
	// Publish button
	q-btn(v-if='publicationDate === undefined' :loading="isLoading" flat color="primary" icon='mdi-cloud-upload' label="Опубликовать" @click="onPrepublish" size='sm')
		template(v-slot:loading)
			q-spinner-gears(class="on-left" size='24px')
			span Публикация...

	// Error state (only for DV-Main as per original template)
	.red(v-if='publicationDate === 0 && dbName === "DV-Main"' @click='onErrPub')
		q-icon(name="mdi-close-octagon" color="negative" size='20px')
		|&nbsp;&nbsp;19.08.25 16:12

	// Success state
	div(v-if='publicationDate > 0')
		q-icon(name="mdi-check-bold" color="positive" size='20px')
		.link {{ dat(publicationDate) }}
</template>

<style scoped lang="scss">
.red {
	color: $negative;
	cursor: pointer;
}
.link {
	color: $primary;
	text-decoration: underline;
	margin-left: 0.5rem;
	display: inline;
	cursor: pointer;
}
</style>

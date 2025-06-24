<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useApps } from '@/stores/apps'
import { useRouter, useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import ConfirmDialog from '@/components/ConfirmDialog.vue'

const myapps = useApps()
const router = useRouter()
const route = useRoute()

const props = defineProps<{
	item: App
}>()

const emit = defineEmits(['close', 'remove', 'duplicate'])

const group = computed(() => {
	return route.fullPath.toString().split('/')[1] == 'folder' ? true : false
})

const navigate = () => {
	const path = route.fullPath.toString()
	myapps.setGroupPath(group.value ? path : '')
	myapps.setPath(group.value ? '' : path)
	router.push('/assistent')
	myapps.setCurrentApp(props.item)
}

const navigate1 = () => {
	const path = route.fullPath.toString()
	myapps.setCurrentApp(props.item)
	myapps.setGroupPath(group.value ? path : '')
	myapps.setPath(group.value ? '' : path)
	router.push('/process')
}

const version = ref(false)
// const toggleVersion = () => {
// 	version.value = !version.value
// }

const move = { x: 20, opacity: 0 }
const non = { x: 0, opacity: 1 }

const initial = ref(non)

onMounted(() => (initial.value = move))

const remove = (item: App) => {
	emit('remove', item)
}

const duble = (item: App) => {
	emit('duplicate', item)
}

const $q = useQuasar()
// const uploaded = ref(false)
const loading = ref(false)

const toggleUpload = (item: App) => {
	loading.value = true
	setTimeout(() => {
		loading.value = false
		item.published = !item.published
		if (item.published) {
			$q.notify({
				icon: 'mdi-check-bold',
				color: 'positive',
				message: 'Приложение опубликовано!',
				position: 'top',
			})
		} else {
			$q.notify({
				icon: 'mdi-check-bold',
				color: 'orange',
				message: 'Публикация отозвана!',
				position: 'top',
			})
		}
	}, 2000)
}

const mode = ref('version')
const dialog = ref(false)
const handleRemove = () => {
	if (props.item.published) {
		mode.value = 'version'
		dialog.value = true
	}
}
const handlePub = () => {
	mode.value = 'publ'
	dialog.value = true
}
</script>

<template lang="pug">
.fill
	div(
		v-if='!version',
		v-motion
		:initial="initial"
		:enter='{ x: 0, opacity: 1 }'
		:delay='400'
	)
		.descr(@click.stop)
			span {{ props.item.descr }}
			q-popup-edit(v-model="props.item.descr" auto-save v-slot="scope")
				q-input(v-model="scope.value" dense autofocus @keyup.enter="scope.set")


		.mygrid
			label Автор:
			.val {{ props.item.author }}
			label Создано:
			.val {{ props.item.created }}

			label Опубликовано:
			.val(v-if='item.published') {{ props.item.created }}
			.val(v-else) --''--
			.to.star(v-if='item.published' @click.stop) DV-test
			div(v-else)
			q-btn.ddis(color="primary" outline icon="mdi-cloud-upload-outline" label="Опубликовать" @click.stop="handlePub" size='md') 

			label Изменено:
			.val {{ props.item.modify }}

			div(v-if='props.item.id !== "1"')
				|Орлов П.С.
			div(v-else style='font-weight: bold;')
				|Роза Львовна

		.myrow
			q-btn(outline color="primary" label='Мастер' icon='mdi-magic-staff' @click.stop="" ) 
			q-btn(unelevated color="primary" icon='mdi-pencil-outline' label='Редактировать' @click.stop="navigate1" ) 
			q-btn(outline color="primary" icon='mdi-delete-empty-outline' label='Удалить приложение' @click.stop='handleRemove') 
				q-menu(v-if='!item.published' anchor="bottom middle" self="top middle")
					q-item(clickable @click.stop='remove(props.item)').pink
						q-item-section.text-center Да, удалить!
			
	ConfirmDialog(v-model="dialog" :mode='mode')
</template>

<style scoped lang="scss">
.fill {
	font-size: 0.8rem;
}

.descr {
	color: $primary;

	span {
		border-bottom: 1px dotted $primary;
		cursor: pointer;
	}
}

.mygrid {
	margin-top: 2rem;
	display: grid;
	grid-template-columns: auto auto auto 1fr;
	justify-items: start;
	align-items: center;
	column-gap: 2rem;
	// row-gap: 0.5rem;
	label {
		grid-column: 1/2;
	}
	.val {
		grid-column: 2/3;
	}
	.to {
		color: $primary;
		text-decoration: underline;
	}
	.star {
		position: relative;
	}
	.star::after {
		content: '*';
		font-size: 1.1rem;
		position: absolute;
		top: -9px;
		right: -9px;
	}
}

.myrow {
	display: grid;
	grid-template-columns: repeat(3, auto);
	// justify-content: center;
	gap: 0.5rem;
	margin-top: 2rem;
	// background: #ccc;
}

.bt {
	padding: 0.5rem;
	border: 1px solid var(--selection);
	border-radius: 0.25rem;
	background: hsl(241 94% 97% / 1);
	text-align: center;
	display: flex;
	justify-content: center;
	align-items: center;
	color: $primary;
	font-weight: 600;
	cursor: pointer;
	&:hover {
		background: var(--selection);
		border: 1px solid $primary;
	}
}

.ic {
	font-size: 1.5rem;
	margin-right: 0.5rem;
}
.caution {
	margin-top: 2rem;
	color: $negative;
	text-align: center;
	border: 1px solid $negative;
	padding: 0.5rem;
	display: grid;
	grid-template-columns: 1fr auto;
	// justify-items: start;
	// align-items: stretch;
	column-gap: 1rem;
}
</style>

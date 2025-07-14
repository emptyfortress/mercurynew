<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useApps } from '@/stores/apps'
import { useRouter, useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import VersionTable from '@/components/VersionTable.vue'

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
const toggleVersion = () => {
	version.value = !version.value
}

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

const publish = (ver: number) => {
	setTimeout(() => {
		props.item.published = ver
		if (ver == 2) {
			$q.notify({
				icon: 'mdi-check-bold',
				color: 'positive',
				message: 'Приложение опубликовано!',
				position: 'top',
			})
		}
		if (ver == 1) {
			$q.notify({
				icon: 'mdi-check-bold',
				color: 'positive',
				message: 'Приложение передано на публикацию!',
				position: 'top',
			})
		}
	}, 3000)
}

const mode = ref('version')
const dialog = ref(false)

// const handleRemove = () => {
// 	if (props.item.published) {
// 		mode.value = 'version'
// 		dialog.value = true
// 	}
// }

const handlePub = () => {
	mode.value = 'publ'
	dialog.value = true
}

const handleEditors = () => {
	mode.value = 'editors'
	dialog.value = true
}
</script>

<template lang="pug">
.fill
	.descr(@click.stop)
		span {{ props.item.descr }}
		q-popup-edit(v-model="props.item.descr" auto-save v-slot="scope")
			q-input(v-model="scope.value" dense autofocus @keyup.enter="scope.set")

	div(
		v-if='!version',
		v-motion
		:initial="initial"
		:enter='{ x: 0, opacity: 1 }'
		:delay='400'
	)

		.newgrid
			.mygrid
				label.link(@click.stop='toggleVersion') Версия:
				.text-bold Базовая
				label Статус:
				.text-bold
					span(v-if='props.item.published == 1') Ожидает&nbsp;публикации
					span(v-if='props.item.published == 0') Черновик
					span(v-if='props.item.published == 2') Опубликовано
				q-btn.create(flat color="secondary" icon='mdi-plus-circle-outline' label="Создать версию" @click="" size='sm')

			.mygrid
				label Автор:
				.val {{ props.item.author }}
				label Создано:
				.val {{ props.item.created }}

				// label Редакторы:
				// .val
				// 	div Лебедев С.С., Соловьева И.К., Воробьев С.П.
				// 	.link(@click.stop='handleEditors') + 3
				// 	q-btn(flat round dense color="primary" icon="mdi-plus-circle-outline" size='sm' @click.stop='handleEditors') 

				label Изменено:
				.val
					div {{ props.item.modify }}
					div(v-if='props.item.id !== "1"')
						|Орлов П.С.
					div(v-else style='font-weight: bold;')
						|Роза Львовна

		.myrow
			q-btn(outline color="primary" label='Мастер' icon='mdi-magic-staff' @click.stop="navigate" ) 
			q-btn(unelevated color="primary" icon='mdi-pencil-outline' label='Редактировать' @click.stop="navigate1" ) 

			q-btn(color="primary" outline icon="mdi-cloud-upload-outline" label="Опубликовать" @click.stop="handlePub" size='md') 

			q-btn(flat round dense icon="mdi-dots-horizontal" color="primary" @click.stop='') 
				q-menu(anchor="bottom middle" self="top middle")
					q-item(clickable @click.stop='duble(props.item)' v-close-popup)
						q-item-section(side)
							q-icon(name="mdi-plus-box-multiple-outline")
						q-item-section Дублировать приложение

					q-item(clickable @click.stop='remove(props.item)' v-close-popup)
						q-item-section(side)
							q-icon(name="mdi-delete-outline")
						q-item-section Удалить приложение

		.publ
			label Опубликовано:
			.row.align-center
				.val(v-if='item.published') {{ props.item.created }}
				.val(v-else) --''--
			.to.star(v-if='item.published' @click.stop) Проверить на DV-test

	.q-mt-md(
		v-else
		v-motion
		:initial="initial"
		:enter='{ x: 0, opacity: 1 }'
		:delay='400'
	) Тут живут драконы (версии)
		// VersionTable
			
	ConfirmDialog(v-model="dialog" :mode='mode' @publish='publish')
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
.link {
	color: $primary;
	text-decoration: underline;
}

.newgrid {
	margin-top: 1rem;
	display: flex;
	// justify-content: space-between;
	align-items: start;
	gap: 3rem;
}

.create {
	grid-column: 1/-1;
}
.mygrid {
	display: grid;
	grid-template-columns: auto 1fr;
	justify-items: start;
	align-items: center;
	column-gap: 0.5rem;
	label {
		grid-column: 1/2;
	}
	.val {
		grid-column: 2/3;
		display: flex;
		align-items: center;
		gap: 1rem;
	}
}
.to {
	color: $primary;
	font-size: 0.9rem;
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

.myrow {
	display: grid;
	grid-template-columns: auto auto auto 36px;
	// justify-content: center;
	gap: 0.5rem;
	margin-top: 1rem;
}

.publ {
	// display: grid;
	// grid-template-columns: auto auto 1fr;
	margin-top: 1rem;
	display: flex;
	justify-items: start;
	align-items: center;
	column-gap: 2rem;
}
</style>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useApps } from '@/stores/apps'
import { useRouter, useRoute } from 'vue-router'
import { useQuasar, date } from 'quasar'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import VersionList from '@/components/VersionList.vue'
import { useVersion } from '@/stores/version'

const myapps = useApps()
const router = useRouter()
const route = useRoute()

const props = defineProps<{
	item: App
}>()

const emit = defineEmits(['close', 'remove', 'duplicate'])

const myver = useVersion()

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
	if (myver.curVersion.published > 0) {
		mode.value = 'edit'
		dialog.value = true
	} else {
		const path = route.fullPath.toString()
		myapps.setCurrentApp(props.item)
		myapps.setGroupPath(group.value ? path : '')
		myapps.setPath(group.value ? '' : path)
		router.push('/process')
		myapps.curVersion(props.item).modified = date.formatDate(Date.now(), 'DD.MM.YY HH:mm')
	}
}

const openUrl = () => {
	mode.value = 'check'
	dialog.value = true
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
	myapps.curVersion(props.item).published = ver
	// myver.curVersion.published = ver

	setTimeout(() => {
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

const letcheck = computed(() => {
	return myapps.curVersion(props.item).tested == undefined ? false : true
})

const check = () => {
	timeStamp.value = Date.now()
	myapps.curVersion(props.item).tested = formattedString.value
	letcheck.value = true
}

const mode = ref('version')
const dialog = ref(false)

const handlePub = () => {
	mode.value = 'publ'
	dialog.value = true
}

const tab = ref('setup')

const timeStamp = ref(Date.now())

const formattedString = computed(() => {
	return date.formatDate(timeStamp.value, 'DD.MM.YY HH:mm')
})
</script>

<template lang="pug">
.fill
	.descr(@click.stop)
		span {{ props.item.descr }}
		q-popup-edit(v-model="props.item.descr" auto-save v-slot="scope")
			q-input(v-model="scope.value" dense autofocus @keyup.enter="scope.set")

	.mygrid.q-mt-sm
		label Автор приложения:
		.val {{ props.item.author}}
		label Создано:
		.val {{ props.item.created}}

	q-tabs.q-mt-md(v-model="tab" align="left" dense active-color='primary')
		q-tab(name='setup' label='Настройка' @click.stop)
		q-tab(name='publ' label='Публикация' @click.stop)
		q-tab(name='vers' label='Версии' @click.stop)

	q-tab-panels(v-model="tab" animated)
		q-tab-panel(name='setup')
			.newgrid

				.mygrid
					label Версия:
					.text-bold {{ myapps.curVersion(props.item).label }}
					label Статус:
					.text-bold
						span(v-if='myapps.curVersion(props.item).published == 1') Ожидает&nbsp;публикации
						span(v-if='myapps.curVersion(props.item).published == 0') Черновик
						span(v-if='myapps.curVersion(props.item).published == 2') Опубликовано

				.mygrid
					label Версию создал:
					.val {{ myapps.curVersion(props.item).author }}

					label Изменено:
					.val
						div {{ myapps.curVersion(props.item).modified }}
						template(v-if='myapps.curVersion(props.item).modified !== "--"')
							div(v-if='props.item.id !== "1"')
								|Орлов П.С.
							div(v-else style='font-weight: bold;')
								|Роза Львовна


			.myrow
				q-btn(outline color="primary" label='Мастер' icon='mdi-magic-staff' @click="navigate" ) 
				q-btn(unelevated color="primary" icon='mdi-pencil-outline' label='Редактировать' @click="navigate1" ) 
				q-btn(unelevated color="primary" icon='mdi-eye-check-outline' label='Проверить' @click="openUrl" ) 

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

			.q-mt-md(v-if='letcheck')
				.check
					div Последняя&nbsp;проверка:
					div {{myapps.curVersion(props.item).label}}&nbsp;--&nbsp;{{myapps.curVersion(props.item).tested}}
					.link DV-test

		q-tab-panel(name='publ')
			.newgrid

				.mygrid
					label Версия:
					.text-bold {{ myapps.curVersion(props.item).label }}
					label Статус:
					.text-bold
						span(v-if='myapps.curVersion(props.item).published == 1') Ожидает&nbsp;публикации
						span(v-if='myapps.curVersion(props.item).published == 0') Черновик
						span(v-if='myapps.curVersion(props.item).published == 2') Опубликовано

				.mygrid
					label Версию создал:
					.val {{ myapps.curVersion(props.item).author }}

					label Изменено:
					.val
						div {{ myapps.curVersion(props.item).modified }}
						template(v-if='myapps.curVersion(props.item).modified !== "--"')
							div(v-if='props.item.id !== "1"')
								|Орлов П.С.
							div(v-else style='font-weight: bold;')
								|Роза Львовна



			.full
				q-btn(color="primary" unelevated :disable="myapps.curVersion(props.item).published > 0" icon="mdi-cloud-upload-outline" label="Опубликовать" @click.stop="handlePub" size='md') 

			.check(v-if='myapps.curVersion(props.item).published == 2')
					div Последняя&nbsp;публикация:
					div {{myapps.curVersion(props.item).label}} -- {{formattedString}}
					.link DV-prod

		q-tab-panel(name='vers')
			VersionList(:versions="props.item.versions")

			
	ConfirmDialog(v-model="dialog" :mode='mode' @publish='publish' @check='check')
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
	cursor: pointer;
}

.newgrid {
	display: flex;
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
.full {
	width: 100%;
	text-align: center;
	margin-top: 1rem;
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

.myrow1 {
	margin-top: 1rem;
}
.myrow {
	display: grid;
	grid-template-columns: auto auto auto 36px;
	// justify-content: center;
	gap: 0.5rem;
	margin-top: 2rem;
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
.check {
	margin-top: 2rem;
	display: flex;
	gap: 1rem;
}
</style>

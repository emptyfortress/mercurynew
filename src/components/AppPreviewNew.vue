<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useApps } from '@/stores/apps'
import { useRouter, useRoute } from 'vue-router'
import { useQuasar, date } from 'quasar'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import AddDialog from '@/components/AddDialog.vue'
import VersionList0 from '@/components/VersionList0.vue'
import { useVersion } from '@/stores/version'
// import SvgSpinnersBarsRotateFade from '@/components/icons/SvgSpinnersBarsRotateFade.vue'
import MappingDialog from '@/components/MappingDialog.vue'

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

const navigate1 = async () => {
	if (myver.curVersion.published > 0) {
		mode.value = 'edit'
		dialog.value = true
	} else {
		const path = route.fullPath.toString()
		await router.push('/process')
		myapps.setCurrentApp(props.item)
		myapps.currentApp!.master = false
		myapps.setGroupPath(group.value ? path : '')
		myapps.setPath(group.value ? '' : path)
		myapps.curVersion(props.item).modified = Date.now()
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

const dialog2 = ref(false)

const prepublish = (ver: number) => {
	if (ver == 1) {
		myapps.curVersion(props.item).published = ver
		myapps.curVersion(props.item).pubDate = Date.now()
		props.item.published = ver
		props.item.publishDate = Date.now()

		props.item.master = false
		setTimeout(() => {
			$q.notify({
				icon: 'mdi-check-bold',
				color: 'positive',
				message: 'Приложение передано на публикацию!',
				position: 'top',
			})
		}, 3000)
	}
	if (ver == 2) {
		dialog2.value = true
	}
}

const publish = () => {
	precheck1.value = true
	myapps.curVersion(props.item).published = 2
	myapps.curVersion(props.item).pubDate = Date.now()
	props.item.published = 2
	props.item.publishDate = Date.now()

	props.item.master = false

	setTimeout(() => {
		$q.notify({
			icon: 'mdi-check-bold',
			color: 'positive',
			message: 'Приложение опубликовано!',
			position: 'top',
		})
		precheck1.value = false
	}, 4000)
}

const letcheck = computed({
	get: () => myapps.curVersion(props.item).tested !== undefined,
	set: (val) => {
		myapps.curVersion(props.item).tested = val ? formattedString.value : undefined
	},
})

const precheck = ref(false)
const precheck1 = ref(false)

const check = () => {
	precheck.value = true
	setTimeout(() => {
		myapps.curVersion(props.item).tested = formattedString.value
		timeStamp.value = Date.now()
		precheck.value = false
		letcheck.value = true
	}, 4000)
	// const routeData = router.resolve({ path: '/test' })
	// window.open(routeData.href, '_blank')
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

const currentVer = ref('')
const dialog1 = ref(false)

const add = () => {
	currentVer.value = myapps.curVersion(props.item).label
	dialog1.value = !dialog1.value
}

const create = (e: any) => {
	myapps.curVersion(props.item).current = false
	myapps.addVersion(props.item.versions, e)
	router.push('/process')
	myapps.curVersion(props.item).modified = Date.now()

	setTimeout(() => {
		$q.notify({
			icon: 'mdi-check-bold',
			color: 'positive',
			message: 'Создана новая версия',
			position: 'top',
		})
	}, 500)
}

const state = computed(() => {
	return myapps.curVersion(props.item).modified == null ? false : true
})

const showDate = (val: number | null) => {
	return val ? date.formatDate(val, 'DD.MM.YY HH:mm') : ''
}

const localPubDate = computed(() => {
	return date.formatDate(myapps.curVersion(props.item).pubDate, 'DD.MM.YY HH:mm')
})
</script>

<template lang="pug">
.fill
	.descr(@click.stop)
		span {{ props.item.descr }}
		q-popup-edit(v-model="props.item.descr" auto-save v-slot="scope")
			q-input(v-model="scope.value" dense autofocus @keyup.enter="scope.set")

	.flex
		.mygrid.q-mt-sm
			label Автор приложения:
			.val {{ props.item.author}}
			label Создано:
			.val {{ showDate(props.item.created)}}
		q-btn.q-mt-sm(v-if='props.item.master' unelevated color="primary" label='Мастер' icon='mdi-magic-staff' @click="navigate" size='sm') 


	br
	VersionList0(:versions="props.item.versions" :item='props.item')

			
	MappingDialog(v-model="dialog2" bd='DV-prod' @publish="publish")
	ConfirmDialog(v-model="dialog" :mode='mode' @publish='prepublish' @check='check')
	AddDialog(v-model="dialog1" mode='version' :current='currentVer' @create="create")
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
.flex {
	display: flex;
	gap: 3rem;
	align-items: center;
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
	// display: grid;
	// grid-template-columns: auto auto auto auto 36px;
	display: flex;
	justify-content: start;
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
	display: flex;
	gap: 1rem;
}
.check1 {
	margin-top: 2rem;
	display: flex;
	gap: 1rem;
	align-items: center;
	.big {
		font-size: 2rem;
		color: $negative;
	}
}
.pub {
	font-weight: 600;
	color: darkred;
}
</style>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useApps } from '@/stores/apps'
import { useRouter, useRoute } from 'vue-router'
import IconFlag from '@/components/icons/IconFlag.vue'
import IconCopy from '@/components/icons/IconCopy.vue'
import IconTrash from '@/components/icons/IconTrash.vue'
import { useQuasar } from 'quasar'

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

// const navToVer = () => {
// 	router.push('/version')
// }

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
				q-input(v-model="scope.value" dense autofocus counter @keyup.enter="scope.set")


		.mygrid
			label Автор:
			.val {{ props.item.author }}
			label Создано:
			.val {{ props.item.created }}
			label Изменено:
			.val {{ props.item.created }}
			label Версия:
			.val(@click.stop='toggleVersion') {{ props.item.version }}

			.allbt
				q-btn(v-if='item.published' flat color="primary" :loading='loading' label="Отменить публикацию" @click.stop="toggleUpload(item)" icon='mdi-upload-off-outline') 
				q-btn(v-else flat color="primary" :loading='loading' label="Опубликовать" @click.stop="toggleUpload(item)" icon='mdi-upload-outline') 


		.myrow(v-if='!item.published')
			.bt(@click.stop='navigate')
				IconFlag.ic
				span Помощник по настройке
			.bt(@click.stop='duble(item)')
				IconCopy.ic
				span Дублировать приложение
			.bt(@click.stop)
				IconTrash.ic
				span Удалить приложение
					q-menu()
						q-item(clickable @click.stop='remove(props.item)').pink
							q-item-section.text-center Да, удалить!

			.to
				q-btn(unelevated color="primary" label="К приложению" @click.stop="navigate1" icon='mdi-pencil-outline') 

		.caution(v-else)
			div Данная версия приложения опубликована в базе данных <strong>DV-PROD</strong>.<br />Вы не можете больше вносить изменения.
			q-btn(unelevated color="secondary" label="Открыть на просмотр" @click.stop="navigate1" size='sm') 

</template>

<style scoped lang="scss">
.fill {
	font-size: 0.8rem;
}
.link {
	color: $primary;
	font-weight: 600;
	border-bottom: 1px dotted $primary;
	cursor: pointer;
}

.publ {
	grid-column: 1/-1;
	font-weight: 600;
	color: darkred;
	cursor: pointer;
	// margin-top: 1rem;
	border-bottom: 1px dotted darkred;
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
	grid-template-columns: auto 1fr 1fr;
	justify-items: start;
	align-items: start;
	column-gap: 2rem;
}
.allbt {
	grid-column: 3/-1;
	grid-row: 1/5;
	// justify-self: end;
	align-self: center;
}

.myrow {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	justify-content: center;
	gap: 0.5rem;
	margin-top: 4rem;
	.to {
		margin-top: 0.5rem;
		grid-column: 1/-1;
		justify-self: center;
	}
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

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useApps } from '@/stores/apps'
import { useRouter, useRoute } from 'vue-router'
import IconFlag from '@/components/icons/IconFlag.vue'
import IconCopy from '@/components/icons/IconCopy.vue'
import IconEntrance from '@/components/icons/IconEntrance.vue'
import IconTrash from '@/components/icons/IconTrash.vue'
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
			.val.link(@click.stop='toggleVersion') {{ props.item.version }}
			template(v-if='props.item.version == "0.0.0"')
				.publ(@click.stop='toggleVersion') Версия не опубликована
			template(v-else)
				label Опубликовано:
				.val.link(@click.stop='toggleVersion') {{ props.item.created }}

		.myrow
			.bt(@click.stop='duble(props.item)')
				IconCopy.ic
				span Дублировать приложение
			.bt(@click.stop)
				IconTrash.ic
				span Удалить приложение
				q-menu(cover anchor="bottom middle")
					q-item(clickable @click.stop='remove(props.item)').pink
						q-item-section.text-center Удалить
			.bt(@click.stop='navigate' v-if='props.item.version == "0.0.0"')
				IconFlag.ic
				span Помощник по настройке
			.bt.to(@click.stop='navigate1')
				IconEntrance.ic
				span К приложению

	div(
		v-else,
		v-motion
		:initial="{ x: 20, opacity: 0 }"
		:enter='{ x: 0, opacity: 1 }'
		:delay='200'
	)
		q-btn(flat icon="mdi-arrow-left-circle-outline" label='Назад' color="primary" @click.stop="toggleVersion") 
		VersionTable

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
	margin-top: 1rem;
	display: grid;
	grid-template-columns: auto 1fr;
	justify-items: start;
	align-items: start;
	column-gap: 2rem;
}

.myrow {
	display: grid;
	grid-template-columns: repeat(2, 210px);
	justify-content: center;
	gap: 0.5rem;
	margin-top: 2rem;
}

.bt {
	padding: 0.5rem;
	border: 1px solid var(--selection);
	border-radius: var(--rad);
	background: hsl(241 94% 97% / 1);
	text-align: center;
	display: flex;
	justify-content: center;
	align-items: center;
	color: $primary;
	font-weight: 600;
	cursor: pointer;
	&.to {
		grid-column: 2/3;
	}

	&:hover {
		background: var(--selection);
		border: 1px solid $primary;
	}
}

.ic {
	font-size: 1.5rem;
	margin-right: 0.5rem;
}
</style>

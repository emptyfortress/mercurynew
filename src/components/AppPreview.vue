<script setup lang="ts">
import { ref, } from 'vue'
import { useApps } from '@/stores/apps'
import { useRouter } from 'vue-router'
import IconFlag from '@/components/icons/IconFlag.vue'
import IconEntrance from '@/components/icons/IconEntrance.vue'
import VersionTable from '@/components/VersionTable.vue'

const myapps = useApps()
const router = useRouter()

const props = defineProps<{
	item: App
}>()

const emit = defineEmits(['close'])

const navigate = () => {
	router.push('/assistent')
	myapps.setCurrentApp(props.item)
}
const navigate1 = () => {
	myapps.setCurrentApp(props.item)
	router.push('/process')
}

const version = ref(false)
const toggleVersion = (() => {
	version.value = !version.value
})

</script>

<template lang="pug">
div(
	v-motion
	:initial="{ x: 20, opacity: 0 }"
	:enter='{ x: 0, opacity: 1 }'
	:delay='200'
	)
	div(v-if='!version'
		v-motion
		:initial="{ x: 20, opacity: 0 }"
		:enter='{ x: 0, opacity: 1 }'
		:delay='200'
		)
		.descr
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
			.val.link(@click='toggleVersion') {{ props.item.version }}
			template(v-if='props.item.version == "0.0.0"')
				.publ(@click='toggleVersion') Версия не опубликована
			template(v-else)
				label Опубликовано:
				.val.link(@click='toggleVersion') {{ props.item.created }}

		.myrow
			.bt(@click.stop='navigate' v-if='props.item.version == "0.0.0"')
				div
					IconFlag.ic
					div Помощник по настройке
			.bt(@click.stop='navigate1')
				div
					IconEntrance.ic
					div Перейти к приложению


	div(v-else
		v-motion
		:initial="{ x: 20, opacity: 0 }"
		:enter='{ x: 0, opacity: 1 }'
		:delay='200'
		)
		q-btn(flat icon="mdi-arrow-left-circle-outline" label='Назад' color="primary" @click="toggleVersion") 
		VersionTable

</template>

<style scoped lang="scss">
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
	// row-gap: .5rem;

}

.myrow {
	// background: red;
	display: flex;
	justify-content: center;
	align-items: center;
	gap: .5rem;
	margin-top: 2rem;
}

.bt {
	// width: 200px;
	// height: 90px;
	padding: 1rem;
	border: 1px solid $secondary;
	border-radius: var(--rad);
	text-align: center;
	display: flex;
	justify-content: center;
	align-items: start;
	color: $secondary;
	font-weight: 600;
	cursor: pointer;

	&:hover {
		background: $secondary;
		color: white;
	}
}

.ic {
	font-size: 2rem;
}

.rectangle {
	width: 100px;
	height: 100px;
	background-color: blue;
	cursor: pointer;
}
</style>

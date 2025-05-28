<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { motion } from 'motion-v'
import IconMenuRole from '@/components/IconMenuRole.vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import RoleRulesDialog from '@/components/RoleRulesDialog.vue'

const expanded = defineModel('expanded')
const tapes = defineModel<any[]>('tapes')
const activeItem = defineModel<string>('activeItem')
const router = useRouter()

const Div = motion.div

const emit = defineEmits(['navigate', 'createGroup', 'duplicate'])

const action = async (item: App) => {
	if (activeItem.value !== '' && activeItem.value == item.id) {
		expanded.value = false
		activeItem.value = ''
	} else {
		expanded.value = true
		activeItem.value = item.id
		emit('navigate', item.id)

		await nextTick()
		ghostItem.value.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
	}
}

const calcClass = (item: any, index: number) => {
	if (expanded.value && activeItem.value == item.id) return 'active'
	return ''
}

const initial = {
	opacity: 0,
	y: -20,
}

const animate = {
	opacity: 1,
	y: 0,
}

const spring = {
	type: 'spring',
	visualDuration: 0.3,
	bounce: 0.25,
}

const $q = useQuasar()

const calcGhost = computed(() => {
	let ind = tapes.value?.findIndex((item) => item.id == activeItem.value)

	if (ind !== -1) {
		return `cl-${ind! + 1}`
	}
	return ''
})

const label = computed(() => {
	let item = tapes.value?.find((el) => el.id == activeItem.value)
	if (item) return item.label
	return ''
})

// const setIcon = (icon: any) => {
// 	let item = tapes.value?.find((el) => el.id == activeItem.value)
// 	if (item) {
// 		item.pic = icon
// 	}
// }

const setIcon = (icon: string) => {
	let item = tapes.value?.find((el) => el.id == activeItem.value)
	if (item) {
		item.avatar = icon // теперь это строка — либо svg-name, либо url
	}
}

function stopClick(item: any, event: MouseEvent) {
	if (item.id === activeItem.value) {
		event.stopPropagation()
	}
}

const ghostItem = ref()

const duble = (e: App) => {
	emit('duplicate', e)
}
// const getImageUrl = (name: string) => new URL(`../assets/img/${name}.svg`, import.meta.url).href

const getImageUrl = (src?: string) => {
	if (!src) return ''
	if (src.includes('/avatar/')) return src
	return new URL(`../assets/img/${src}.svg`, import.meta.url).href
}

const form = ref('Просмотр')
const options = ['Создание', 'Просмотр', 'Редактирование']
const dialog = ref(false)

const toggleDialog = () => {
	dialog.value = !dialog.value
}
const goto = () => {
	router.push('/form')
}

const role = ref()
const setRole = (e: string) => {
	role.value = e
}
</script>

<template lang="pug">
Div.it(v-for="(item, index) in tapes", :key="item.id",
	@click.stop='action(item)',
	:layout-id="item.id"
	:initial="initial"
	:animate="animate"
	:transition="spring"
	:data-group="item.group > 1 ? 'true' : 'false'"
	:class='calcClass(item, index)'
)
	.img(@click='stopClick(item, $event)')
		q-img.av(:src='getImageUrl(item.avatar)')
		IconMenuRole(@select='setIcon' :avatar='item.avatar')

	.ttt()
		.head
			span(@click.stop) {{ item.label }}
				q-popup-edit(v-if='expanded && activeItem == item.id' v-model="item.label" auto-save v-slot="scope")
					q-input(v-model="scope.value" dense autofocus counter @keyup.enter="scope.set")

		.content(v-if='expanded && item.id == activeItem')
			.grid
				label Правила определения роли:
				.val(v-if='role' @click.stop="toggleDialog")
					span {{ role }}
				q-btn(v-else unelevated color="primary" label="Задать" @click.stop="toggleDialog" size='sm') 

			.hr Форма для показа в папках
			.grid(@click.stop)
				label Форма:
				.row.items-center
					q-select(filled dense v-model="form" :options="options" )
						template(v-slot:after)
							q-btn(flat icon="mdi-arrow-right-circle-outline" label='Перейти' color="primary" @click="goto" dense) 
						template(v-slot:after-options)
							q-separator
							q-item
								q-item-section
									q-btn(flat color="primary" label="Создать форму" icon="mdi-plus-circle" @click="dialog = true" size='sm' v-close-popup) 


	RoleRulesDialog(v-model="dialog" v-model:role='item.label' @set='setRole')

.ghostItem(ref='ghostItem'
	v-if='expanded',
	:class='calcGhost'
	@click.stop
)
	div {{ label }}
	
</template>

<style scoped lang="scss">
.parent.end .it.active {
	width: 680px;
	min-height: 380px;
	padding: 0;
	top: 125px;
	display: block;
	.ttt {
		width: 100%;
		height: 100%;
		padding: 1rem;
	}
	.img {
		width: 140px;
		height: 140px;
		position: absolute;
		bottom: 1rem;
		left: 1rem;
	}
}
.av {
	border-radius: 1rem;
}

.img {
	width: 80px;
	height: 80px;
}

.parent.end .it {
	display: flex;
	justify-content: start;
	align-items: center;
	gap: 0.5rem;
	.img {
		position: static;
		width: 48px;
		height: 48px;
	}
}
.ghostItem {
	height: 100%;
	border-radius: 0.5rem;
	border: 1px dashed $secondary;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 0.7rem;
	color: hsl(212 38% 53% / 1);
}
.active .head span {
	color: $primary;
	border-bottom: 1px dotted $primary;
	cursor: pointer;
}

.selected {
	background: var(--selection);
}
.content {
	font-size: 0.8rem;
}
.grid {
	width: 400px;
	margin: 1rem auto 0;
	display: grid;
	grid-template-columns: auto 1fr;
	justify-items: start;
	align-items: center;
	column-gap: 1rem;
	row-gap: 0.5rem;
	justify-content: center;
}
.hr {
	width: 400px;
	margin: 0.5rem auto;
	border-top: 1px solid #dedede;
	text-align: left;
	padding-top: 1rem;
	// grid-column: 1/-1;
}
.val span {
	color: $primary;
	border-bottom: 1px dotted $primary;
}
</style>

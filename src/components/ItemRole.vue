<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { motion } from 'motion-v'
import IconMenuRole from '@/components/IconMenuRole.vue'
// import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import RoleRulesDialog from '@/components/RoleRulesDialog.vue'

const expanded = defineModel('expanded')
const tapes = defineModel<any[]>('tapes')
const activeItem = defineModel<string>('activeItem')
const router = useRouter()
const selectedItem = ref<any>(null)

const Div = motion.div

const emit = defineEmits(['navigate', 'duplicate', 'remove', 'drag', 'undrag'])

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

// const $q = useQuasar()

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

const setIcon = (icon: string) => {
	let item = tapes.value?.find((el) => el.id == activeItem.value)
	if (item) {
		item.avatar = icon
	}
}

function stopClick(item: any, event: MouseEvent) {
	if (item.id === activeItem.value) {
		event.stopPropagation()
	}
}

const ghostItem = ref()

const duble = (e: any) => {
	emit('duplicate', e)
}

const remove = (e: any) => {
	emit('remove', e)
}

const getImageUrl = (name?: string): string => {
	if (!name) return new URL('../assets/img/avatar/avatar12.svg', import.meta.url).href
	return new URL(`../assets/img/avatar/${name}.svg`, import.meta.url).href
}

const form = ref('Просмотр')
const options = ['Создание', 'Просмотр', 'Редактирование']
const dialog = ref(false)

const toggleDialog = (item: any) => {
	selectedItem.value = item
	dialog.value = !dialog.value
}

const goto = () => {
	router.push('/form')
}

const role = ref()

const setRole = (e: string) => {
	role.value = e
}
const ondragStart = (e: any) => {
	emit('drag', e)
}
const ondragEnd = () => {
	emit('undrag')
}
</script>

<template lang="pug">
Div.it(v-for="(item, index) in tapes", :key="item.id",
	@click.stop='action(item)',
	@dragstart='ondragStart(item)'
	@dragend='ondragEnd'
	:layout-id="item.id"
	:initial="initial"
	:animate="animate"
	:transition="spring"
	:data-group="item.group > 1 ? 'true' : 'false'"
	:class='calcClass(item, index)'
)
	.av
		.conteiner(@click='stopClick(item, $event)')
			img(:src='getImageUrl(item.avatar)')
			IconMenuRole(@select='setIcon' :avatar='item.avatar')
			q-icon.pro(v-if='item.active' name="mdi-shuffle-variant" size='12px')
				q-tooltip Используется в процессе

		.head
			span(@click='stopClick(item, $event)') {{ item.label }}
				q-popup-edit(v-if='expanded && activeItem == item.id' v-model="item.label" auto-save v-slot="scope")
					q-input(v-model="scope.value" dense autofocus @keyup.enter="scope.set")

	.content(v-if='expanded && item.id == activeItem')
		.grid
			label Правила определения роли:
			.val(v-if='role' @click.stop="toggleDialog(item)")
				span {{ role }}
			q-btn(v-else unelevated color="primary" label="Задать" @click.stop="toggleDialog(item)" size='sm') 

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

		.bt
			q-btn(flat color="primary" label="Дублировать" @click.stop="duble(item)") 
			q-btn(flat color="primary" label="Удалить" @click.stop) 
				q-menu
					q-list
						q-item(clickable @click.stop="remove(index)").pink
							q-item-section Да, удалить!



.ghostItem(ref='ghostItem'
	v-if='expanded',
	:class='calcGhost'
	@click.stop
)
	div {{ label }}
	
RoleRulesDialog(
	v-if="dialog"
	v-model="dialog"
	:role="selectedItem?.label"
	@set="setRole"
)
</template>

<style scoped lang="scss">
.parent .it {
	text-align: center;
	.av {
		img {
			height: 90px;
			width: 90px;
		}
	}
}
.parent.end .it.active {
	width: 680px;
	min-height: 380px;
	padding: 1rem;
	top: 125px;
	display: block;
	.av {
		display: flex;
		gap: 1rem;
		justify-content: start;
		align-items: center;
		img {
			height: 90px;
			width: 90px;
		}
		.pro {
			right: 0.1rem;
			bottom: 0.8rem;
		}
	}
}

.bt {
	position: absolute;
	bottom: 1rem;
	right: 1rem;
}

.parent.end .it {
	display: flex;
	justify-content: start;
	align-items: center;
	gap: 0.5rem;
	.av {
		display: flex;
		gap: 1rem;
		justify-content: start;
		align-items: center;
		img {
			width: 36px;
			height: 36px;
		}

		.pro {
			right: -5px;
			bottom: 0rem;
		}
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
}
.val span {
	color: $primary;
	border-bottom: 1px dotted $primary;
}
.conteiner {
	position: relative;
	.pro {
		position: absolute;
		right: 1.7rem;
		bottom: 0.8rem;
		background: $primary;
		background: $positive;
		color: white;
		border-radius: 50%;
		padding: 2px;
		border: 1px solid white;
	}
}
</style>

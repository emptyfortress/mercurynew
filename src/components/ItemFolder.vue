<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { motion } from 'motion-v'
// import IconMenuRole from '@/components/IconMenuRole.vue'
// import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
// import RoleRulesDialog from '@/components/RoleRulesDialog.vue'
import MdiFolderSearchOutline from '@/components/icons/MdiFolderSearchOutline.vue'

const expanded = defineModel('expanded')
const tapes = defineModel<any[]>('tapes')
const activeItem = defineModel<string>('activeItem')
const router = useRouter()
const selectedItem = ref<any>(null)

const Div = motion.div

const emit = defineEmits(['navigate', 'duplicate', 'remove', 'drag', 'undrag'])

const action = async (item: App) => {
	expanded.value = true
	activeItem.value = item.id
	item.expand = true
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

const navigate2 = (id: any) => {
	console.log(id)
	router.push(`/request1/${id}`)
}

const ondragStart = (e: any) => {
	emit('drag', e)
}
const ondragEnd = () => {
	emit('undrag')
}
const calcDraggable = (id: string) => {
	return activeItem.value == id ? false : true
}
</script>

<template lang="pug">
Div.it(v-for="(item, index) in tapes", :key="item.id",
	:draggable='calcDraggable(item.id)'
	@click.stop='action(item)',
	@dragstart='ondragStart(item)'
	@dragend='ondragEnd'
	:layout-id="item.id"
	:initial="initial"
	:animate="animate"
	:transition="spring"
	:class='calcClass(item, index)'
)

	MdiFolderSearchOutline.im
	.hg
		span(@click='stopClick(item, $event)') {{ item.label }}
			q-popup-edit(v-if='item.expand' v-model="item.label" auto-save v-slot="scope")
				q-input(v-model="scope.value" dense autofocus @keyup.enter="scope.set")

	.content(v-if='expanded && item.id == activeItem')
		label
			|Описание:
			span.val(@click='stopClick(item, $event)')
				span {{ item.descr }}
					q-popup-edit(v-model="item.descr" auto-save v-slot="scope")
						q-input(v-model="scope.value" dense autofocus @keyup.enter="scope.set")

		br
		br
		.text-center
			.q-gutter-x-sm
				q-btn(flat color="negative" label="Удалить папку" @click.stop) 
					q-menu(v-if='!item.published' anchor="bottom middle" self="top middle")
						q-item(clickable @click.stop='remove(index)').pink
							q-item-section.text-center Да, удалить!
				q-btn(unelevated color="primary" label="Настроить папку" @click.stop='navigate2(item.id)') 
				q-btn(flat color="primary" label="Дублировать" @click.stop='duble(item)') 

.ghostItem(ref='ghostItem'
	v-if='expanded',
	:class='calcGhost'
	@click.stop
)
	div {{ label }}
	
</template>

<style scoped lang="scss">
.parent .it {
	text-align: center;
	.im {
		color: $secondary;
		height: 64px;
		width: 64px;
	}
}
.parent.end .it.active {
	width: 680px;
	min-height: 380px;
	padding: 1rem;
	top: 125px;
	display: block;
	cursor: default;
	.im {
		height: 90px;
		width: 90px;
	}
	.hg {
		color: $primary;
		span {
			border-bottom: 1px dotted $primary;
		}
	}
}

.parent.end .it {
	display: flex;
	justify-content: start;
	align-items: center;
	gap: 0.5rem;
	.im {
		width: 36px;
		height: 36px;
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

.content {
	font-size: 0.9rem;
	text-align: center;
	margin-top: 1rem;
}
.val span {
	color: $primary;
	border-bottom: 1px dotted $primary;
	margin-left: 0.5rem;
}
</style>

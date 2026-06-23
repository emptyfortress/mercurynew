<script setup lang="ts">
import { ref, computed } from 'vue'
import { useSimpleStore } from '@/stores/simpleStore'
import { uid } from 'quasar'
import PreviewItem from '@/components/decision/PreviewItem.vue'

const modelValue = defineModel<boolean>()
const props = defineProps<{
	tree: any[]
}>()

const emit = defineEmits(['close', 'find'])
const store = useSimpleStore()

const getMembers = (members: any): any => {
	let children: any = []
	const flattenMembers = members.map((m: any) => {
		if (m.children && m.children.length) {
			children = [...children, ...m.children]
		}
		return m
	})

	return flattenMembers.concat(children.length ? getMembers(children) : children)
}

const myFlatTree = computed(() => {
	return getMembers(props.tree)
		.filter((el: any) => el.type == 1 || el.type == 0)
		.map((item: any) => {
			return {
				id: uid(),
				parents: item.parents,
				type: item.type,
				typ: item.typ,
				text: item.text,
				text1: item.text1,
				text2: item.text2,
				text3: item.text3,
				inp: item.inp,
				man: item.man,
				date: item.date,
				ruk: item.ruk,
				vis: item.vis,
			}
		})
})

const action = () => {
	emit('close')
	emit('find')
}
const empty = computed(() => {
	return myFlatTree.value.filter((el: any) => el.vis !== false).length == 0
})
const zag = ref(store.currentNode?.data.text)
const descr = ref(store.currentNode?.data.text1)
</script>

<template lang="pug">
q-dialog(v-model="modelValue" persistent)
	q-card(style="width: 700px; max-width: 80vw; cursor: default;")
		q-form
			q-card-section.row.items-center.q-pb-none
				.text-h6 {{ zag }}
					q-popup-edit(v-model="zag" auto-save v-slot="scope")
						q-input(v-model="scope.value" dense autofocus @keyup.enter="scope.set")
				q-space
				q-btn( icon="mdi-close" flat round dense @click="emit('close')")
			q-card-section.bread
				.descr {{ descr }}
					q-popup-edit(v-model="descr" auto-save v-slot="scope")
						q-input(v-model="scope.value" dense autofocus @keyup.enter="scope.set")

			q-card-section.q-pt-none
				.grid
					template(v-for="( item, index ) in myFlatTree" :key="item.id")
						PreviewItem(:item="item" :index="index")

				template(v-if="empty")
					.text-subtitle1
						q-icon.q-mr-md(name="mdi-alert-outline" size="md" color="negative")
						span Поиск не настроен или все условия скрыты.

			q-card-section
				q-card-actions(align="right")
					q-btn(flat color="primary" label="Отмена" @click="emit('close')") 
					q-btn(unelevated color="primary" label="Искать" @click="action") 

</template>

<style scoped lang="scss">
.grid {
	display: grid;
	grid-template-columns: 1fr 1fr 36px;
	justify-items: start;
	align-items: center;
	column-gap: 1rem;
	row-gap: 0.5rem;
}
.descr {
	border-bottom: 1px solid #ccc;
}
</style>

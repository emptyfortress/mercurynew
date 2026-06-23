<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { QTableColumn } from 'quasar'
import { getMembers, filterByArray } from '@/utils/utils'
import { useChips } from '@/stores/chips'
import { uid } from 'quasar'

const props = defineProps<{
	stat: Stat
}>()

const mychips = useChips()
const modelValue = defineModel<boolean>()
const cols: QTableColumn[] = [
	{
		name: 'parents',
		required: true,
		label: 'Карточка',
		align: 'left',
		field: 'parents',
		sortable: true,
	},
	{
		name: 'text',
		required: true,
		label: 'Поле',
		align: 'left',
		field: 'text',
		sortable: true,
	},
]
const selected = ref<NodeData[]>([])
selected.value.push(props.stat.data)

const selectedChips = computed(() => {
	return mychips.chips[0].ticked
		? getMembers(mychips.chips)
				.filter((el) => el.label !== 'Все')
				.filter((el) => el.label !== 'Документ')
				.filter((el) => el.label !== 'Задание')
				.map((item) => ({
					id: item.id,
					label: item.label,
					ticked: false,
				}))
		: getMembers(mychips.chips)
				.filter((el) => el.ticked)
				.filter((el) => el.label !== 'Документ')
				.filter((el) => el.label !== 'Задание')
				.map((item) => ({
					id: item.id,
					label: item.label,
					ticked: false,
				}))
})

const all = ref(true)
const rows = computed(() => {
	let kinded = getMembers(mychips.rows).filter((el: Option) => el.kind == props.stat.data.kind)
	if (all.value) {
		return kinded
	} else {
		let temp = filterByArray(kinded, flatFuck.value)
		return temp
	}
})
const parents = computed(() => {
	let temp = rows.value.reduce((prev: any, curr: any) => {
		return curr.parents && curr.parents.length ? [...prev, ...curr.parents] : prev
	}, [])
	let uniq = [...new Set(temp)]
		.filter(
			(item) =>
				item == 'Входящий' ||
				item == 'Исходящий' ||
				item == 'Договор' ||
				item == 'На ознакомление' ||
				item == 'На исполнение' ||
				item == 'На согласование' ||
				item == 'Цель' ||
				item == 'Командировка'
		)
		.map((el) => ({
			id: uid(),
			label: el,
			ticked: false,
		}))
	return uniq
})
const fuck = ref([...parents.value])

watch(
	() => mychips.rows,
	() => {
		fuck.value = [...parents.value]
	}
)

const flatFuck: any = computed(() => {
	return fuck.value.filter((el) => el.ticked).map((item) => item.label)
})
const select = (_: Event, row: any, index: number) => {
	let sel = selected.value.filter((el: any) => el.id == row.id).length == 0 ? false : true
	if (sel == true) {
		const ind = selected.value.indexOf(row)
		selected.value.splice(ind, 1)
	} else selected.value.push(row)
}
const filter = ref('')
const common = ref(props.stat.data.text)

const pagination = {
	rowsPerPage: 8,
}
const selChip = () => {
	if (fuck.value.filter((el) => el.ticked).length == 0) {
		all.value = true
	} else all.value = false
}
const setAll = () => {
	if (fuck.value.filter((el) => el.ticked).length == 0) {
		all.value = true
	}
	if (all.value) {
		fuck.value.map((el) => (el.ticked = false))
	}
}
const emit = defineEmits(['setname'])
const add = () => {
	emit('setname', common.value)
	modelValue.value = false
}
</script>

<template lang="pug">
q-dialog(v-model="modelValue")
	q-card
		q-card-section.row.items-center.q-pb-none
			.text-h6 Добавить поля
			q-space
			q-input(dense v-model="filter" debounce="300" color="primary" clearable)
				template(v-slot:prepend)
					q-icon(name="mdi-magnify")

		.q-mt-sm.q-mx-md
			q-chip(size="12px" v-model:selected="all" @click="setAll") Все
			q-chip(v-for="chip in fuck" :key="chip.id" v-model:selected="chip.ticked" size="12px" @click="selChip") {{ chip.label }}

		q-card-section
			q-table(flat
				:columns="cols"
				:rows="rows"
				color="primary"
				selection="multiple"
				:filter="filter"
				v-model:selected="selected"
				@rowClick="select"
				:pagination="pagination"
				row-key="id" )

				template(v-slot:header-selection="scope")
					q-checkbox(dense v-model="scope.selected" color="primary" size="sm")

				template(v-slot:body-selection="scope")
					q-checkbox(dense v-model="scope.selected" color="primary" size="sm")
				template(v-slot:body-cell-parents="props")
					q-td(:props="props")
						template(v-for="(par, index) in props.row.parents" :key="par")
							span {{par}}
							span.q-mx-sm(v-if="index + 1 < props.row.parents.length") >

		.info Введите общую метку для выбранных полей, для показа в форме поиска.
		.row.justify-center.items-center.q-gutter-x-md
			label Общая метка:
			q-input.lab(v-model="common" dense filled)
		q-card-section
			q-card-actions(align="right")
				q-btn(flat color="primary" label="Отмена" v-close-popup) 
				q-btn(unelevated color="primary" label="Добавить" @click="add") 

</template>

<style scoped lang="scss">
.q-card {
	min-width: 760px;
	min-height: 90vh;
}
:deep(.q-checkbox) {
	width: 24px;
}
.q-input {
	width: 200px;
}
.bottom {
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.info {
	font-size: 0.9rem;
	margin: 0 2rem;
	margin-bottom: 1rem;
}
.lab {
	width: 320px;
}
.q-chip {
	margin-right: 0;
	&.foo {
		margin-right: 3rem;
	}
}
.disable {
	opacity: 0.4;
}
</style>

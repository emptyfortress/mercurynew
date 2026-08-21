<script setup lang="ts">
import { ref } from 'vue'
import FieldTree2 from '@/components/decision/FieldTree2.vue'
import PhVirtualReality from '@/components/icons/PhVirtualReality.vue'

interface Col {
	id: string
	type: string
	text: string
	kind: null
	newkind: null
	children: any[]
	sort: boolean
	order: string
	hide: boolean
	source?: string
}

const draft = defineModel<Col>('draft')

const sel = (n: string) => {
	if (!!draft.value) {
		draft.value.source = n
	}
}

const html = ref(false)

const removeField = (index: number) => {
	draft.value?.children.splice(index, 1)
}
const showTree = ref(false)
const showSystem = ref(false)

const insert = (node: any) => {
	draft.value?.children.push(node)
}
const list = ref([
	{ id: 1, label: 'Системное поле 1', selected: false },
	{ id: 2, label: 'Системное поле 2', selected: false },
	{ id: 3, label: 'Системное поле 3', selected: false },
	{ id: 4, label: 'Системное поле 4', selected: false },
	{ id: 5, label: 'Системное поле 5', selected: false },
	{ id: 6, label: 'Системное поле 6', selected: false },
	{ id: 7, label: 'Системное поле 7', selected: false },
])

const test = ref([{ id: 0, label: 'Системное поле пример' }])
const removeSysField = (index: number) => {
	test.value?.splice(index, 1)
}
const addSys = (item: any) => {
	item.selected = true
	test.value.push({
		id: Date.now(),
		label: item.label,
	})
}
</script>

<template lang="pug">
label.q-mt-md.q-mb-sm Источник данных:
.grid5(v-if='!!draft')
	.chose(@click="sel('field')" :class="{selected: draft.source == 'field'}")
		q-radio(v-model="draft.source" val="field" label="Поле раздела" dense)
	.chose(@click="sel('system')" :class="{selected: draft.source == 'system'}")
		q-radio(v-model="draft.source" val="system" label="Системное поле" dense)
	.chose(@click="sel('virtual')" :class="{selected: draft.source == 'virtual'}")
		q-radio(v-model="draft.source" val="virtual" label="Виртуальное поле" dense)
	.chose(@click="sel('calc')" :class="{selected: draft.source == 'calc'}")
		q-radio(v-model="draft.source" val="calc" label="Вычисляемое поле" dense)

transition(name="fade" mode="out-in")
	template(v-if='draft')
		q-tab-panels(v-model="draft.source"
			vertical,
			animated,
			transition-prev="jump-up"
			transition-next="jump-up"
		)
			q-tab-panel(name='field')
				.section
					q-icon(name="mdi-form-textbox" color="white")
					span Поле из раздела карточки
				.column.items-start.q-gutter-y-sm
					.mai(v-for="(chip, index) in draft.children" :key="chip.id")
						.txt
							template(v-for="item in chip.parents" :key="item")
								div {{ item }}
								.q-mx-sm >
							div {{ chip.text }}
							q-btn.q-ml-sm(flat round icon="mdi-close" color="blue-grey-5" @click="removeField(index)" size="sm") 

				q-expansion-item(v-model="showTree" label='Добавить поле' switchToggleSide)
					template(v-slot:header)
						.header
							q-btn(flat color="primary" label="Добавить поле") 
					.tree
						FieldTree2(@insertField="insert")

					q-checkbox(v-if='draft.kind == 0 || draft.kind == 1' v-model='html' label='Отображать содержимое колонки как HTML')


			q-tab-panel(name='system')
				.section
					q-icon(name="mdi-tools" color="white")
					span Системное поле
				.column.items-start.q-gutter-y-sm
					.mai(v-for="(chip,index) in test" :key="chip.id")
						.txt
							div {{ chip.label }}
							q-btn.q-ml-sm(flat round icon="mdi-close" color="blue-grey-5" @click="removeSysField(index)" size="sm") 
				q-expansion-item(v-model="showSystem" label='Добавить поле' switchToggleSide)
					template(v-slot:header)
						.header
							q-btn(flat color="primary" label="Добавить поле") 
					q-list(dense)
						q-item(clickable v-for="item in list" :key="item.id" @click="addSys(item)")
							q-item-section(side)
								q-checkbox(v-model='item.selected' dense @click.stop)
							q-item-section
								q-item-label {{ item.label }}

			q-tab-panel(name='virtual')
				.section
					PhVirtualReality.ic
					span Виртуальное поле
			q-tab-panel(name='calc')
				.section
					q-icon(name="mdi-calculator-variant-outline" color="white")
					span  Вычисляемое поле

</template>

<style scoped lang="scss">
.ic {
	font-size: 1.6rem;
}
.tree {
	background: var(--bgLight);
	width: 100%;
	// min-height: 500px;
	padding: 0.5rem;
	border-radius: 0.5rem;
	border: var(--border);
}

:deep(.q-tab-panel) {
	background: transparent;
	padding: 1rem 0;
}
.section {
	background: $secondary;
	color: white;
	font-size: 1.1rem;
	padding-left: 0.5rem;
	margin-bottom: 0.5rem;
	display: flex;
	align-items: center;
	.q-icon {
		font-size: 1.4rem;
	}
	span {
		margin-left: 0.5rem;
	}
}

.chose {
	cursor: pointer;
	border: 1px solid $grey-4;
	padding: 0.5rem;
	border-radius: 0.25rem;
	font-size: 0.8rem;
	line-height: 1.1;
	&:hover {
		border-color: $secondary;
	}
	&.selected {
		background: var(--selection);
		border: 1px solid $primary;
	}
}
.grid5 {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	// justify-items: start;
	// align-items: stretch;
	gap: 0.25rem;
}
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
.mai {
	display: flex;
	justify-content: start;
	align-items: center;
	background: var(--selection);
	padding: 2px 16px;
	padding-right: 2px;
	border-radius: 5rem;
}
.txt {
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	font-size: 0.9rem;
}
:deep(.q-item) {
	width: 100%;
}
:deep(.q-item__section--avatar) {
	padding-right: 0;
	min-width: 0;
}
.header {
	display: flex;
}
</style>

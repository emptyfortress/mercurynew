<script setup lang="ts">
import { ref } from 'vue'
import FieldTree2 from '@/components/decision/FieldTree2.vue'

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
				.section Поле из раздела карточки
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
						FieldTree2

					q-checkbox(v-if='draft.kind == 0 || draft.kind == 1' v-model='html' label='Отображать содержимое колонки как HTML')


			q-tab-panel(name='system')
				.text-h6 Тут настройки системных полей
			q-tab-panel(name='virtual')
				.text-h6 Тут настройки виртуальных полей
			q-tab-panel(name='calc')

</template>

<style scoped lang="scss">
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
	color: $secondary;
	font-size: 1.1rem;
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

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import FieldTree2 from '@/components/decision/FieldTree2.vue'

const visible = defineModel<boolean>('visible')
const partition = defineModel<Par | null>('partition')

const conditionDialog = ref(false)

interface Par {
	id: string
	type: string
	text: string
	kind: null
	newkind: null
	parents?: string[]
	children: Par[]
	childs: []
	hide: boolean
	main: boolean
	psevdo?: string
}
//
// локальный буфер редактирования
const draft = ref<Par>({
	id: 'start',
	type: 'start',
	text: 'start',
	kind: null,
	newkind: null,
	children: [],
	childs: [],
	hide: false,
	main: true,
})
// пересоздаём буфер при каждом открытии/смене колонки
watch(
	() => [visible.value, partition.value] as const,
	([isVisible, par]) => {
		if (isVisible && par) {
			draft.value = { ...par }
		}
	},
	{ immediate: true }
)

const emit = defineEmits(['add'])
const save = () => {
	if (!draft.value || !partition.value) return
	const { children, ...rest } = draft.value
	Object.assign(partition.value, rest) // структурные children не мутируем — этим владеет he-tree
	visible.value = false
	emit('add', children)
}

const isSwitching = ref(false)
let timer: ReturnType<typeof setTimeout> | null = null

watch(partition, (next, prev) => {
	if (!prev || !next) return // не показываем оверлей при открытии/закрытии панели
	isSwitching.value = true
	clearTimeout(timer!)
	timer = setTimeout(() => (isSwitching.value = false), 180)
})

const showTree = ref(false)
const field = ref()

const selectOptions = computed<string[]>(() => {
	if (!draft.value.childs || draft.value.childs.length == 0) return []
	return draft.value.childs.map((child: any) => child.text)
})

const insert = (nodes: Par[]) => {
	if (draft.value) {
		draft.value.children = [...nodes]
	}
}

const clearId = ref<null | string>(null)
const removeField = (index: number, chip: any) => {
	clearId.value = chip.id
	draft.value?.children.splice(index, 1)
}
</script>

<template lang="pug">
q-drawer(v-model='visible' side='right' :width="480" overlay persistent bordered behavior="desktop")
	.panel(v-if="partition")
		transition(name="skeleton-fade")
			.panel-skeleton-overlay(v-if="isSwitching" key="skeleton")

		.zg
			q-btn(flat round icon="mdi-close" color="primary" dense @click="visible = false") 
			div {{ partition.text }}

		q-scroll-area(ref="scrollAreaRef" style="height: 100%")

			.grid2(v-if='draft')
				label Псевдоним:
				q-input(v-model="draft.psevdo" dense outlined)
				label Раздел:
				.txt1
					template(v-for="item in draft.parents" :key="item")
						div {{ item }}
						.q-mx-sm >
					div {{ draft.text }}

			template(v-if="partition.children.length")
				.section
					span Присоединенные разделы

				.column.items-start.q-gutter-y-sm
					.mai(v-for="(chip, index) in partition.children" :key="chip.id")
						.txt
							template(v-for="item in chip.parents" :key="item")
								div {{ item }}
								.q-mx-sm >
							div {{ chip.text }}
							q-btn.q-ml-sm(flat round icon="mdi-close" color="blue-grey-5" @click="removeField(index, chip)" size="sm") 

			q-expansion-item(v-model="showTree" switchToggleSide)
				template(v-slot:header)
					.header
						q-btn(flat color="primary" label="Присоединить раздел") 
				.section
					span Оригинальный раздел
				.grid2
					label Оригинальный раздел:
					q-input(v-model="draft.text" dense outlined)
					label Оригинальное поле:
					q-select(v-model="field" dense optionsDense outlined :options="selectOptions")
				.section
					span Присоединяемый раздел / поле
				.q-mx-md()
					.column.items-start.q-gutter-y-sm
						.mai(v-for="(chip, index) in draft.children" :key="chip.id")
							.txt
								template(v-for="item in chip.parents" :key="item")
									div {{ item }}
									.q-mx-sm >
								div {{ chip.text }}
								q-btn.q-ml-sm(flat round icon="mdi-close" color="blue-grey-5" @click="removeField(index, chip)" size="sm") 
					.tree
						FieldTree2(@update:selected="insert" v-model:clear='clearId')

				.section
					span Условие

				.text-center
					q-btn(outline color="primary" label="Задать условие" size='sm' @click="conditionDialog = true") 
					br
					br
					br

	.actions
		q-btn(flat color="primary" label="Отмена" @click="visible = false") 
		q-btn(unelevated color="primary" label="Применить" @click="save") 

	q-dialog(v-model="conditionDialog" backdrop-filter="blur(4px) saturate(150%)")
		q-card
			q-btn.close(icon="mdi-close" round color="negative" dense v-close-popup)
			q-card-section
				.text-h6 Задать условие

			q-card-section
				div Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum repellendus sit voluptate voluptas eveniet porro. Rerum blanditiis perferendis totam, ea at omnis vel numquam exercitationem aut, natus minima, porro labore.
			q-card-actions(align="right")
				q-btn(flat color="primary" label="Отмена" v-close-popup) 
				q-btn(unelevated color="primary" label="Применить" @click="") 
</template>

<style scoped lang="scss">
.panel-content {
	height: 100%;
}
.panel {
	height: calc(100% - 95px);
}
.tree {
	background: var(--bgLight);
	width: 100%;
	padding: 0.5rem;
	border-radius: 0.5rem;
	border: var(--border);
	margin-bottom: 2rem;
}
.actions {
	display: flex;
	width: 100%;
	justify-content: end;
	position: absolute;
	bottom: 0;
	right: 0;
	padding: 0.5rem 1rem;
	box-shadow: 0 -2px 7px rgba($color: #000000, $alpha: 0.2);
	z-index: 2;
}
.zg {
	padding: 0.25rem 1rem;
	font-size: 0.7rem;
	border-bottom: 1px solid #cfdbec;
	display: flex;
	align-items: center;
	color: $primary;
	gap: 0.25rem;
	.q-btn {
		margin-top: -3px;
	}
}
:deep(.q-drawer__content) {
	position: relative;
}
.panel-skeleton-overlay {
	position: absolute;
	inset: 0;
	background: var(--bgLight);
	z-index: 1;
}
.skeleton-fade-enter-active,
.skeleton-fade-leave-active {
	transition: opacity 0.45s ease;
}
.skeleton-fade-enter-from,
.skeleton-fade-leave-to {
	opacity: 0;
}
.grid2 {
	display: grid;
	grid-template-columns: auto 1fr;
	align-items: center;
	column-gap: 1rem;
	row-gap: 0.5rem;
	margin: 1rem;
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
.mai {
	display: flex;
	justify-content: start;
	align-items: center;
	background: var(--selection);
	padding: 2px 16px;
	padding-right: 2px;
	border-radius: 5rem;
	margin-bottom: 0.5rem;
}
.txt {
	display: flex;
	align-items: center;
	justify-self: start;
	flex-wrap: wrap;
	font-size: 0.9rem;
	background: var(--selection);
	// padding: 0.5rem 1rem;
	border-radius: 2rem;
}
.txt1 {
	display: flex;
	align-items: center;
	justify-self: start;
	flex-wrap: wrap;
	font-size: 0.9rem;
	background: var(--selection);
	padding: 0.5rem 1rem;
	border-radius: 2rem;
}
</style>

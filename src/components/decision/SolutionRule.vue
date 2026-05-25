<script setup lang="ts">
import { ref } from 'vue'
import { useDragAndDrop } from '@formkit/drag-and-drop/vue'
import { animations } from '@formkit/drag-and-drop'

interface Condition {
	id: number
	mode: string
	state: string
	role: string
	device: string
	layout: string
}

interface Props {
	condition: Condition[]
}

const props = defineProps<Props>()

const test = ref(props.condition)

const propertyLabels = {
	mode: 'Режим',
	state: 'Состояние',
	role: 'Роль',
	device: 'Устройство',
	layout: 'Разметка',
}

const config = {
	plugins: [animations()],
	dragPlaceholderClass: 'gh',
	sortable: true,
	dragHandle: '.han',
	draggable: (child: HTMLElement) => {
		return child.classList.contains('cond')
	},
}

const [parent, tapes] = useDragAndDrop(test.value, config)

const conditionKeys = ['mode', 'state', 'role', 'device'] as const
type ConditionKey = (typeof conditionKeys)[number]
const chipColors: Record<ConditionKey, string> = {
	mode: 'blue-2',
	state: 'orange-3',
	role: 'pink-2',
	device: 'cyan-2',
}

const remCondition = (index: number) => {
	tapes.value.splice(index, 1)
}

const valueOptions: Record<ConditionKey, string[]> = {
	mode: ['Любой', 'Создание', 'Редактирование', 'Просмотр'],
	state: ['Любое', 'Активный', 'Завершен', 'Отменен'],
	role: ['Любая', 'Администратор', 'Пользователь', 'Гость'],
	device: ['Любое', 'Десктоп', 'Мобильный', 'Планшет'],
}

const layoutOptions = ['Меню по умолчанию', 'КЭДО меню', 'Меню админа']

const updateValue = (item: Condition, key: ConditionKey, value: string) => {
	item[key] = value
}

const updateLayout = (item: Condition, value: string) => {
	item.layout = value
}

const isDefaultValue = (item: Condition, key: ConditionKey) => {
	return item[key] === valueOptions[key][0]
}
</script>

<template lang="pug">
.q-gutter-sm(ref='parent')
	.cond(v-for="(item, index) in tapes" :key="item.mode")
		.han
		.div {{index + 1}}
		div
			q-chip.mychip(
				v-for="key in conditionKeys"
				:key="key"
				:color="isDefaultValue(item, key) ? 'grey-4' : chipColors[key]"
				:class="{ 'has-border': !isDefaultValue(item, key) }"
				dense
			)
				span.text-caption.text-grey-8 {{ propertyLabels[key] }}:&nbsp;
				span.text-body2 {{ item[key] }}

				q-menu
					q-list(dense)
						q-item(
							v-for="value in valueOptions[key]"
							:key="value"
							clickable
							v-close-popup
							:class="{ selected: item[key] === value }"
							@click="updateValue(item, key, value)"
						)
							q-item-section {{ value }}

		q-icon(name="mdi-arrow-right" color="primary" size="20px")
		div
			q-chip.lastchip(dense color="green-2" v-if='item.layout.length > 0')
				q-icon(name="mdi-circle-medium" color="teal-9" size="sk")
				label.text-teal-9 {{ item.layout }}
				q-menu
					q-list(dense)
						q-item(
							v-for="value in layoutOptions"
							:key="value"
							clickable
							v-close-popup
							:class="{ selected: item.layout === value }"
							@click="updateLayout(item, value)"
						)
							q-item-section {{ value }}
			q-chip(v-else dense) Не задано
				q-menu
					q-list(dense)
						q-item(
							v-for="value in layoutOptions"
							:key="value"
							clickable
							v-close-popup
							:class="{ selected: item.layout === value }"
							@click="updateLayout(item, value)"
						)
							q-item-section {{ value }}
		q-btn(flat round icon="mdi-close" color="secondary" @click="remCondition(index)" dense size="sm")
</template>

<style scoped lang="scss">
.lastchip {
	border: 1px solid teal;
}
.mychip {
	&.has-border {
		border: 1px solid #888;
	}
}
.han {
	width: 20px;
	height: 100%;
	cursor: move;
	background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAL0lEQVR4ARyKgQ0AMAjCWo/1KJ91OBIghBbYaKspKYEzS7SE2MmY2+e6yMXHVh4AAAD//677ygMAAAAGSURBVAMAH2sKDufNzesAAAAASUVORK5CYII=)
		repeat;
}
.cond {
	display: grid;
	grid-template-columns: 20px 10px 1fr 20px 250px auto;
	padding-right: 0.25rem;
	// justify-items: start;
	align-items: center;
	column-gap: 0.5rem;
	height: 41px;
	background: var(--bgLight);
	border: 1px solid #ccc;
}
.gh {
	background: hsl(213 38% 85% / 1) !important;
	box-shadow: none !important;
	border: none !important;
	* {
		display: none;
	}
	&:before,
	&:after {
		display: none;
	}
}
.selected {
	background: var(--selection);
}
</style>

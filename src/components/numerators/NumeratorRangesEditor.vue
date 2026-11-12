<script setup lang="ts">
import { computed, ref } from 'vue'
import type { QTableColumn } from 'quasar'
import { names } from '@/stores/select'
import { getNumeratorRangeError } from './numeratorRanges'
import type { INumerator, INumeratorRange } from './types'

const props = defineProps<{ numerator: INumerator }>()
const ownerQuery = ref('')
const ownerOptions = computed(() =>
	names.filter(
		(name) =>
			/\s[А-Я]\./.test(name) &&
			name.toLocaleLowerCase('ru').includes(ownerQuery.value.trim().toLocaleLowerCase('ru'))
	)
)
const columns: QTableColumn[] = [
	{ name: 'owner', label: 'Владелец', field: 'owner', align: 'left' },
	{ name: 'lower', label: 'От', field: 'lowerBound', align: 'left' },
	{ name: 'upper', label: 'До', field: 'upperBound', align: 'left' },
	{ name: 'actions', label: '', field: 'id', align: 'right' },
]

function getError(range: INumeratorRange) {
	return getNumeratorRangeError(range, props.numerator.ranges, props.numerator)
}

function addRange() {
	props.numerator.ranges.push({
		id: crypto.randomUUID(),
		owner: null,
		lowerBound: null,
		upperBound: null,
	})
}

function removeRange(id: string) {
	const index = props.numerator.ranges.findIndex((range) => range.id === id)
	if (index >= 0) props.numerator.ranges.splice(index, 1)
}

function filterOwners(value: string, update: (callback: () => void) => void) {
	update(() => {
		ownerQuery.value = value
	})
}
</script>

<template lang="pug">
.numerator-ranges
	.text-subtitle1.q-mb-xs Диапазоны владельцев
	.text-caption.text-grey-7.q-mb-md
		| Закрепите диапазоны номеров за сотрудниками. Диапазоны не должны пересекаться
		|  и выходить за общие границы нумератора.
	q-table.numerator-ranges__table(
		:rows="numerator.ranges", :columns="columns", row-key="id",
		flat, bordered, hide-bottom, :pagination="{ rowsPerPage: 0 }"
	)
		template(v-slot:body="slot")
			q-tr(:props="slot", no-hover)
				q-td.numerator-ranges__owner(key="owner", :props="slot")
					q-select(
						v-model="slot.row.owner", :options="ownerOptions", outlined, dense,
						use-input, clearable, :input-debounce="0", placeholder="Выберите сотрудника",
						@filter="filterOwners", @popup-hide="ownerQuery = ''"
					)
						template(v-slot:no-option)
							q-item
								q-item-section.text-grey-7 Ничего не найдено
				q-td.numerator-ranges__bound(key="lower", :props="slot")
					q-input(
						v-model.number="slot.row.lowerBound", type="number", step="1", outlined, dense,
						:min="numerator.lowerBound", :max="numerator.upperBound"
					)
				q-td.numerator-ranges__bound(key="upper", :props="slot")
					q-input(
						v-model.number="slot.row.upperBound", type="number", step="1", outlined, dense,
						:min="numerator.lowerBound", :max="numerator.upperBound"
					)
				q-td(key="actions", :props="slot", auto-width)
					q-btn(
						flat, round, dense, color="negative", icon="mdi-delete-outline",
						title="Удалить диапазон", @click="removeRange(slot.row.id)"
					)
			q-tr(v-if="getError(slot.row)", :props="slot", no-hover)
				q-td.numerator-ranges__error(colspan="4")
					.text-caption.text-negative {{ getError(slot.row) }}
		template(v-slot:no-data)
			.q-pa-md
				.text-body2 Персональные диапазоны не заданы
				.text-caption.text-grey-7 Номера не закреплены за отдельными сотрудниками.
	.text-caption.text-grey-7.q-mt-sm
		| Когда персональный диапазон исчерпан, сотрудник получает номера из общего списка.
	q-btn.q-mt-sm(
		flat, color="primary", icon="mdi-plus", label="Добавить диапазон", @click="addRange"
	)
</template>

<style scoped lang="scss">
.numerator-ranges {
	padding: 1rem;
	border: 1px solid var(--my-border-color);
	border-radius: var(--rad);
	background: var(--bg-panel);
}

.numerator-ranges__table {
	width: 100%;
}

.numerator-ranges__owner {
	min-width: 260px;
}

.numerator-ranges__bound {
	width: 180px;
	min-width: 140px;
}

.numerator-ranges__error {
	white-space: normal;
}
</style>

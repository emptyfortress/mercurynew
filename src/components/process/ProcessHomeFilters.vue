<script setup lang="ts">
defineProps<{ categories: string[]; authors: string[]; statuses: string[]; showInstanceFilters: boolean }>()
const search = defineModel<string>('search', { required: true })
const category = defineModel<string>('category', { required: true })
const status = defineModel<string>('status', { required: true })
const author = defineModel<string>('author', { required: true })
const emit = defineEmits<{ clear: [] }>()
</script>

<template lang="pug">
q-card.flat.bordered.q-mb-md
	q-card-section
		.row.q-col-gutter-sm.items-center
			.col-12.col-md-7
				q-input(v-model="search" dense outlined clearable placeholder="Название шаблона, ID экземпляра, карточка, шаг или автор")
					template(v-slot:prepend)
						q-icon(name="search")
			.col-12.col-sm-8.col-md-3
				q-select(v-model="category" :options="categories" dense outlined clearable label="Категория")
			.col-12.col-sm-4.col-md-2
				q-btn(flat color="primary" icon="filter_alt_off" label="Сбросить фильтры" @click="emit('clear')")
		div.q-mt-md(v-if="showInstanceFilters")
			.text-caption.text-grey-7.q-mb-xs Фильтры экземпляров
			.row.q-col-gutter-sm
				.col-12.col-sm-6.col-md-3
					q-select(v-model="status" :options="statuses" dense outlined clearable label="Статус")
				.col-12.col-sm-6.col-md-4
					q-select(v-model="author" :options="authors" dense outlined clearable label="Автор")
</template>

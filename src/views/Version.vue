<script setup lang="ts">
import { ref } from 'vue'
import type { QTableProps } from 'quasar'

const cols: QTableProps['columns'] = [
	{
		name: 'ver',
		required: true,
		label: 'Версия',
		align: 'center',
		field: 'ver',
		sortable: true,
	},
	{
		name: 'current',
		required: true,
		label: 'Текущая',
		align: 'center',
		field: 'current',
		sortable: true,
	},
	{
		name: 'dev',
		required: true,
		label: 'БД разработка',
		align: 'center',
		field: 'dev',
		sortable: true,
	},
	{
		name: 'test',
		required: true,
		label: 'БД тест',
		align: 'center',
		field: 'test',
		sortable: true,
	},
	{
		name: 'prod',
		required: true,
		label: 'БД прод',
		align: 'center',
		field: 'prod',
		sortable: true,
	},
	{
		name: 'author',
		required: true,
		label: 'Автор',
		align: 'left',
		field: 'author',
		sortable: true,
	},
	{
		name: 'created',
		required: true,
		label: 'Дата создания',
		align: 'left',
		field: 'created',
		sortable: true,
	},
	{
		name: 'comment',
		required: true,
		label: 'Комментарий',
		align: 'left',
		field: 'comment',
		sortable: true,
	},
	{
		name: 'action',
		required: true,
		label: '',
		align: 'center',
		field: 'action',
		sortable: true,
	},
]

const current = ref(0)

const rows: any[] = [
	{
		id: 0,
		ver: 4,
		dev: 1,
		test: 1,
		prod: 2,
		author: 'Орлов П.С.',
		created: '22.05.2025',
		comment: 'Учтены все замечания на демо',
	},
	{
		id: 1,
		ver: 3,
		dev: 1,
		test: 1,
		prod: 3,
		author: 'Орлов П.С.',
		created: '22.05.2025',
		comment: '',
	},
	{
		id: 2,
		ver: 2,
		dev: 1,
		test: 0,
		prod: 0,
		author: 'Орлов П.С.',
		created: '22.05.2025',
		comment: '',
	},
	{
		id: 3,
		ver: 1,
		dev: 1,
		test: 1,
		prod: 1,
		author: 'Орлов П.С.',
		created: '22.05.2025',
		comment: '',
	},
	{
		id: 4,
		ver: 0,
		dev: 1,
		test: 0,
		prod: 0,
		author: 'Орлов П.С.',
		created: '22.05.2025',
		comment: '',
	},
]
</script>

<template lang="pug">
q-page(padding)
	.cont()
		.row.justify-between.items-center
			.hd Управление версиями
			q-btn(flat round color="primary" icon='mdi-help-circle-outline' @click="")

		q-table(flat
			:columns='cols'
			:rows='rows'
			row-key="id"
			color="primary"
		)
			template(#body="props")
				q-tr(:class="{ 'current': props.row.id === current }")
					q-td.text-center() {{ props.row.ver}}
					q-td.text-center()
						q-icon(v-if='current == props.row.id' name="mdi-progress-check" color="primary" size='24px')
					q-td.text-center
						q-icon(v-if='props.row.dev == 1' name="mdi-database-check" color="primary" size='24px')

					q-td.text-center
						q-icon(v-if='props.row.test == 1' name="mdi-database-check" color="primary" size='24px')

					q-td.text-center
						q-icon(v-if='props.row.prod == 1' name="mdi-database-check" color="primary" size='24px')
						q-icon(v-if='props.row.prod == 2' name="mdi-database-alert-outline" color="negative" size='24px')
						q-icon(v-if='props.row.prod == 3' name="mdi-database-off-outline" color="negative" size='24px')

					q-td {{ props.row.author }}
					q-td {{ props.row.created }}
					q-td {{ props.row.comment }}
					q-td.text-right
						q-btn(flat round icon="mdi-dots-vertical" color="primary" @click="" dense) 

		br
		br
		ul
			li Опубликовать (version, сервер)
			li Создать на основе (version)
			li Сделать текущей (version)
			li Посмотреть (version)
			li Удалить (version)
		br
		div Журнал публикаций - распахивающиеся строки или сквозной?

</template>

<style scoped lang="scss">
.cont {
	max-width: 1400px;
	margin: 0 auto;
}
.current {
	background: var(--selection);
}

.hd {
	font-size: 1.3rem;
}
.bt {
	padding: 0.5rem;
	border-radius: var(--rad);
	text-align: center;
	display: inline-flex;
	justify-content: center;
	align-items: center;
	color: $primary;
	cursor: pointer;
	margin-left: auto;

	&:hover {
		background: $primary;
		color: white;
	}
}

.ic {
	font-size: 1.5rem;
}
</style>

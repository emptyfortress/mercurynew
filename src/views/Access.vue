<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ServerTile from '@/components/ServerTile.vue'

const router = useRouter()

const navigate = () => {
	router.push('ai')
}

const simple = [
	{
		label: 'Компания Доксвижн',
		avatar: '/logo.svg',
		children: [
			{
				label: 'Отдел разработки',
				children: [
					{ label: 'Орлов П.С.', icon: 'mdi-account-circle' },
					{ label: 'Лебедев А.Т.', icon: 'mdi-account-circle' },
				],
			},
			{
				label: 'Отдел тестирования',
				children: [
					{ label: 'Воробьева К.М.', icon: 'mdi-account-circle' },
					{ label: 'Грачев С.С.', icon: 'mdi-account-circle' },
				],
			},
			{
				label: 'Отдел внедрения',
				children: [
					{ label: 'Семенов П.П.', icon: 'mdi-account-circle' },
					{ label: 'Иванов В.Д.', icon: 'mdi-account-circle' },
					{ label: 'Коновалова О.Г.', icon: 'mdi-account-circle' },
				],
			},
		],
	},
]
const expanded = ref()
const filter = ref('')

const editors = ref([
	{ id: 1, name: 'Лебедев С.С.', author: false },
	{ id: 2, name: 'Соловьева И.К.', author: false },
	{ id: 3, name: 'Воробьев А.А.', author: false },
])
const user = ref('')
</script>

<template lang="pug">
q-page(padding)
	.cont()
		.hd
			q-icon(name="mdi-account-key" color="primary")
			|Права на публикацию

		.grid
			div
				q-input.filter(v-model="filter" dense clearable placeholder="Фильтр" @clear="filter = ''")
					template(v-slot:prepend)
						q-icon(name="mdi-magnify")

				q-list(dense).q-mt-md
					q-item(clickable )
						q-item-section(side)
							q-icon(name="mdi-account-circle" color="primary")
						q-item-section
							q-item-label Орлов П.С.
						q-item-section(side)
							q-item-label(caption) Автор
					q-item(clickable v-for="item in editors" :key='item.id')
						q-item-section(side)
							q-icon(name="mdi-account-circle" color="primary")
						q-item-section
							q-item-label {{ item.name }}
						q-item-section(side)
							q-btn(flat round dense icon="mdi-close" color="secondary"  size="sm") 

				// q-tree.col-12(
				// :nodes="simple"
				// v-model:expanded="expanded"
				// node-key="label"
				// :filter='filter'
				// default-expand-all)

			ServerTile



</template>

<style scoped lang="scss">
.cont {
	max-width: 1000px;
	margin: 0 auto;
}

.hd {
	font-size: 1.5rem;
	text-align: center;
	.q-icon {
		margin-bottom: 4px;
		margin-right: 0.5rem;
	}
}
.grid {
	margin-top: 1rem;
	display: grid;
	grid-template-columns: 1fr 2fr;
	// justify-items: start;
	// align-items: start;
	column-gap: 3rem;
}
.filter {
	margin-bottom: 1rem;
	max-width: 250px;
}
</style>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isLoaded = ref(false)

const load = (() => {
	setTimeout(() => {
		isLoaded.value = true
	}, 1500)
})

onMounted(() => {
	setTimeout(() => {
		isLoaded.value = true
	}, 1500)
})
</script>

<template lang="pug">
.loading
	q-markup-table(v-if='isLoaded' flat bordered)
		thead
			tr
				th.text-left() Номер
				th.text-left() Дата регистрации
				th.text-left() Автор
				th.text-left() Тема
				th.text-left() Исполнитель
				th.text-left() Статус
		tbody
			tr
				td.text-left 1
				td.text-left 2025-02-20
				td.text-left Иванов И.И.
				td.text-left Проблема с сервером
				td.text-left Петров П.П.
				td.text-left В процессе
			tr
				td.text-left 2
				td.text-left 2025-02-19
				td.text-left Сидоров С.С.
				td.text-left Ошибка в коде
				td.text-left Смирнов С.С.
				td.text-left Закрыто
			tr
				td.text-left 3
				td.text-left 2025-02-18
				td.text-left Кузнецов А.А.
				td.text-left Запрос на изменение
				td.text-left Васильев В.В.
				td.text-left В ожидании
			tr
				td.text-left 4
				td.text-left 2025-02-17
				td.text-left Петрова П.П.
				td.text-left Обновление системы
				td.text-left Федоров Ф.Ф.
				td.text-left Завершено
			tr
				td.text-left 5
				td.text-left 2025-02-16
				td.text-left Алексеева А.А.
				td.text-left Ошибка базы данных
				td.text-left Николаев Н.Н.
				td.text-left В процессе

	.warn(v-if='isLoaded')
		q-icon(name="mdi-alert" color="negative")
		span Данные фиктивные и используются только для настройки.

// TODO: Сделать вотемарк про фиктивные данные

	q-markup-table(v-else)
		thead
			tr
				th.text-left(style="width: 150px")
					q-skeleton( type="text")
				th.text-right
					q-skeleton( type="text")
				th.text-right
					q-skeleton( type="text")
				th.text-right
					q-skeleton( type="text")
				th.text-right
					q-skeleton( type="text")
				th.text-right
					q-skeleton( type="text")
		tbody
			tr(v-for="n in 5" :key="n")
				td.text-left
					q-skeleton( type="text" width="85px")
				td.text-right
					q-skeleton( type="text" width="50px")
				td.text-right
					q-skeleton( type="text" width="35px")
				td.text-right
					q-skeleton( type="text" width="65px")
				td.text-right
					q-skeleton( type="text" width="25px")
				td.text-right
					q-skeleton( type="text" width="85px")
	
</template>

<style scoped lang="scss">
.loading {
	margin-top: 1rem;
}

.warn {
	color: darkred;
	font-weight: 600;
	margin-top: .5rem;
	font-size: .8rem;

	.q-icon {
		font-size: 1.1rem;
		color: $negative;
		margin-right: .5rem;
	}
}
</style>

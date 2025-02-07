<script setup lang="ts">
</script>

<template lang="pug">
q-page(padding)
	.container
		h6 Баги
		br

		q-markup-table(wrap-cells)
			thead
				q-tr
					th #
					th страница
					th описание
					th серьезность
					th fixed?

			tbody
				tr
					td 1
					td Редактор процессов, редактор форм
					td Ширина страницы фиксирована, чтобы ускорить разработку.
					td 2
					td
						q-icon(name="mdi-close" color="negative" size="sm")
							q-tooltip Не исправлено
				tr
					td 2
					td Главная
					td При просмотре приложения в группе и закрытии панели, закрывается и панель группы тоже.
					td 3
					td
						q-icon(name="mdi-check-bold" color="positive" size="sm")
							q-tooltip Исправлено

</template>

<style scoped lang="scss">
.q-page {
	display: flex;
	justify-content: center;
}

th {
	text-align: left;
}

.container {
	max-width: 800px;
}
</style>

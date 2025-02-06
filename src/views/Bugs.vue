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
					th fix

			tbody
				tr
					td 1
					td Редактор процессов, редактор форм
					td Ширина страницы фиксирована, чтобы ускорить разработку.
					td 2
					td
						q-icon(name="mdi-close" color="negative" size="sm")

</template>

<style scoped lang="scss">
.q-page {
	display: flex;
	justify-content: center;
}

.container {
	max-width: 800px;
}
</style>

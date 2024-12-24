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

			tbody
				tr
					td 1
					td Главная, роли, формы
					td При большом числе карточек и их переносе на вторую строку, невозможно сортировать перетаскиванием.
					td 1
				tr
					td 2
					td Главная
					td При раскрытии группы невозможно сортировать приложения
					td 1
				tr
					td 3
					td Главная, роли, формы
					td При большом числе карточек flip-анимация неправильно отрабатывает сворачивание распахнутой карточки (в правой части экрана). Баг появляется, когда включаешь wrap in flex container.
					td 2
				tr
					td 4
					td Главная
					td При распахивании группы заголовок иногда скачет вниз, под кнопку "Назад"
					td 3
				tr
					td 5
					td Главная
					td При сворачивании распахнутой карточки кнопка, "Плюс" появляется раньше, чем нужно (до сворачивания) и двигается вместе в карточкой.
					td 3

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

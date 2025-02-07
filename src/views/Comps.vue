<script setup lang="ts">


const getImageUrl = (name: string) => new URL(`../assets/img/screenshots/${name}.png`, import.meta.url).href

</script>

<template lang="pug">
q-page(padding)
	.container
		h6 Общие компоненты
		br
		q-markup-table(wrap-cells)
			thead
				q-tr
					th Скриншот
					th Название
					th Страница
					th Отличия

			tbody
				tr
					td
						img(:src='getImageUrl("plus")')
					td Кнопка "Добавить"
					td
						RouterLink(to="/") Главная
						RouterLink(to="/roles") Роли
						RouterLink(to="/forms") Формы
						RouterLink(to="/lists") Списки
						RouterLink(to="/form") Редактор форм
					td
						q-icon(name="mdi-cancel" color="primary" size="md")

				tr
					td
						img(:src='getImageUrl("close")' fit="none")
					td Кнопка "Закрыть"
					td
						RouterLink(to="/") Главная
						RouterLink(to="/roles") Роли
						RouterLink(to="/forms") Формы
						RouterLink(to="/lists") Списки
						RouterLink(to="/form") Редактор форм
					td
						q-icon(name="mdi-cancel" color="primary" size="md")
				tr
					td
						img(:src='getImageUrl("close1")')
					td Кнопка "Закрыть" small
					td
						RouterLink(to="/form") Редактор форм
					td
						q-icon(name="mdi-cancel" color="primary" size="md")
				tr
					td
						img(:src='getImageUrl("buttons")' width="150")
					td Стандартные кнопки
					td Диалоги создания (по кнопке "Плюс")
					td
						q-icon(name="mdi-cancel" color="primary" size="md")
</template>

<style scoped lang="scss">
.q-page {
	display: flex;
	justify-content: center;
}

th {
	text-align: left;
}

tr td:first-child,
tr th:first-child {
	text-align: center;
}

a {
	margin-left: .5rem;

	&::after {
		content: ','
	}

}

.container {
	max-width: 900px;
}
</style>

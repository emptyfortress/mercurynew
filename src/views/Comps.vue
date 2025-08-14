<script setup lang="ts">
const getImageUrl = (name: string) =>
	new URL(`../assets/img/screenshots/${name}.png`, import.meta.url).href
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

		br
		h6 Палитра
		.row
			pre
				code.language-css
					| :root {
					|   --dvgreen: #adce2e;
					|   --dvviolet: #a6a5fc;
					|   --dvblue: #9eccff;
					|   --dvdark: #270f47;
					|   --dark: #003153;
					|   --dark1: hsl(205 100% 22% / 1);
					|   --dark2: #143c5f;
					|   --selection: hsl(240.69deg 93.55% 90%);
					|   --green: #82a2b0;
					|   --middle: hsl(213 31% 87% / 1);
					|   --rad: 0.4rem;
					|   --drag: #3b82f6;
					|   --bgLight: hsl(214 42% 96% / 1);
					|   --ghost: hsl(213 38% 81% / 1);
					|   --icon: hsl(199 23% 45% / 1);
					| }

			img.q-ml-lg(src='@/assets/img/code.png')

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
	margin-left: 0.5rem;

	&::after {
		content: ',';
	}
}

.container {
	max-width: 900px;
}
</style>

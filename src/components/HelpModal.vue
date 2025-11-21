<template lang="pug">
q-dialog(v-model="visible" backdrop-filter="blur(4px) saturate(150%)")
	q-card
		q-btn.close(icon="mdi-close" color="negative" round dense v-close-popup)
		q-card-section.row.items-center.q-pb-none
			.text-h6(v-if="menuLabel === 'Помощь'") Общая помощь
			.text-h6(v-else) Интерактивный гид
		q-card-section(v-if="menuLabel === 'Помощь'")
			ol
				li
					a(href="#") Введение в приложение
				li
					a(href="#") Построение bpmn-диаграммы
				li
					a(href="#") Настройка ролей
				li
					a(href="#") Работа с формами
				li
					a(href="#") Управление списками
				li
					a(href="#") Просмотр изменений
				li
					a(href="#") Экспорт данных
				li
					a(href="#") Импорт шаблонов
				li
					a
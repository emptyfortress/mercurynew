<script setup lang="ts"></script>

<template lang="pug">
div Отличная задача — это как раз тот тип внутреннего инструмента, где можно сильно упростить жизнь сотрудникам и бухгалтерии. Давай разложим всё по полочкам и сразу наметим архитектуру (с учётом того, что ты Vue-разработчик).

q-separator(spaced)

h1 🧭 1. Что должно уметь приложение

ul
	li Подача заявки на командировку (даты, город, цель, участники, вид транспорта)
	li Многоуровневое согласование (последовательное или параллельное)
	li Расчёт суточных и аванса автоматически
	li Загрузка чеков / билетов / посадочных
	li Формирование авансового отчёта
	li Уведомления (Telegram / email / push)
	li Календарь командировок + конфликты
	li Отчёты и аналитика для руководства
	li Экспорт в 1С / Excel / PDF

q-separator
br
br
.text-bold Минимальный MVP для учета командировок:

h2 👤 Для сотрудника:
ul
	li Создать командировку
	li Указать:
		ul
			li даты (с/по)
			li место (город, страна)
			li цель
			li аванс (нужен / сумма)
	li Загрузить документы:
		ul
			li билеты
			li чеки
			li счета
	li Отправить на согласование

h2 👨‍💼 Для руководителя:
ul
	li Одобрить / отклонить
	li Комментарий

h2 💰 Для бухгалтерии:
ul
	li Подтвердить расходы
	li Зафиксировать выплаты
	li Закрыть командировку

q-separator(spaced)

h1 🧱 2. Основные сущности (модель данных)

div Вот базовая структура (можно сразу в Pinia/store и backend перенести):

pre
	code.language-typescript.
		type TripStatus =
			| 'draft'
			| 'submitted'
			| 'approved'
			| 'rejected'
			| 'in_progress'
			| 'completed'
			| 'closed'

		interface BusinessTrip {
			id: string
			employeeId: string
			destination: string
			startDate: string
			endDate: string
			purpose: string
			advanceAmount: number
			status: TripStatus
			documents: Document[]
			expenses: Expense[]
			approvals: Approval[]
		}

		interface Document {
			id: string
			type: 'ticket' | 'receipt' | 'invoice' | 'other'
			fileUrl: string
		}

		interface Expense {
			id: string
			amount: number
			currency: string
			category: 'hotel' | 'transport' | 'food' | 'other'
			date: string
		}

		interface Approval {
			role: 'manager' | 'accountant'
			status: 'pending' | 'approved' | 'rejected'
			comment?: string
		}

q-separator(spaced)

h2 🧩 3. Архитектура фронтенда (Vue)

div С учётом твоего стека (Vue + Pinia):

h2 📦 Stores (Pinia)
ul
li useTripsStore — список командировок
li useUserStore — текущий пользователь
li useWorkflowStore — статусы / роли / переходы

div 👉 Лучше отдельный store под trips, а не мешать в существующий.

q-separator(spaced)
h2 🧱 Компоненты

pre
	code.language-typescript.
		/components
			TripForm.vue
			TripList.vue
			TripCard.vue
			TripDetails.vue
			ExpenseList.vue
			DocumentUploader.vue
			ApprovalPanel.vue

q-separator(spaced)

h2 🧠 Логика статусов (важно!)

div Сделай явный workflow:

pre
	code.language-typescript.
		const transitions = {
			draft: ['submitted'],
			submitted: ['approved', 'rejected'],
			approved: ['in_progress'],
			in_progress: ['completed'],
			completed: ['closed']
		}

div И helper:

pre
	code.language-typescript.
		function canTransition(from: TripStatus, to: TripStatus) {
			return transitions[from]?.includes(to)
		}

q-separator(spaced)
h2 🖥️ 4. Backend (если нужен)

div Минимально:

ul
li REST API или GraphQL
li Хранение файлов (S3 / локально / MinIO)
div Эндпоинты:
pre
	code.language-typescript.
		GET    /trips
		POST   /trips
		GET    /trips/:id
		PATCH  /trips/:id
		POST   /trips/:id/submit
		POST   /trips/:id/approve
		POST   /trips/:id/reject

q-separator(spaced)
h2 🔐 5. Роли и доступы

div Минимум:

ul
	li Сотрудники (подают заявки)
	li Руководители (согласовывают)
	li Бухгалтерия / финансы (утверждают аванс и принимают отчёт)
	li Администратор / HR

div Пример:

pre
	code.language-typescript.
		function canApprove(user, trip) {
			return user.role === 'manager' && trip.status === 'submitted'
		}

q-separator(spaced)
h2 📊 6. UI/UX идеи
.text-bold Список командировок:
ul
	li фильтры:
		ul
			li статус
			li даты
	li быстрые бейджи:
		ul
			li 🟡 на согласовании
			li 🟢 одобрено
			li 🔴 отклонено

.text-bold Карточка:
ul
	li таймлайн статусов
	li список расходов
	li документы

q-separator(spaced)
h2 ⚙️ 7. Интеграция с СЭД

div Варианты интеграции:
ul
	li REST API СЭД
	li выгрузка PDF
	li webhooks

div Пример:
ul
	li после approved → создаем документ в СЭД
	li после closed → архивируем

q-separator(spaced)
h2 🚀 8. MVP план (очень практичный)
ol
	li CRUD командировок
	li Статусы + workflow
	li Простое согласование
	li Загрузка файлов
	li Список + карточка

div 👉 Без интеграции сначала!

q-separator(spaced)
h2 💡 9. Что можно добавить позже
ul
	li автоматический расчет суточных
	li валюты и курсы
	li OCR чеков
	li интеграция с HR системой
	li мобильная версия

q-separator(spaced)
h2 👉 Самое главное
div Предлагаю название приложения:
	span.text-bold.q-ml-md Командировки
div Краткое описание:
	span.text-bold.q-ml-md Простое приложение для оформления командировок

q-separator(spaced)
h2 🧭 Дальше
div Скажи, с чего ты хочешь начать:
ol
	li 👉 Нарисуем BPMN схему процесса
	li 👉 Создадим карточку и форму заявки на командировку
	li 👉 Сразу сделаем полный скелет приложения и будем дорабатывать по шагам.

</template>
<style scoped lang="scss">
h1 {
	font-size: 1.5rem;
	font-weight: 600;
	line-height: 4rem;
}
h2 {
	font-size: 1.2rem;
	font-weight: 600;
	margin: 0;
}
pre {
	background: #eee;
	padding: 1rem;
	border: 1px solid #ccc;
}
</style>

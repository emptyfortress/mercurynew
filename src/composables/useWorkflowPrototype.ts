import { reactive } from 'vue'
import type { Edge, Node } from '@vue-flow/core'

export type WorkflowStatus = 'Выполняется' | 'Ожидает' | 'Ошибка' | 'Завершён' | 'Остановлен' | 'Приостановлен'

export interface WorkflowTemplate {
	id: string
	name: string
	category: string
	enabled: boolean
	updatedAt: string
	linkedTemplateIds: string[]
	nodes: Node[]
	edges: Edge[]
}

export interface WorkflowInstance {
	author: string
	id: string
	templateId: string
	templateName: string
	status: WorkflowStatus
	currentStep: string
	startedAt: string
	elapsed: string
	card: string
	events: string[]
}

const templates: WorkflowTemplate[] = [
	{
		id: 'purchase',
		name: 'Согласование закупки',
		category: 'Закупки',
		enabled: true,
		updatedAt: 'Сегодня, 10:42',
		linkedTemplateIds: ['contract'],
		nodes: [
			{ id: 'start', type: 'input', position: { x: 40, y: 130 }, data: { label: 'Новая заявка' } },
			{ id: 'review', position: { x: 250, y: 130 }, data: { label: 'Проверка руководителем' } },
			{ id: 'approve', position: { x: 470, y: 50 }, data: { label: 'Согласование бюджета' } },
			{ id: 'contract', position: { x: 470, y: 220 }, data: { label: 'Подготовить договор' } },
			{ id: 'end', type: 'output', position: { x: 700, y: 130 }, data: { label: 'Закупка согласована' } },
		],
		edges: [
			{ id: 'e-start-review', source: 'start', target: 'review', animated: false },
			{ id: 'e-review-approve', source: 'review', target: 'approve', label: 'до 500 тыс. ₽' },
			{ id: 'e-review-contract', source: 'review', target: 'contract', label: 'более 500 тыс. ₽' },
			{ id: 'e-approve-end', source: 'approve', target: 'end' },
			{ id: 'e-contract-end', source: 'contract', target: 'end' },
		],
	},
	{
		id: 'invoice',
		name: 'Обработка счёта',
		category: 'Финансы',
		enabled: true,
		updatedAt: 'Вчера, 16:18',
		linkedTemplateIds: [],
		nodes: [
			{ id: 'start', type: 'input', position: { x: 50, y: 120 }, data: { label: 'Счёт получен' } },
			{ id: 'match', position: { x: 280, y: 120 }, data: { label: 'Сверка с заказом' } },
			{ id: 'pay', type: 'output', position: { x: 530, y: 120 }, data: { label: 'Передать в оплату' } },
		],
		edges: [
			{ id: 'e-start-match', source: 'start', target: 'match' },
			{ id: 'e-match-pay', source: 'match', target: 'pay' },
		],
	},
	{
		id: 'contract',
		name: 'Подготовка договора',
		category: 'Закупки',
		enabled: true,
		updatedAt: '12 мая, 09:10',
		linkedTemplateIds: [],
		nodes: [
			{ id: 'start', type: 'input', position: { x: 60, y: 120 }, data: { label: 'Согласование завершено' } },
			{ id: 'draft', position: { x: 290, y: 120 }, data: { label: 'Подготовить проект' } },
			{ id: 'end', type: 'output', position: { x: 540, y: 120 }, data: { label: 'Отправить на подпись' } },
		],
		edges: [
			{ id: 'e-start-draft', source: 'start', target: 'draft' },
			{ id: 'e-draft-end', source: 'draft', target: 'end' },
		],
	},
]

const demoCategories = [
	{ category: 'Закупки', names: ['Выбор поставщика', 'Заказ оборудования', 'Заявка на материалы', 'Проверка поставки', 'Оплата закупки', 'Возврат товара', 'Закупка услуг', 'Оценка поставщика', 'План закупок', 'Заявка на тендер'] },
	{ category: 'Финансы', names: ['Согласование платежа', 'Авансовый отчёт', 'Возмещение расходов', 'Проверка бюджета', 'Финансовый отчёт', 'Сверка расчётов', 'Закрытие периода', 'Планирование затрат', 'Проверка акта', 'Регистрация счёта'] },
	{ category: 'Персонал', names: ['Приём сотрудника', 'Оформление отпуска', 'Командировка', 'Оценка сотрудника', 'Подбор кандидата', 'Обучение сотрудника', 'Изменение должности', 'Увольнение', 'Выдача пропуска', 'Адаптация сотрудника'] },
	{ category: 'Документы', names: ['Регистрация письма', 'Согласование приказа', 'Подписание договора', 'Проверка документа', 'Архивирование', 'Согласование инструкции', 'Подготовка протокола', 'Обработка обращения', 'Выдача доверенности', 'Публикация документа'] },
	{ category: 'Продажи', names: ['Обработка заказа', 'Коммерческое предложение', 'Согласование скидки', 'Возврат клиента', 'Проверка отгрузки', 'Выставление счёта', 'Регистрация клиента', 'Продление договора', 'Обработка претензии', 'Закрытие сделки'] },
	{ category: 'ИТ и поддержка', names: ['Выдача доступа', 'Заявка в поддержку', 'Замена оборудования', 'Установка программы', 'Устранение инцидента', 'Обновление системы', 'Создание учётной записи', 'Проверка безопасности', 'Изменение сервиса', 'Резервное копирование'] },
]

// Keep the original three templates; graph objects are independent for every demo template.
for (let index = templates.length; index < 60; index += 1) {
	const group = demoCategories[Math.floor(index / 10)]!
	const source = templates[index % 3]!
	templates.push({
		...source,
		id: `demo-template-${index + 1}`,
		name: group.names[index % 10]!,
		category: group.category,
		enabled: index % 9 !== 0,
		linkedTemplateIds: [],
		nodes: JSON.parse(JSON.stringify(source.nodes)) as Node[],
		edges: JSON.parse(JSON.stringify(source.edges)) as Edge[],
	})
}

const demoAuthors = ['Иванов И.И.', 'Петрова А.С.', 'Сидоров П.В.', 'Орлова Е.Н.', 'Кузнецов М.А.', 'Текущий пользователь']

const sampleInstances: WorkflowInstance[] = [
	{ id: 'WF-10482', author: 'Иванов И.И.', templateId: 'purchase', templateName: 'Согласование закупки', status: 'Выполняется', currentStep: 'Проверка руководителем', startedAt: 'Сегодня, 11:24', elapsed: '18 мин', card: 'Заявка ЗК-2481', events: ['Заявка создана', 'Назначен руководитель отдела', 'Ожидается решение руководителя'] },
	{ id: 'WF-10481', author: 'Сидоров П.В.', templateId: 'invoice', templateName: 'Обработка счёта', status: 'Ошибка', currentStep: 'Сверка с заказом', startedAt: 'Сегодня, 10:56', elapsed: '46 мин', card: 'Счёт СЧ-1930', events: ['Счёт получен', 'Не найден связанный заказ', 'Автоматическая сверка завершилась ошибкой'] },
	{ id: 'WF-10480', author: 'Петрова А.С.', templateId: 'purchase', templateName: 'Согласование закупки', status: 'Ожидает', currentStep: 'Согласование бюджета', startedAt: 'Сегодня, 09:12', elapsed: '2 ч 30 мин', card: 'Заявка ЗК-2479', events: ['Руководитель согласовал заявку', 'Назначен финансовый директор', 'Ожидание превышает обычное время'] },
	{ id: 'WF-10479', author: 'Иванов И.И.', templateId: 'contract', templateName: 'Подготовка договора', status: 'Выполняется', currentStep: 'Подготовить проект', startedAt: 'Сегодня, 08:42', elapsed: '3 ч', card: 'Договор ДОГ-773', events: ['Шаблон договора выбран', 'Документ готовится'] },
	{ id: 'WF-10478', author: 'Сидоров П.В.', templateId: 'purchase', templateName: 'Согласование закупки', status: 'Завершён', currentStep: 'Завершён', startedAt: 'Вчера, 17:03', elapsed: '1 д 2 ч', card: 'Заявка ЗК-2474', events: ['Заявка согласована', 'Закупка передана в работу'] },
	{ id: 'WF-10477', author: 'Петрова А.С.', templateId: 'invoice', templateName: 'Обработка счёта', status: 'Остановлен', currentStep: 'Сверка с заказом', startedAt: 'Вчера, 15:30', elapsed: 'Остановлен', card: 'Счёт СЧ-1922', events: ['Счёт получен', 'Экземпляр остановлен оператором'] },
]

export const workflowStatuses: WorkflowStatus[] = ['Выполняется', 'Ожидает', 'Ошибка', 'Приостановлен', 'Завершён', 'Остановлен']
const demoStatuses: WorkflowStatus[] = ['Выполняется', 'Выполняется', 'Ожидает', 'Ошибка', 'Приостановлен', 'Завершён', 'Остановлен']
const instances: WorkflowInstance[] = sampleInstances.concat(Array.from({ length: 800 - sampleInstances.length }, (_, index) => {
	const template = templates[index % templates.length]!
	const status = demoStatuses[index % demoStatuses.length]!
	const id = `WF-${10483 + index}`
	return {
		id,
		author: demoAuthors[(index + Math.floor(index / 7)) % demoAuthors.length]!,
		templateId: template.id,
		templateName: template.name,
		status,
		currentStep: String(template.nodes[(index % template.nodes.length)]?.data.label ?? 'Выполняется'),
		startedAt: `Сегодня, ${String(8 + (index % 10)).padStart(2, '0')}:${String((index * 7) % 60).padStart(2, '0')}`,
		elapsed: status === 'Остановлен' ? 'Остановлен' : `${(index % 8) + 1} ч ${(index * 3) % 60} мин`,
		card: `Карточка ${id}`,
		events: ['Экземпляр создан', `Шаг «${String(template.nodes[0]?.data.label ?? 'Старт')}» выполнен`],
	}
}))

interface WorkflowPrototypeState {
	templates: WorkflowTemplate[]
	instances: WorkflowInstance[]
	nextInstance: number
}

export const workflowPrototype: WorkflowPrototypeState = reactive({ templates, instances, nextInstance: 10483 + instances.length - sampleInstances.length })

export function createTemplate() {
	const id = `process-${Date.now()}`
	workflowPrototype.templates.unshift({
		id,
		name: 'Новый процесс',
		category: 'Без категории',
		enabled: false,
		updatedAt: 'Только что',
		linkedTemplateIds: [],
		nodes: [
			{ id: 'start', type: 'input', position: { x: 60, y: 140 }, data: { label: 'Старт' } },
			{ id: 'step-1', position: { x: 300, y: 140 }, data: { label: 'Новый шаг' } },
			{ id: 'end', type: 'output', position: { x: 540, y: 140 }, data: { label: 'Завершение' } },
		],
		edges: [
			{ id: 'e-start-step', source: 'start', target: 'step-1' },
			{ id: 'e-step-end', source: 'step-1', target: 'end' },
		],
	})
	return id
}

export function startWorkflow(template: WorkflowTemplate) {
	if (!template.enabled) return
	const id = `WF-${workflowPrototype.nextInstance++}`
	workflowPrototype.instances.unshift({
		id,
		author: 'Текущий пользователь',
		templateId: template.id,
		templateName: template.name,
		status: 'Выполняется',
		currentStep: String(template.nodes[0]?.data.label ?? 'Старт'),
		startedAt: 'Только что',
		elapsed: '0 мин',
		card: `Новая карточка ${id}`,
		events: ['Экземпляр создан из шаблона'],
	})
	return id
}

export function stopWorkflow(instance: WorkflowInstance) {
	instance.status = 'Остановлен'
	instance.elapsed = 'Остановлен оператором'
	instance.events.unshift('Экземпляр остановлен оператором')
}

export function makeEdgeId() {
	return `edge-${Date.now()}-${Math.round(Math.random() * 1000)}`
}

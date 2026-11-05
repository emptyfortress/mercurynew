import { reactive } from 'vue'
import type { Edge, Node } from '@vue-flow/core'
import type { ProcessVariable } from '@/components/process/processVariables'

export type WorkflowStatus =
	'Активен' | 'Приостановлен из-за ошибки' | 'Приостановлен' | 'Остановлен' | 'Завершен успешно'

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
	description?: string
	priority?: string
	gatewayIds?: string[]
	variables?: ProcessVariable[]
	status: WorkflowStatus
	currentStep: string
	startedAt: string
	elapsed: string
	card: string
	events: string[]
}

function createExampleNode(
	id: string,
	label: string,
	libraryType: string,
	x: number,
	y: number,
	description: string
): Node {
	return {
		id,
		type: libraryType === 'start' ? 'input' : libraryType === 'end' ? 'output' : 'default',
		position: { x, y },
		data: { label, libraryType, description },
	}
}

function createExample(
	id: string,
	name: string,
	category: string,
	nodes: Node[],
	connections: [source: string, target: string, label?: string][]
): WorkflowTemplate {
	return {
		id,
		name,
		category,
		enabled: true,
		updatedAt: 'Сегодня',
		linkedTemplateIds: [],
		nodes: nodes.map((node) => ({ ...node, id: `${id}-${node.id}` })),
		edges: connections.map(([source, target, label], index) => ({
			id: `${id}-edge-${index}`,
			source: `${id}-${source}`,
			target: `${id}-${target}`,
			type: 'smoothstep',
			...(label ? { label } : {}),
		})),
	}
}

const templates: WorkflowTemplate[] = [
	createExample(
		'purchase',
		'Согласование заявки на закупку',
		'Закупки',
		[
			createExampleNode(
				'start',
				'Начальная функция',
				'start',
				40,
				160,
				'Получение новой заявки на закупку.'
			),
			createExampleNode(
				'review',
				'Проверка руководителем',
				'docsvision-ud-task',
				180,
				160,
				'Проверка обоснования и состава закупки.'
			),
			createExampleNode(
				'condition',
				'Заявка одобрена?',
				'condition',
				410,
				160,
				'Выбор следующего шага по решению руководителя.'
			),
			createExampleNode(
				'budget',
				'Согласование бюджета',
				'docsvision-ud-task',
				550,
				60,
				'Подтверждение бюджета финансовым отделом.'
			),
			createExampleNode(
				'order',
				'Оформить заказ',
				'scenario',
				780,
				60,
				'Подготовка заказа поставщику.'
			),
			createExampleNode(
				'rework',
				'Вернуть на доработку',
				'docsvision-ud-task',
				550,
				300,
				'Уточнение заявки инициатором.'
			),
			createExampleNode(
				'end',
				'Закупка согласована',
				'end',
				1020,
				60,
				'Завершение согласования заявки.'
			),
		],
		[
			['start', 'review'],
			['review', 'condition'],
			['condition', 'budget', 'Да'],
			['condition', 'rework', 'Нет'],
			['rework', 'review', 'Повторная проверка'],
			['budget', 'order'],
			['order', 'end'],
		]
	),
	createExample(
		'invoice',
		'Согласование оплаты счёта',
		'Финансы',
		[
			createExampleNode(
				'start',
				'Начальная функция',
				'start',
				40,
				160,
				'Поступление счёта от поставщика.'
			),
			createExampleNode(
				'match',
				'Сверка с заказом',
				'function',
				180,
				160,
				'Проверка суммы, реквизитов и связанного заказа.'
			),
			createExampleNode(
				'condition',
				'Данные совпадают?',
				'condition',
				410,
				160,
				'Проверка результата сверки.'
			),
			createExampleNode(
				'approve',
				'Подтвердить оплату',
				'docsvision-ud-task',
				550,
				60,
				'Подтверждение оплаты бухгалтером.'
			),
			createExampleNode(
				'pay',
				'Передать в оплату',
				'exchange',
				800,
				60,
				'Передача данных в платёжную систему.'
			),
			createExampleNode(
				'clarify',
				'Уточнить реквизиты',
				'docsvision-ud-task',
				550,
				300,
				'Запрос исправленных данных у поставщика.'
			),
			createExampleNode('end', 'Счёт обработан', 'end', 1020, 60, 'Завершение обработки счёта.'),
		],
		[
			['start', 'match'],
			['match', 'condition'],
			['condition', 'approve', 'Да'],
			['condition', 'clarify', 'Нет'],
			['clarify', 'match', 'Данные исправлены'],
			['approve', 'pay'],
			['pay', 'end'],
		]
	),
	createExample(
		'contract',
		'Согласование проекта договора',
		'Документы',
		[
			createExampleNode(
				'start',
				'Начальная функция',
				'start',
				40,
				180,
				'Запуск подготовки договора.'
			),
			createExampleNode(
				'draft',
				'Подготовить проект',
				'docsvision-ud-task',
				180,
				180,
				'Подготовка проекта по типовому шаблону.'
			),
			createExampleNode(
				'branch',
				'Параллельное согласование',
				'branch',
				410,
				180,
				'Отправка проекта юристу и финансовому отделу.'
			),
			createExampleNode(
				'legal',
				'Проверка юристом',
				'docsvision-ud-task',
				550,
				60,
				'Проверка условий и юридических рисков.'
			),
			createExampleNode(
				'finance',
				'Проверка финансовых условий',
				'docsvision-ud-task',
				550,
				300,
				'Проверка стоимости и порядка расчётов.'
			),
			createExampleNode(
				'join',
				'Все согласовали',
				'and',
				800,
				180,
				'Ожидание завершения обеих проверок.'
			),
			createExampleNode(
				'sign',
				'Отправить на подпись',
				'scenario',
				940,
				180,
				'Подготовка финальной версии и отправка подписанту.'
			),
			createExampleNode(
				'end',
				'Договор согласован',
				'end',
				1180,
				180,
				'Завершение согласования договора.'
			),
		],
		[
			['start', 'draft'],
			['draft', 'branch'],
			['branch', 'legal'],
			['branch', 'finance'],
			['legal', 'join'],
			['finance', 'join'],
			['join', 'sign'],
			['sign', 'end'],
		]
	),
]

const demoAuthors = [
	'Иванов И.И.',
	'Петрова А.С.',
	'Сидоров П.В.',
	'Орлова Е.Н.',
	'Кузнецов М.А.',
	'Текущий пользователь',
]

const sampleInstances: WorkflowInstance[] = [
	{
		id: 'WF-10482',
		author: 'Иванов И.И.',
		templateId: 'purchase',
		templateName: 'Согласование заявки на закупку',
		status: 'Активен',
		currentStep: 'Проверка руководителем',
		startedAt: 'Сегодня, 11:24',
		elapsed: '18 мин',
		card: 'Заявка ЗК-2481',
		events: ['Заявка создана', 'Назначен руководитель отдела', 'Ожидается решение руководителя'],
	},
	{
		id: 'WF-10481',
		author: 'Сидоров П.В.',
		templateId: 'invoice',
		templateName: 'Согласование оплаты счёта',
		status: 'Приостановлен из-за ошибки',
		currentStep: 'Сверка с заказом',
		startedAt: 'Сегодня, 10:56',
		elapsed: '46 мин',
		card: 'Счёт СЧ-1930',
		events: [
			'Счёт получен',
			'Не найден связанный заказ',
			'Автоматическая сверка завершилась ошибкой',
		],
	},
	{
		id: 'WF-10480',
		author: 'Петрова А.С.',
		templateId: 'purchase',
		templateName: 'Согласование заявки на закупку',
		status: 'Приостановлен',
		currentStep: 'Согласование бюджета',
		startedAt: 'Сегодня, 09:12',
		elapsed: '2 ч 30 мин',
		card: 'Заявка ЗК-2479',
		events: [
			'Руководитель согласовал заявку',
			'Назначен финансовый директор',
			'Ожидание превышает обычное время',
		],
	},
	{
		id: 'WF-10479',
		author: 'Иванов И.И.',
		templateId: 'contract',
		templateName: 'Согласование проекта договора',
		status: 'Активен',
		currentStep: 'Подготовить проект',
		startedAt: 'Сегодня, 08:42',
		elapsed: '3 ч',
		card: 'Договор ДОГ-773',
		events: ['Шаблон договора выбран', 'Документ готовится'],
	},
	{
		id: 'WF-10478',
		author: 'Сидоров П.В.',
		templateId: 'purchase',
		templateName: 'Согласование заявки на закупку',
		status: 'Завершен успешно',
		currentStep: 'Закупка согласована',
		startedAt: 'Вчера, 17:03',
		elapsed: '1 д 2 ч',
		card: 'Заявка ЗК-2474',
		events: ['Заявка согласована', 'Закупка передана в работу'],
	},
	{
		id: 'WF-10477',
		author: 'Петрова А.С.',
		templateId: 'invoice',
		templateName: 'Согласование оплаты счёта',
		status: 'Остановлен',
		currentStep: 'Сверка с заказом',
		startedAt: 'Вчера, 15:30',
		elapsed: 'Остановлен',
		card: 'Счёт СЧ-1922',
		events: ['Счёт получен', 'Экземпляр остановлен оператором'],
	},
]

export const workflowStatuses: WorkflowStatus[] = [
	'Активен',
	'Приостановлен из-за ошибки',
	'Приостановлен',
	'Остановлен',
	'Завершен успешно',
]
const demoStatuses: WorkflowStatus[] = [
	'Активен',
	'Приостановлен из-за ошибки',
	'Приостановлен',
	'Остановлен',
	'Завершен успешно',
]
const instances: WorkflowInstance[] = sampleInstances.concat(
	Array.from({ length: 800 - sampleInstances.length }, (_, index) => {
		const template = templates[index % templates.length]!
		const status = demoStatuses[index % demoStatuses.length]!
		const id = `WF-${10483 + index}`
		const startedHour = String(8 + (index % 10)).padStart(2, '0')
		const startedMinute = String((index * 7) % 60).padStart(2, '0')
		return {
			id,
			author: demoAuthors[(index + Math.floor(index / 7)) % demoAuthors.length]!,
			templateId: template.id,
			templateName: template.name,
			status,
			currentStep: String(template.nodes[index % template.nodes.length]?.data.label ?? 'Старт'),
			startedAt: `Сегодня, ${startedHour}:${startedMinute}`,
			elapsed:
				status === 'Остановлен' ? 'Остановлен' : `${(index % 8) + 1} ч ${(index * 3) % 60} мин`,
			card: `Карточка ${id}`,
			events: [
				'Экземпляр создан',
				`Шаг «${String(template.nodes[0]?.data.label ?? 'Старт')}» выполнен`,
			],
		}
	})
)

interface WorkflowPrototypeState {
	templates: WorkflowTemplate[]
	instances: WorkflowInstance[]
	nextInstance: number
}

export const workflowPrototype: WorkflowPrototypeState = reactive({
	templates,
	instances,
	nextInstance: 10483 + instances.length - sampleInstances.length,
})

export function createTemplate(name = 'Новый шаблон') {
	const id = `process-${crypto.randomUUID()}`
	workflowPrototype.templates.push({
		id,
		name,
		category: 'Без категории',
		enabled: false,
		updatedAt: 'Только что',
		linkedTemplateIds: [],
		nodes: [
			{
				id: 'start',
				type: 'input',
				position: { x: 60, y: 140 },
				data: { label: 'Начальная функция', libraryType: 'start' },
			},
			{
				id: 'end',
				type: 'output',
				position: { x: 400, y: 140 },
				data: { label: 'Конечная функция', libraryType: 'end' },
			},
		],
		edges: [],
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
		status: 'Активен',
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

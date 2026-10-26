import type { Component } from 'vue'
import LucideMonitorDot from '@/components/icons/LucideMonitorDot.vue'
import LucideFileSymlink from '@/components/icons/LucideFileSymlink.vue'
import LucideClipboardCheck from '@/components/icons/LucideClipboardCheck.vue'
import LucideClipboardPen from '@/components/icons/LucideClipboardPen.vue'
import LucideColumns3 from '@/components/icons/LucideColumns3.vue'
import LucideListOrdered from '@/components/icons/LucideListOrdered.vue'
import LucideMailSearch from '@/components/icons/LucideMailSearch.vue'
import LucideMailCheck from '@/components/icons/LucideMailCheck.vue'
import LucideFolderSearch from '@/components/icons/LucideFolderSearch.vue'

export type ProcessGateway = {
	id: string
	label: string
	icon: string
	nodes?: { id: string; label: string; icon: Component; shape?: 'gateway' | 'standard' }[]
	variables: { id: string; label: string; type: string; value: string }[]
}

export const processGatewayCatalog: ProcessGateway[] = [
	{
		id: 'simple-types',
		label: 'Шлюз к простым типам',
		icon: 'mdi-code-braces',
		variables: [
			{ id: 'boolean', label: 'Да/Нет', type: 'Логический', value: '—' },
			{ id: 'date-time', label: 'Дата/Время', type: 'Дата и время', value: '—' },
			{ id: 'decimal', label: 'Дробное', type: 'Дробное число', value: '—' },
			{ id: 'enumeration', label: 'Перечисление', type: 'Перечисление', value: '—' },
			{ id: 'text', label: 'Строка', type: 'Строка', value: '—' },
			{ id: 'integer', label: 'Целое', type: 'Целое число', value: '—' },
		],
	},
	{
		id: 'docsvision',
		label: 'Шлюз к Docsvision',
		icon: 'mdi-database-outline',
		nodes: [
			{ id: 'docsvision-monitoring', label: 'Мониторинг Docsvision', icon: LucideMonitorDot, shape: 'gateway' },
			{ id: 'docsvision-shortcut', label: 'Ярлык', icon: LucideFileSymlink },
			{ id: 'docsvision-ud-task', label: 'Задание УД', icon: LucideClipboardCheck },
			{ id: 'docsvision-ud-task-management', label: 'Управление заданием УД', icon: LucideClipboardPen },
			{ id: 'docsvision-parallel-task', label: 'Параллельное задание', icon: LucideColumns3 },
			{ id: 'docsvision-sequential-task', label: 'Последовательное задание', icon: LucideListOrdered },
		],
		variables: [
			{ id: 'group', label: 'Группа DV', type: 'Docsvision', value: '—' },
			{ id: 'process-variable-value', label: 'Значение переменной процесса DV', type: 'Docsvision', value: '—' },
			{ id: 'card', label: 'Карточка DV', type: 'Docsvision', value: '—' },
			{ id: 'folder', label: 'Папка DV', type: 'Docsvision', value: '—' },
			{ id: 'process-variable', label: 'Переменная процесса DV', type: 'Docsvision', value: '—' },
			{ id: 'enumeration', label: 'Перечисление DV', type: 'Docsvision', value: '—' },
			{ id: 'department', label: 'Подразделение DV', type: 'Docsvision', value: '—' },
			{ id: 'process', label: 'Процесс DV', type: 'Docsvision', value: '—' },
			{ id: 'role', label: 'Роль DV', type: 'Docsvision', value: '—' },
			{ id: 'card-section', label: 'Секция карточки DV', type: 'Docsvision', value: '—' },
			{ id: 'employee', label: 'Сотрудник DV', type: 'Docsvision', value: '—' },
			{ id: 'card-section-row', label: 'Строка секции карточки DV', type: 'Docsvision', value: '—' },
			{ id: 'card-type', label: 'Тип карточки DV', type: 'Docsvision', value: '—' },
			{ id: 'file', label: 'Файл DV', type: 'Docsvision', value: '—' },
			{ id: 'shortcut', label: 'Ярлык DV', type: 'Docsvision', value: '—' },
		],
	},
	{
		id: 'mail',
		label: 'Шлюз к почте',
		icon: 'mdi-email-outline',
		nodes: [
			{ id: 'mail-monitoring', label: 'Мониторинг сообщений', icon: LucideMailSearch, shape: 'gateway' },
			{ id: 'mail-ud-task-messages', label: 'Сообщения заданий УД', icon: LucideMailCheck },
		],
		variables: [
			{ id: 'attachment', label: 'Почтовое вложение', type: 'Почта', value: '—' },
			{ id: 'message', label: 'Почтовое сообщение', type: 'Почта', value: '—' },
			{ id: 'recipient', label: 'Почтовый адресат', type: 'Почта', value: '—' },
		],
	},
	{
		id: 'file-system',
		label: 'Шлюз к файловой системе',
		icon: 'mdi-folder-outline',
		nodes: [
			{ id: 'file-system-monitoring', label: 'Мониторинг файловой системы', icon: LucideFolderSearch, shape: 'gateway' },
		],
		variables: [
			{ id: 'folder', label: 'Папка ФС', type: 'Файловая система', value: '—' },
			{ id: 'file', label: 'Файл ФС', type: 'Файловая система', value: '—' },
		],
	},
]

export function getProcessGatewayNode(libraryType?: string) {
	return processGatewayCatalog.flatMap((gateway) => gateway.nodes ?? [])
		.find((node) => node.id === libraryType)
}

import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Role {
	selected: boolean
	id: string
	label: string
}

export interface Operation {
	selected: boolean
	id: string
	label: string
}

export interface State {
	selected: boolean
	id: string
	label: string
}

export const useMatrixStore = defineStore('matrix', () => {
	const roles = ref<Role[]>([
		{ selected: false, id: 'admin', label: 'Администратор' },
		{ selected: false, id: 'manager', label: 'Автор' },
		{ selected: false, id: 'executor', label: 'Исполнитель' },
		{ selected: false, id: 'observer', label: 'Наблюдатель' },
		{ selected: false, id: 'auditor', label: 'Аудитор' },
		{ selected: false, id: 'developer', label: 'Разработчик' },
		{ selected: false, id: 'analyst', label: 'Аналитик' },
		{ selected: false, id: 'guest', label: 'Гость' },
	])

	const states = ref<State[]>([
		{ selected: false, id: 'draft', label: 'Черновик' },
		{ selected: false, id: 'active', label: 'Активен' },
		{ selected: false, id: 'pending', label: 'Ожидание' },
		{ selected: false, id: 'approved', label: 'Согласован' },
		{ selected: false, id: 'rejected', label: 'Отклонен' },
		{ selected: false, id: 'completed', label: 'Завершен' },
		{ selected: false, id: 'archived', label: 'Архивирован' },
		{ selected: false, id: 'cancelled', label: 'Отменен' },
	])

	const operations = ref<Operation[]>([
		{ selected: false, id: 'create', label: 'Создание' },
		{ selected: false, id: 'read', label: 'Чтение' },
		{ selected: false, id: 'update', label: 'Обновление' },
		{ selected: false, id: 'delete', label: 'Удаление' },
		{ selected: false, id: 'approve', label: 'Согласование' },
		{ selected: false, id: 'reject', label: 'Отклонение' },
		{ selected: false, id: 'delegate', label: 'Делегирование' },
		{ selected: false, id: 'comment', label: 'Комментирование' },
		{ selected: false, id: 'export', label: 'Экспорт' },
		{ selected: false, id: 'import', label: 'Импорт' },
		{ selected: false, id: 'share', label: 'Поделиться' },
		{ selected: false, id: 'archive', label: 'Архивирование' },
	])

	// 3D array: [roleId][operationId][stateId] - values: undefined | true | false
	const accessMatrix = ref<Record<string, Record<string, Record<string, boolean | undefined>>>>({})

	function initAccessMatrix() {
		accessMatrix.value = {}
		roles.value.forEach((role) => {
			accessMatrix.value[role.id] = {}
			operations.value.forEach((operation) => {
				accessMatrix.value[role.id][operation.id] = {}
				states.value.forEach((state) => {
					accessMatrix.value[role.id][operation.id][state.id] = undefined
				})
			})
		})
	}

	function setAccess(
		roleId: string,
		operationId: string,
		stateId: string,
		value: boolean | undefined
	) {
		if (accessMatrix.value[roleId]?.[operationId] !== undefined) {
			accessMatrix.value[roleId][operationId][stateId] = value
		}
	}

	function getAccess(roleId: string, operationId: string, stateId: string): boolean | undefined {
		return accessMatrix.value[roleId]?.[operationId]?.[stateId]
	}

	function toggleAccess(roleId: string, operationId: string, stateId: string) {
		const current = getAccess(roleId, operationId, stateId)
		// Cycle: undefined -> true -> false -> undefined
		const next = current === undefined ? true : current === true ? false : undefined
		setAccess(roleId, operationId, stateId, next)
	}

	initAccessMatrix()

	return { roles, states, operations, accessMatrix, setAccess, getAccess, toggleAccess }
})

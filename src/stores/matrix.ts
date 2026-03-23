import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Role {
	selected: boolean
	id: string
	label: string
	common?: boolean
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
		{ selected: true, id: 'admin', label: 'Администратор', common: true },
		{ selected: false, id: 'manager', label: 'Автор', common: false },
		{ selected: false, id: 'executor', label: 'Исполнитель', common: false },
		{ selected: false, id: 'observer', label: 'Наблюдатель', common: false },
		{ selected: false, id: 'auditor', label: 'Аудитор', common: false },
		{ selected: false, id: 'developer', label: 'Разработчик', common: false },
		{ selected: false, id: 'analyst', label: 'Аналитик', common: false },
		{ selected: false, id: 'guest', label: 'Гость', common: true },
	])

	const states = ref<State[]>([
		{ selected: true, id: 'draft', label: 'Черновик' },
		{ selected: false, id: 'active', label: 'Активен' },
		{ selected: false, id: 'pending', label: 'Ожидание' },
		{ selected: false, id: 'approved', label: 'Согласован' },
		{ selected: false, id: 'rejected', label: 'Отклонен' },
		{ selected: false, id: 'completed', label: 'Завершен' },
		{ selected: false, id: 'archived', label: 'Архивирован' },
		{ selected: false, id: 'cancelled', label: 'Отменен' },
	])

	const operations = ref<Operation[]>([
		{ selected: true, id: 'create', label: 'Создание' },
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

	function addRole(role: { label: string; common?: boolean }) {
		const id = role.label.toLowerCase().replace(/\s+/g, '_')
		const newRole: Role = {
			selected: false,
			id,
			label: role.label,
			common: role.common ?? false,
		}
		roles.value.push(newRole)
		// Initialize access matrix for the new role
		accessMatrix.value[id] = {}
		operations.value.forEach((operation) => {
			accessMatrix.value[id][operation.id] = {}
			states.value.forEach((state) => {
				accessMatrix.value[id][operation.id][state.id] = undefined
			})
		})
	}

	function removeRole(roleId: string) {
		const index = roles.value.findIndex((r) => r.id === roleId)
		if (index !== -1) {
			roles.value.splice(index, 1)
			delete accessMatrix.value[roleId]
		}
	}

	function updateRoleLabel(roleId: string, label: string) {
		const role = roles.value.find((r) => r.id === roleId)
		if (role) {
			role.label = label
		}
	}

	function updateRoleCommon(roleId: string, common: boolean) {
		const role = roles.value.find((r) => r.id === roleId)
		if (role) {
			role.common = common
		}
	}

	function getNameById(id: string): string {
		if (id === '102') return 'Конструктор ролей'
		const role = roles.value.find((r) => r.id === id)
		if (role) return role.label
		const operation = operations.value.find((o) => o.id === id)
		if (operation) return operation.label
		const state = states.value.find((s) => s.id === id)
		if (state) return state.label
		return id
	}

	initAccessMatrix()

	return {
		roles,
		states,
		operations,
		accessMatrix,
		setAccess,
		getAccess,
		toggleAccess,
		addRole,
		removeRole,
		updateRoleLabel,
		updateRoleCommon,
		getNameById,
	}
})

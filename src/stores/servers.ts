import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useServers = defineStore('servers', () => {
	const servers = ref([
		{
			id: '0',
			nick: 'DV-test',
			prod: false,
			expand: false,
			vis: true,
			def: true,
			list: [
				{ id: 1, label: 'Версия 2.1', current: true },
				{ id: 0, label: 'Версия 1', current: false },
			],
		},
		{
			id: '2',
			nick: 'STG-alpha',
			prod: false,
			expand: false,
			vis: true,
			def: false,
			list: [
				{ id: 2, label: 'Версия 3.4', current: true },
				{ id: 1, label: 'Версия 2.6', current: false },
				{ id: 0, label: 'Версия 1.3', current: false },
			],
		},
		{
			id: '3',
			nick: 'STG-beta',
			prod: false,
			expand: false,
			vis: false,
			def: false,
			list: [
				{ id: 1, label: 'Версия 2.1', current: true },
				{ id: 0, label: 'Версия 1.2', current: false },
			],
		},
		{
			id: '6',
			nick: 'Pre-prod',
			prod: false,
			expand: false,
			vis: false,
			def: false,
			list: [
				{ id: 2, label: 'Версия 3.1', current: true },
				{ id: 1, label: 'Версия 2.1', current: false },
			],
		},
		{
			id: '7',
			nick: 'Archive-1',
			prod: false,
			expand: false,
			vis: false,
			def: false,
			list: [{ id: 0, label: 'Версия 1', current: true }],
		},
		{
			id: '8',
			nick: 'Legacy-node',
			prod: false,
			expand: false,
			vis: false,
			def: false,
			list: [
				{ id: 2, label: 'Версия 3.2', current: false },
				{ id: 1, label: 'Версия 2.4', current: true },
			],
		},
		{
			id: '1',
			nick: 'DV-prod',
			prod: true,
			expand: false,
			vis: false,
			def: false,
			list: [{ id: 0, label: 'Версия 1.3', current: true }],
		},
		{
			id: '4',
			nick: 'DEV-main',
			prod: true,
			expand: false,
			vis: false,
			def: false,
			list: [{ id: 0, label: 'Версия 1.3', current: true }],
		},
		{
			id: '5',
			nick: 'QA-server',
			prod: true,
			expand: false,
			vis: false,
			def: false,
			list: [
				{ id: 1, label: 'Версия 2.1', current: true },
				{ id: 0, label: 'Версия 1', current: false },
			],
		},
	])

	const visibleServers = computed(() => {
		return servers.value.filter((item) => item.vis)
	})

	const testservers = computed(() => {
		return servers.value.filter((item) => !item.prod)
	})

	const prodservers = computed(() => {
		return servers.value.filter((item) => item.prod)
	})

	const setItems = (items: any) => {
		servers.value = items
	}

	const selectAll = () => {
		servers.value.map((el) => (el.vis = true))
	}

	return {
		servers,
		visibleServers,
		def: false,
		testservers,
		prodservers,
		setItems,
		selectAll,
	}
})

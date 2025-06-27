import { ref } from 'vue'

const servers = ref([
	{
		id: '0',
		nick: 'DV-test',
		prod: false,
		expand: false,
		list: [
			{ id: 1, label: 'Версия 2', current: true },
			{ id: 0, label: 'Версия 1', current: false },
		],
	},
	{
		id: '1',
		nick: 'DV-prod',
		prod: true,
		expand: false,
		list: [{ id: 0, label: 'Версия 1', current: true }],
	},
	{
		id: '2',
		nick: 'STG-alpha',
		prod: false,
		expand: false,
		list: [
			{ id: 2, label: 'Версия 3', current: true },
			{ id: 1, label: 'Версия 2', current: false },
			{ id: 0, label: 'Версия 1', current: false },
		],
	},
	{
		id: '3',
		nick: 'STG-beta',
		prod: false,
		expand: false,
		list: [
			{ id: 1, label: 'Версия 2', current: true },
			{ id: 0, label: 'Версия 1', current: false },
		],
	},
	{
		id: '4',
		nick: 'DEV-main',
		prod: true,
		expand: false,
		list: [{ id: 0, label: 'Версия 1', current: true }],
	},
	{
		id: '5',
		nick: 'QA-server',
		prod: true,
		expand: false,
		list: [
			{ id: 1, label: 'Версия 2', current: true },
			{ id: 0, label: 'Версия 1', current: false },
		],
	},
	// {
	// 	id: '6',
	// 	nick: 'Pre-prod',
	// 	prod: false,
	// 	expand: false,
	// 	list: [
	// 		{ id: 2, label: 'Версия 3', current: true },
	// 		{ id: 1, label: 'Версия 2', current: false },
	// 	],
	// },
	// {
	// 	id: '7',
	// 	nick: 'Archive-1',
	// 	prod: false,
	// 	expand: false,
	// 	list: [{ id: 0, label: 'Версия 1', current: true }],
	// },
	// {
	// 	id: '8',
	// 	nick: 'Legacy-node',
	// 	prod: false,
	// 	expand: false,
	// 	list: [
	// 		{ id: 2, label: 'Версия 3', current: false },
	// 		{ id: 1, label: 'Версия 2', current: true },
	// 	],
	// },
])

export { servers }

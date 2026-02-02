const myApps = [
	{
		id: '0',
		text: 'Решения',
		descr: '',
		hidden: false,
		type: 0,
		selected: false,
		children: [
			{
				id: '1',
				text: 'Docsvision',
				hidden: false,
				selected: false,
				type: 0,
				children: [
					{
						id: 'otpusk',
						text: 'Оформление отпуска',
						hidden: false,
						selected: false,
					},
					{
						id: 'com',
						text: 'Командировки',
						hidden: false,
						selected: false,
					},
					{
						id: 'com',
						text: 'Мое решение',
						hidden: false,
						selected: false,
					},
				],
			},
			{
				id: '2',
				text: 'DigitalDesign',
				hidden: false,
				selected: false,
				type: 0,
				children: [],
			},
			{
				id: '3',
				text: 'Партнеры',
				hidden: false,
				selected: false,
				type: 0,
				children: [],
			},
		],
	},
]

export { myApps }

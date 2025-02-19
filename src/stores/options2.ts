import { uid } from 'quasar'
import { Kind } from '@/types/enum'
import { manDetails, str, datee, stat, execute } from '@/stores/conditions'

const zero = [
	{
		id: uid(),
		text: 'Автор',
		kind: Kind.Man,
		type: 1,
		level: 0,
		selected: false,
		children: manDetails,
	},
	{
		id: uid(),
		text: 'Название',
		kind: Kind.String,
		type: 1,
		level: 0,
		selected: false,
		children: str,
	},
	{
		id: uid(),
		text: 'Описание',
		kind: Kind.Text,
		type: 1,
		level: 0,
		selected: false,
		children: str,
	},
	{
		id: uid(),
		text: 'Дата начала отпуска',
		kind: Kind.Date,
		type: 1,
		level: 0,
		selected: false,
		children: datee,
	},
	{
		id: uid(),
		text: 'Дата окончания отпуска',
		kind: Kind.Date,
		type: 1,
		level: 0,
		selected: false,
		children: datee,
	},
	{
		id: uid(),
		text: 'Комментарий',
		kind: Kind.Text,
		type: 1,
		level: 0,
		selected: false,
		children: str,
	},
	{
		id: uid(),
		text: 'Статус',
		kind: Kind.Status,
		type: 1,
		level: 1,
		selected: false,
		children: stat,
	},
	{
		id: uid(),
		text: 'Исполнение',
		kind: Kind.Text,
		type: 1,
		level: 1,
		selected: false,
		children: execute,
	},

]

export { zero }

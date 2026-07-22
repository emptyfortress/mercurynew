import { ref } from 'vue'

export const approveData = ref([
	{
		id: 'dogovor',
		text: 'Договоры',
		text1: '',
		selected: false,
		hidden: false,
		type: 0,
		author: 'System',
		fields: [],
		children: [
			{
				id:'dogovor-1',text:'Согласование договора поставки',text1:'',selected:false,hidden:false,type:1,author:'System',fields:[],children:[
					{id:'dogovor-1-1',text:'Проверка юридическим отделом',text1:'',selected:false,hidden:false,type:2,author:'System',fields:[],children:[]},
					{id:'dogovor-1-2',text:'Согласование финансовым отделом',text1:'',selected:false,hidden:false,type:2,author:'System',fields:[],children:[]},
					{id:'dogovor-1-3',text:'Утверждение руководителем',text1:'',selected:false,hidden:false,type:2,author:'System',fields:[],children:[]},
				]},
			{
				id:'dogovor-2',text:'Согласование договора аренды',text1:'',selected:false,hidden:false,type:1,author:'System',fields:[],children:[
					{id:'dogovor-2-1',text:'Проверка условий аренды',text1:'',selected:false,hidden:false,type:2,author:'System',fields:[],children:[]},
					{id:'dogovor-2-2',text:'Согласование с бухгалтерией',text1:'',selected:false,hidden:false,type:2,author:'System',fields:[],children:[]},
				]},
			{
				id:'dogovor-3',text:'Согласование дополнительного соглашения',text1:'',selected:false,hidden:false,type:1,author:'System',fields:[],children:[
					{id:'dogovor-3-1',text:'Проверка изменений',text1:'',selected:false,hidden:false,type:2,author:'System',fields:[],children:[]},
					{id:'dogovor-3-2',text:'Юридическое согласование',text1:'',selected:false,hidden:false,type:2,author:'System',fields:[],children:[]},
					{id:'dogovor-3-3',text:'Подписание руководителем',text1:'',selected:false,hidden:false,type:2,author:'System',fields:[],children:[]},
				]},
			{
				id:'dogovor-4',text:'Согласование договора подряда',text1:'',selected:false,hidden:false,type:1,author:'System',fields:[],children:[
					{id:'dogovor-4-1',text:'Проверка технического задания',text1:'',selected:false,hidden:false,type:2,author:'System',fields:[],children:[]},
					{id:'dogovor-4-2',text:'Согласование бюджета',text1:'',selected:false,hidden:false,type:2,author:'System',fields:[],children:[]},
				]},
		]},
	{
		id:'sluj',text:'Служебки',text1:'',selected:false,hidden:false,type:0,author:'System',fields:[],children:[
			{id:'sluj-1',text:'Согласование служебной записки на закупку',text1:'',selected:false,hidden:false,type:1,author:'System',fields:[],children:[
				{id:'sluj-1-1',text:'Проверка потребности',text1:'',selected:false,hidden:false,type:2,author:'System',fields:[],children:[]},
				{id:'sluj-1-2',text:'Согласование бюджета',text1:'',selected:false,hidden:false,type:2,author:'System',fields:[],children:[]},
			]},
			{id:'sluj-2',text:'Согласование служебной записки на командировку',text1:'',selected:false,hidden:false,type:1,author:'System',fields:[],children:[
				{id:'sluj-2-1',text:'Согласование руководителем',text1:'',selected:false,hidden:false,type:2,author:'System',fields:[],children:[]},
				{id:'sluj-2-2',text:'Проверка кадровой службой',text1:'',selected:false,hidden:false,type:2,author:'System',fields:[],children:[]},
				{id:'sluj-2-3',text:'Подтверждение бухгалтерией',text1:'',selected:false,hidden:false,type:2,author:'System',fields:[],children:[]},
			]},
			{id:'sluj-3',text:'Согласование служебной записки на премирование',text1:'',selected:false,hidden:false,type:1,author:'System',fields:[],children:[
				{id:'sluj-3-1',text:'Проверка KPI',text1:'',selected:false,hidden:false,type:2,author:'System',fields:[],children:[]},
				{id:'sluj-3-2',text:'Утверждение директором',text1:'',selected:false,hidden:false,type:2,author:'System',fields:[],children:[]},
			]},
		]},
	{
		id:'ord',text:'ОРД',text1:'',selected:false,hidden:false,type:0,author:'System',fields:[],children:[
			{id:'ord-1',text:'Согласование приказа',text1:'',selected:false,hidden:false,type:1,author:'System',fields:[],children:[
				{id:'ord-1-1',text:'Юридическая проверка',text1:'',selected:false,hidden:false,type:2,author:'System',fields:[],children:[]},
				{id:'ord-1-2',text:'Подписание руководителем',text1:'',selected:false,hidden:false,type:2,author:'System',fields:[],children:[]},
			]},
			{id:'ord-2',text:'Согласование распоряжения',text1:'',selected:false,hidden:false,type:1,author:'System',fields:[],children:[
				{id:'ord-2-1',text:'Проверка исполнителей',text1:'',selected:false,hidden:false,type:2,author:'System',fields:[],children:[]},
				{id:'ord-2-2',text:'Утверждение',text1:'',selected:false,hidden:false,type:2,author:'System',fields:[],children:[]},
			]},
			{id:'ord-3',text:'Согласование положения',text1:'',selected:false,hidden:false,type:1,author:'System',fields:[],children:[
				{id:'ord-3-1',text:'Экспертиза документа',text1:'',selected:false,hidden:false,type:2,author:'System',fields:[],children:[]},
				{id:'ord-3-2',text:'Утверждение',text1:'',selected:false,hidden:false,type:2,author:'System',fields:[],children:[]},
			]},
			{id:'ord-4',text:'Согласование регламента',text1:'',selected:false,hidden:false,type:1,author:'System',fields:[],children:[
				{id:'ord-4-1',text:'Согласование подразделениями',text1:'',selected:false,hidden:false,type:2,author:'System',fields:[],children:[]},
				{id:'ord-4-2',text:'Финальное утверждение',text1:'',selected:false,hidden:false,type:2,author:'System',fields:[],children:[]},
			]},
		]},
])

import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
// import { uid } from 'quasar'

export const useForms = defineStore('forms', () => {
	const index = ref(0)

	const currentBO = ref<any>()
	const setCurrentBO = (e: any) => {
		currentBO.value = e
	}

	const currentEtap = computed(() => {
		if (
			currentBO.value?.$type == 'bpmn:Task' ||
			currentBO.value?.$type == 'bpmn:StartEvent' ||
			currentBO.value?.$type == 'bpmn:EndEvent'
		) {
			return currentBO.value.name
		}
		return null
	})

	// это кнопки на форме сверху ***********************
	const notMain = ref(false)
	const desc = ref('Это сопроводительный текст-описание')
	// const setDesc = (s: string) => {
	// 	des
	// 	// description.value = s
	// }
	const bt = computed(() => {
		if (!!currentBO.value) {
			let mybt = currentBO.value.outgoing?.filter((item: any) => {
				return item.name !== undefined
			})
			if (notMain.value == true) return []
			if (!!mybt && mybt.length > 0) return mybt
			else if (
				!!mybt &&
				mybt.length == 0 &&
				currentBO.value.outgoing[0]?.targetRef.$type == 'bpmn:ExclusiveGateway'
			) {
				let alsobt = currentBO.value.outgoing[0]?.targetRef.outgoing.filter((item: any) => {
					return item.name !== undefined
				})
				return alsobt
			} else if (!!mybt && mybt.length == 0) return []
			else return []
		} else return []
	})


	const finish = ref(['Подготовка'])


	const newform = ref(false)
	const showBt = computed(() => {
		return bt.value.length > 0 ? true : false
	})

	const formList = ref<Form[]>([])

	const conditionList = ref<Condition[]>([])

	const addCondition = (e: Condition) => {
		conditionList.value.push(e)
	}

	const removeCondition = (e: Form) => {
		// let n = formList.value.findIndex((item) => {
		let n = conditionList.value.findIndex((item: any) => {
			return item.id == e.id
		})
		conditionList.value.splice(n, 1)
	}

	const createForm = (form: Form) => {
		let row = {
			id: form.id,
			label: form.label,
			value: form.value,
			desc: form.desc || 'Это описание формы',
			selected: false,
			type: form.type,
			layout: form.layout
		}
		formList.value.push(row)
	}

	const removeForm = (e: string) => {
		const ind = formList.value.findIndex((el: Form) => el.label == e)
		if (ind !== undefined) formList.value.splice(ind, 1)
	}

	const status = ref(['Подготовка'])

	const addStatus = ((e: string) => {
		status.value.push(e)
	})

	const removeStatus = ((n: number) => {
		status.value.splice(n, 1)
	})

	return {
		index,
		currentBO,
		currentEtap,
		setCurrentBO,

		formList,
		conditionList,
		addCondition,
		removeCondition,

		bt,
		showBt,
		notMain,
		newform,
		desc,
		createForm,
		removeForm,

		status,
		finish,
		addStatus,
		removeStatus,

		// tempBO,
		// setTempBO,
	}
})

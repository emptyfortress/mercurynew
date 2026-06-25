<script setup lang="ts">
import { ref } from 'vue'
import { uid } from 'quasar'
import { useSimpleStore } from '@/stores/simpleStore'

const props = defineProps({
	mode: {
		type: String,
		default: 'app',
	},
	mode1: {
		type: Boolean,
		default: false,
	},
})
const modelValue = defineModel<boolean>()

const simpleStore = useSimpleStore()

const close = () => {
	modelValue.value = false
}

const emit = defineEmits(['create'])

const create = (data: any) => {
	if (props.mode == 'app') {
		data.text = data.name
		data.type = 1
		data.version = '0.0.0'
		emit('create', data)
		close()
	}
	if (props.mode == 'role') {
		data.selected = false
		close()
	}
	if (props.mode == 'form') {
		let tmp = {
			label: data.name,
			value: data.name,
			desc: data.descr,
			selected: false,
			type: 1,
			layout: {
				x: 1,
				y: 0,
				w: 10,
				h: 5,
				i: 0,
				selected: false,
				fieldList: [],
			},
		}
		close()
	}
	if (props.mode == 'status') {
		close()
	}
	if (props.mode == 'folder') {
		const folderData = {
			name: data.name,
			isVirtual: data.isVirtual ?? false,
		}
		emit('create', folderData)
		close()
	}
	if (props.mode == 'vid') {
		const cardData = {
			name: data.name,
			isVirtual: data.isVirtual ?? false,
		}
		emit('create', cardData)
		close()
	}

	if (props.mode == 'poisk' && !props.mode1) {
		const newFolder = {
			name: data.name,
			type: 1,
		}
		emit('create', newFolder)
		close()
	}
	if (props.mode == 'poisk' && props.mode1) {
		const newFolder = {
			name: data.name,
			type: 0,
		}
		emit('create', newFolder)
		close()
	}
}
</script>

<template lang="pug">
q-dialog(v-model="modelValue")
	q-card(style="min-width: 400px;")
		q-btn.close(round color="negative" icon="mdi-close" v-close-popup)
		q-card-section
			.text-h6(v-if="props.mode == 'app'") Новое приложение
			.text-h6(v-if="props.mode == 'role'") Создать роль 
			.text-h6(v-if="props.mode == 'list'") Создать список
			.text-h6(v-if="props.mode == 'form'") Создать форму
			.text-h6(v-if="props.mode == 'status'") Новый статус
			.text-h6(v-if="props.mode == 'vid'") Создать новую карточку
			.text-h6(v-if="props.mode == 'folder'") Создать папку
			.text-h6(v-if="props.mode == 'poisk' && props.mode1") Создать папку
			.text-h6(v-if="props.mode == 'poisk' && !props.mode1") Создать запрос

		q-card-section
			FormKit(type="form" id="newapp" submit-label="Создать" @submit="create")
				FormKit(v-if='props.mode == "app"'  type="text" autofocus name="name" label="Название" value='Мое приложение' help="Назовите ваше приложение" validation="required|length:3")
				FormKit(v-if='props.mode == "app"' type="textarea" name="descr" label="Описание" help="Что будет делать ваше приложение?")

				FormKit(v-if='props.mode == "vid"'  type="text" autofocus name="name" label="Название" value='Новый вид' help="Назовите вид" validation="required|length:3")
				FormKit(v-if='props.mode == "vid"' type="textarea" name="descr" label="Описание" help="Назначение вида и его особенности")

				FormKit(v-if='props.mode == "list"' type="text" autofocus name="name" label="Название" validation="required|length:3")
				FormKit(v-if='props.mode == "list"' type="textarea" name="descr" label="Описание")

				FormKit(v-if='props.mode == "role"' type="text" autofocus name="name" label="Название" validation="required|length:3")
				FormKit(v-if='props.mode == "role"' type="textarea" name="descr" label="Описание")

				FormKit(v-if='props.mode == "form"' type="text" autofocus name="name" label="Название" validation="required|length:3")
				FormKit(v-if='props.mode == "form"' type="textarea" name="descr" label="Описание")
				FormKit(v-if='props.mode == "form"' type="checkbox" name="creation" label="Форма создания")

				FormKit(v-if='props.mode == "status"'  type="text" autofocus name="name" label="Название"  help="Назовите статус" validation="required|length:3")
				FormKit(v-if='props.mode == "folder"' type="text" autofocus name="name" label="Название" validation="required|length:3")
				FormKit(v-if='props.mode == "folder"' type="checkbox" name="isVirtual" label="Виртуальная папка")

				FormKit(v-if='props.mode == "poisk"'  type="text" autofocus name="name" label="Название" validation="required|length:3")
</template>

<style scoped lang="scss"></style>

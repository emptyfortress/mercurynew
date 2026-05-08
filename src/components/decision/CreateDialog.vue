<script setup lang="ts">
import { ref } from 'vue'
import { uid } from 'quasar'

const props = defineProps({
	mode: {
		type: String,
		default: 'app',
	},
})
const modelValue = defineModel<boolean>()

const close = () => {
	modelValue.value = false
}

const emit = defineEmits(['create'])

const create = (data: any) => {
	if (props.mode == 'app') {
		data.id = +new Date()
		data.text = data.name
		data.type = 1
		data.version = '0.0.0'
		emit('create', data)
		close()
	}
	if (props.mode == 'role') {
		data.id = uid()
		data.selected = false
		close()
	}
	if (props.mode == 'form') {
		let tmp = {
			id: uid(),
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
			id: uid(),
			name: data.name,
			isVirtual: data.isVirtual,
		}
		emit('create', folderData)
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
</template>

<style scoped lang="scss"></style>

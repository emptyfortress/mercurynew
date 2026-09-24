<script setup lang="ts">
import { ref, watch } from 'vue'
// import { uid } from 'quasar'
import { useSimpleStore } from '@/stores/simpleStore'
import NameTranslationsField from '@/components/decision/NameTranslationsField.vue'
import type { NameTranslations } from '@/constants/locales'
import { translationLocales } from '@/constants/locales'

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
const nameTranslations = ref<NameTranslations>({})
const showFolderTranslations = ref(false)
const folderName = ref('')
const isVirtualFolder = ref(false)
watch(modelValue, (isOpen) => {
	if (isOpen) {
		nameTranslations.value = {}
		showFolderTranslations.value = false
		folderName.value = ''
		isVirtualFolder.value = false
	}
})

const close = () => {
	modelValue.value = false
}

const emit = defineEmits(['create'])

const create = (data: any) => {
	if (['folder', 'poisk', 'view'].includes(props.mode)) {
		data.nameTranslations = { ...nameTranslations.value }
	}
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
			nameTranslations: data.nameTranslations,
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
			nameTranslations: data.nameTranslations,
			type: 1,
		}
		emit('create', newFolder)
		close()
	}
	if (props.mode == 'poisk' && props.mode1) {
		const newFolder = {
			name: data.name,
			nameTranslations: data.nameTranslations,
			type: 0,
		}
		emit('create', newFolder)
		close()
	}
	if (props.mode == 'view' && !props.mode1) {
		const newFolder = {
			name: data.name,
			nameTranslations: data.nameTranslations,
			type: 1,
		}
		emit('create', newFolder)
		close()
	}
	if (props.mode == 'view' && props.mode1) {
		const newFolder = {
			name: data.name,
			nameTranslations: data.nameTranslations,
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
			.text-h6(v-if="props.mode == 'view' && props.mode1") Создать папку
			.text-h6(v-if="props.mode == 'view' && !props.mode1") Создать представление

		q-card-section
			FormKit(v-if='props.mode != "folder" && !(props.mode == "poisk" && props.mode1)' type="form" id="newapp" submit-label="Создать" @submit="create")
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
				FormKit(v-if='props.mode == "poisk" && !props.mode1' type="text" autofocus name="name" label="Название" validation="required|length:3")
				NameTranslationsField(v-if='props.mode == "poisk" && !props.mode1' v-model="nameTranslations")

				FormKit(v-if='props.mode == "view"'  type="text" autofocus name="name" label="Название" validation="required|length:3")
				NameTranslationsField(v-if='props.mode == "view"' v-model="nameTranslations")

			q-form(v-if='props.mode == "folder" || (props.mode == "poisk" && props.mode1)' @submit.prevent="create({ name: folderName, isVirtual: isVirtualFolder })")
				q-input(
					v-model="folderName"
					label="Название"
					autofocus
					outlined
					dense
					:rules="[val => !!val || 'Это обязательное поле', val => (val ?? '').trim().length >= 3 || 'Минимум 3 символа']"
				)
					template(v-slot:append)
						q-btn(flat round dense icon="mdi-translate" color="secondary" type="button" aria-label="Переводы названия" @click="showFolderTranslations = !showFolderTranslations")
							q-tooltip Переводы названия
				.q-pl-sm.q-mt-md(v-if="showFolderTranslations")
					.text-caption.q-mb-xs Локализации
					q-input(
						v-for="locale in translationLocales"
						:key="locale.code"
						v-model="nameTranslations[locale.code]"
						:label="locale.label"
						outlined
						dense
						class="q-mb-sm"
					)
				q-checkbox(v-if='props.mode == "folder"' v-model="isVirtualFolder" label="Виртуальная папка")
				q-card-actions(align="right")
					q-btn(flat color="primary" label="Отмена" @click="close")
					q-btn(unelevated color="primary" label="Создать" type="submit")
</template>

<style scoped lang="scss"></style>

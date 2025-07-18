<script setup lang="ts">
import { ref } from 'vue'
import MySelect from '@/components/common/MySelect.vue'
import { useServers } from '@/stores/servers'

const props = defineProps({
	mode: {
		type: String,
		required: true,
		default: '',
	},
})
const modelValue = defineModel<boolean>()

const server = useServers()
const emit = defineEmits(['remove', 'publish', 'check'])

const remove = () => {
	emit('remove')
	modelValue.value = false
}
const serv = ref('1')

const user = ref('')

const loading = ref(false)

const publish = () => {
	loading.value = true
	setTimeout(() => {
		loading.value = false
		modelValue.value = false
	}, 2000)
	emit('publish', parseInt(serv.value))
}

const check = () => {
	loading.value = true
	setTimeout(() => {
		loading.value = false
		modelValue.value = false
	}, 2000)
	emit('check')
}
</script>

<template lang="pug">
q-dialog(v-model="modelValue" backdrop-filter="blur(4px) saturate(150%)")
	q-card
		q-btn.close(icon="mdi-close" color="negative" round dense v-close-popup)
		q-card-section.row.items-center.q-pb-none
			.text-h6(v-if='props.mode == "version"') Приложение опубликовано
			.text-h6(v-if='props.mode == "version1"') Ожидает публикации
			.text-h6(v-if='props.mode == "publ"') Публикация приложения
			.text-h6(v-if='props.mode == "editors"') Редакторы приложения
			.text-h6(v-if='props.mode == "check"') Проверка приложения
			.text-h6(v-if='props.mode == "edit"') Просмотр приложения

		q-card-section
			div(v-if='props.mode == "edit"')
				div Приложение опубликовано и будет открыто в режиме просмотра.
				div Для внесения изменений создайте новую версию и опубликуйте ее.

			div(v-if='props.mode == "check"')
				div Для проверки версия приложения будет загружена на тестовый сервер. Это займет некоторое время.
				div Сейчас вы будете перенаправлены на тестовую страницу.

			div(v-if='props.mode == "editors"')
				div Выберите, кто может редактировать и публиковать приложение.
				q-list(dense).q-mt-md
					q-item(clickable v-for="item in server.editors" :key='item.id')
						q-item-section(side)
							q-icon(name="mdi-account-circle" color="primary")
						q-item-section
							q-item-label {{ item.name }}
						q-item-section(side)
							span(v-if='item.author') Автор
							q-btn(v-else flat round dense icon="mdi-close" color="secondary"  size="sm") 

				.add
					MySelect(v-model="user" prepend)
					q-btn(flat round dense color="primary" icon='mdi-plus-circle-outline') 

			div(v-if='props.mode == "publ"' style="width: 400px;")
				div Выберите сервер для публикации:
				.column
					q-list
						q-item(tag='label' clickable dense)
							q-item-section(side)
								q-radio(v-model="serv" val="2")
							q-item-section DV-test
							q-item-section(side) тестовый сервер

						q-item(tag='label' clickable dense)
							q-item-section(side)
								q-radio(v-model="serv" val="1")
							q-item-section DV-prod
							q-item-section(side) продуктовый сервер

				.info
					q-icon(name="mdi-hand-pointing-right" color="negative" size="20px")
					span(v-if='serv == "2"') Приложение будет опубликовано немедленно.
					span(v-if='serv == "1"') Приложение будет передано админу для публикации.

			ul(v-if='props.mode == "version"')
				li Приложение (версия) опубликовано на сервере DV-prod и не может быть удалено.
			ul(v-if='props.mode == "version1"')
				li Приложение (версия) ожидает публикации и не может быть удалено.

			// ul(v-else)
			// 	li Удаление группы одновременно удалит все приложения, входящие в данную группу.
			// 	li Данное действие нельзя отменить.

		q-card-actions(align="right")
			q-btn(flat color="primary" label="Отмена" v-close-popup) 
			q-btn(v-if='props.mode == "edit"' unelevated color="primary" label="Открыть на просмотр" @click='$router.push("/process")') 
			q-btn(v-if='props.mode == "check"' unelevated color="primary" :loading='loading' label="Продолжить" @click='check') 
			q-btn(v-if='props.mode == "publ"' unelevated color="primary" :loading='loading' label="Опубликовать" @click='publish') 
			q-btn(v-if='props.mode == "editors"' unelevated color="primary" label="Применить" v-close-popup) 
</template>

<style scoped lang="scss">
ul,
li {
	list-style: none;
	margin-left: 0;
	padding-left: 0;
}
.info {
	margin-top: 0.5rem;
	// background: var(--dvblue);
	// background: #eee;
	padding: 0.5rem;
	// color: var(--dark);
	font-size: 0.8rem;
	color: $negative;
	// border: 1px solid var(--dark);
	display: flex;
	gap: 0.5rem;
	align-items: center;
}
.add {
	display: flex;
	justify-content: start;
	align-items: center;
	gap: 0.5rem;
	margin-top: 1rem;
	margin-left: 1rem;
	:deep(.q-field--dense) {
		width: 250px;
	}
}
</style>

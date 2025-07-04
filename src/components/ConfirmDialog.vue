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
const emit = defineEmits(['remove'])

const remove = () => {
	emit('remove')
	modelValue.value = false
}
const serv = ref('1')

const user = ref('')
</script>

<template lang="pug">
q-dialog(v-model="modelValue" backdrop-filter="blur(4px) saturate(150%)")
	q-card
		q-btn.close(icon="mdi-close" color="negative" round dense v-close-popup)
		q-card-section.row.items-center.q-pb-none
			.text-h6(v-if='props.mode == "version"') Приложение опубликовано
			.text-h6(v-if='props.mode == "publ"') Опубликовать приложение
			.text-h6(v-if='props.mode == "editors"') Редакторы приложения
			// .text-h6(v-else) Вы уверены?

		q-card-section
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

			div(v-if='props.mode == "publ"')
				div Выберите сервер для публикации:
				.column
					q-radio(v-model="serv" val="1" label="DV-test (тестовый)")
					q-radio(v-model="serv" val="2" label="DV-test1 (предбовевой)")
					q-radio(v-model="serv" val="3" label="DV-prod (production)")

			ul(v-if='props.mode == "version"')
				li Приложение опубликовано на сервере DV-prod и не может быть удалено.

			// ul(v-else)
			// 	li Удаление группы одновременно удалит все приложения, входящие в данную группу.
			// 	li Данное действие нельзя отменить.

		q-card-actions(align="right")
			q-btn(flat color="primary" label="Отмена" v-close-popup) 
			q-btn(v-if='props.mode == "publ"' unelevated color="primary" label="Опубликовать" v-close-popup) 
			q-btn(v-if='props.mode == "editors"' unelevated color="primary" label="Применить" v-close-popup) 
</template>

<style scoped lang="scss">
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

<script setup lang="ts">
import { ref, watch, computed } from 'vue'

const modelValue = defineModel<boolean>() // отвечает за открытие/закрытие
const multiuser = defineModel<boolean>('multiuser', { default: false }) // связь с родителем

const localMultiuser = ref(false) // локальное значение
const options = [
	{
		id: 0,
		label: 'Роза Львовна',
		abbrev: 'РЛ',
		color: 'positive',
	},
	{
		id: 1,
		label: 'Сирень Крокодиловна',
		abbrev: 'СК',
		color: 'warning',
	},
	{
		id: 2,
		label: 'Лотос Тигрович',
		abbrev: 'ЛТ',
		color: 'negative',
	},
]

const dostup = ref<any>(null)

const confirm = () => {
	multiuser.value = localMultiuser.value
}

const users = ref<any>([])

const addUser = () => {
	users.value.push({
		id: +Date.now(),
		label: dostup.value.label,
		abbrev: dostup.value.abbrev,
		color: dostup.value.color,
	})
	dostup.value = null
	localMultiuser.value = true
}

const remove = (ind: number) => {
	users.value.splice(ind, 1)
	if (users.value.length == 0) localMultiuser.value = false
}
</script>

<template lang="pug">
q-dialog(v-model="modelValue")
	q-card(style="width: 420px;")
		q-btn.close(round color="negative" icon="mdi-close" v-close-popup)
		q-card-section
			.text-h6 Доступ к приложению
			.q-mt-md Пользователи, имеющие право редактирования:
			br
			q-list(bordered separator)
				q-item(clickable)
					q-item-section(side)
						q-icon(name="mdi-account-circle" color="primary" size='md')
					q-item-section Администратор
					q-item-section(side)
						.caption Системная роль

				q-item(clickable)
					q-item-section(side)
						q-avatar(size='md')
							img(src="https://cdn.quasar.dev/img/avatar.png")
					q-item-section Орлов П.С.
					q-item-section(side)
						.caption Вы (автор)

				q-item(clickable v-for="(user, index) in users" :key='user.id')
					q-item-section(side)
						q-avatar(size='28px' :color="user.color" text-color="white") {{ user.abbrev}}
					q-item-section
						div {{ user.label}}
					q-item-section(side)
						q-icon(name="mdi-close-circle" color="grey" size="sm" @click='remove(index)')

			.text-bold.q-mt-md Добавить
			q-select(outlined dense v-model="dostup" :options='options' label="Пользователь")
				template(v-slot:prepend v-if='dostup')
					q-icon(name="mdi-account-circle" color="primary")
				template(v-slot:after)
					q-btn(flat round color="primary" icon='mdi-plus-circle' @click="addUser" size="18px" dense) 

		q-card-actions.q-mx-md(align='right')
			q-btn(flat color="primary" label="Отмена" v-close-popup) 
			q-btn(unelevated color="primary" label="Готово" @click="confirm" v-close-popup) 
</template>

<style scoped lang="scss">
.hint {
	margin-top: 1rem;
	font-size: 0.8rem;
	line-height: 1.2;
	background: #eee;
	padding: 0.5rem;
	text-align: center;
}
.caption {
	font-size: 0.7rem;
	color: #666;
}
</style>

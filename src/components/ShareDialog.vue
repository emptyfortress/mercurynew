<script setup lang="ts">
import { ref, watch, computed } from 'vue'

const modelValue = defineModel<boolean>() // отвечает за открытие/закрытие
const multiuser = defineModel<boolean>('multiuser', { default: false }) // связь с родителем

const localMultiuser = ref(false) // локальное значение
const options = ['Доступ ограничен', 'Все, у кого есть ссылка']

// computed для удобного биндинга к селекту
const dostup = computed({
	get: () => (localMultiuser.value ? 'Все, у кого есть ссылка' : 'Доступ ограничен'),
	set: (val: string) => {
		localMultiuser.value = val === 'Все, у кого есть ссылка'
	},
})

// Когда открываем диалог — копируем значение из родителя в локальное
watch(modelValue, (val) => {
	if (val) {
		localMultiuser.value = multiuser.value
	}
})

// При нажатии "Готово" сохраняем изменения в родителя
const confirm = () => {
	multiuser.value = localMultiuser.value
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

				q-item(clickable)
					q-item-section(side)
						q-avatar(size='28px' color="positive" text-color="white") РЛ
					q-item-section
							div Роза Львовна
							.caption По приглашению
					q-item-section(side)
						q-icon(name="mdi-close-circle" color="grey" size="sm")

			.text-bold.q-mt-md Доступ на редактирование
			q-select(outlined dense v-model="dostup" :options='options')
				template(v-slot:prepend)
					q-icon(v-if='dostup == "Доступ ограничен"' name="mdi-lock" color="primary")
					q-icon(v-else name="mdi-link" color="primary")
			.hint
				span(v-if='dostup =="Доступ ограничен"') Редактировать приложение могут только пользователи, из списка выше.
				span(v-else) Редактировать приложение могут все, у кого есть ссылка.
		q-card-actions.q-mx-md(align='right')
			q-btn(v-if='localMultiuser' outline rounded color="primary" icon="mdi-link" label="Копировать ссылку" size="sm") 
			q-space
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

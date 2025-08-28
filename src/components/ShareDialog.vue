<script setup lang="ts">
import { ref, watch } from 'vue'

const modelValue = defineModel<boolean>()
const multiuser = defineModel<boolean>('multiuser')

const dostup = ref('Доступ ограничен')
const options = [
	{ id: 0, label: 'Доступ ограничен', value: 'Доступ ограничен' },
	{ id: 1, label: 'Все, у кого есть ссылка', value: 'Все, у кого есть ссылка' },
]

const action = () => {
	if (dostup.value === 'Все, у кого есть ссылка') {
		multiuser.value = true
	} else {
		multiuser.value = false
	}
}

watch(modelValue, (val) => {
	if (val === true) {
		// Диалог открылся
		if (multiuser.value) {
			dostup.value = 'Все, у кого есть ссылка'
		} else {
			dostup.value = 'Доступ ограничен'
		}
	}
})
</script>

<template lang="pug">
q-dialog(v-model="modelValue")
	q-card(style="width: 400px;")
		q-btn.close(round color="negative" icon="mdi-close" v-close-popup)
		q-card-section
			.text-h6 Доступ к приложению
			.q-mt-md Пользователи имеющие доступ к приложению:
			br
			q-list(bordered separator)
				q-item(clickable)
					q-item-section(side)
						q-avatar(size='md')
							img(src="https://cdn.quasar.dev/img/avatar.png")
					q-item-section Орлов П.С.
					q-item-section(side)
						.caption Вы (автор)
				q-item(clickable)
					q-item-section(side)
						q-icon(name="mdi-account-circle" color="primary" size='md')
					q-item-section Администратор
					q-item-section(side)
						.caption Системная роль

			.text-bold.q-mt-md Общий доступ
			q-select(outlined dense v-model="dostup" :options='options')
				template(v-slot:prepend)
					q-icon(v-if='dostup == "Доступ ограничен"' name="mdi-lock" color="primary")
					q-icon(v-else name="mdi-link" color="primary")
			.hint
				span(v-if='dostup =="Доступ ограничен"') Открывать приложение могут только пользователи, имеющие доступ.
				span(v-else) Открывать приложение могут все, у кого есть ссылка.
		q-card-actions.q-mx-md(align='right')
			q-btn(outline rounded color="primary" icon="mdi-link" label="Копировать ссылку" size="sm") 
			q-space
			q-btn(flat color="primary" label="Отмена" v-close-popup) 
			q-btn(unelevated color="primary" label="Готово" @click="action" v-close-popup) 
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
</style>

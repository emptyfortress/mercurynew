<template lang="pug">
q-dialog(v-model="visible" backdrop-filter="blur(4px) saturate(150%)")
  q-card
    q-btn.close(icon="mdi-close" color="negative" round dense v-close-popup)
    q-card-section.row.items-center.q-pb-none
      .text-h6(v-if="menuLabel === 'Помощь'") Общая помощь
      .text-h6(v-else) Интерактивный гид
    q-card-section(v-if="menuLabel === 'Помощь'")
      ol
        li
          a(href="#") Введение в приложение
        li
          a(href="#") Работа с формами
        li
          a(href="#") Управление списками
        li
          a(href="#") Настройка ролей
        li
          a(href="#") Просмотр изменений
        li
          a(href="#") Экспорт данных
        li
          a(href="#") Импорт шаблонов
        li
          a(href="#") Настройки пользователя
        li
          a(href="#") Помощь по API
        li
          a(href="#") Обратная связь
    q-card-section(v-else)
      div Гид по интерфейсу.
    q-card-section
      div Current route path: {{ routePath }}
    q-card-actions(align="right")
      q-btn(flat label="Cancel" color="primary" @click="emitCancel")
      q-btn(unelevated label="OK" color="primary" @click="emitOk")
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps<{
	menuLabel: string
}>()

const emit = defineEmits<{
	ok: [menuLabel: string]
	cancel: [menuLabel: string]
}>()

const visible = defineModel<boolean>()

const route = useRoute()
const routePath = computed(() => route.path)

const emitOk = () => {
	emit('ok', props.menuLabel)
	visible.value = false
}

const emitCancel = () => {
	emit('cancel', props.menuLabel)
	visible.value = false
}
</script>

<style lang="scss" scoped>
.q-card {
	min-width: 400px;
}
</style>

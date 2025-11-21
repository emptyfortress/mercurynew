<template lang="pug">
q-dialog(v-model="visible")
  q-card
    q-card-section
      div Help content goes here.
    q-card-section
      div Current route path: {{ routePath }}
    q-card-actions(align="right")
      q-btn(flat label="Cancel" color="primary" @click="emitCancel")
      q-btn(flat label="OK" color="primary" @click="emitOk")
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const emit = defineEmits(['ok', 'cancel'])

const visible = defineModel<boolean>()

const route = useRoute()
const routePath = computed(() => route.path)

const emitOk = () => {
  emit('ok')
  visible.value = false
}

const emitCancel = () => {
  emit('cancel')
  visible.value = false
}
</script>

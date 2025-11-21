<template lang="pug">
q-dialog(v-model="visible")
  q-card
    q-card-section
      div Help content goes here.
    q-card-actions(align="right")
      q-btn(flat label="Cancel" color="primary" @click="emitCancel")
      q-btn(flat label="OK" color="primary" @click="emitOk")
</template>

<script setup lang="ts">
const emit = defineEmits(['ok', 'cancel'])

const visible = defineModel()

const emitOk = () => {
  emit('ok')
  visible.value = false
}

const emitCancel = () => {
  emit('cancel')
  visible.value = false
}
</script>

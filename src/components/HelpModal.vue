<template>
  <q-dialog v-model="visible">
    <q-card>
      <q-card-section>
        <div>Help content goes here.</div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="primary" @click="emitCancel" />
        <q-btn flat label="OK" color="primary" @click="emitOk" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps({
  modelValue: { type: Boolean, default: false }
});
const emit = defineEmits(['update:modelValue', 'ok', 'cancel']);

const visible = ref(props.modelValue);
watch(() => props.modelValue, (val) => {
  visible.value = val;
});
watch(visible, (val) => {
  emit('update:modelValue', val);
});

function emitOk() {
  emit('ok');
  visible.value = false;
}
function emitCancel() {
  emit('cancel');
  visible.value = false;
}
</script>

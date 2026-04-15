import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useBotStore = defineStore('bot', () => {
  const botOpen = ref(false)

  function toggleBot() {
    botOpen.value = !botOpen.value
  }

  return { botOpen, toggleBot }
})

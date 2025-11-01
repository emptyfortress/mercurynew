import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useChangesStore = defineStore('changes', () => {
  const hasChanges = ref(false)

  function setHasChanges(value: boolean) {
    hasChanges.value = value
  }

  return { hasChanges, setHasChanges }
})

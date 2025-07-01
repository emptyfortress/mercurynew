<script setup lang="ts">
import { ref, watch } from 'vue'
import { useItemStore } from '@/stores/items'
import { useDragAndDrop } from '@formkit/drag-and-drop/vue'
import { animations } from '@formkit/drag-and-drop'

// Pinia Store
const store = useItemStore()

// локальная копия для drag-and-drop
const localItems = ref([...store.items])

const config = {
	plugins: [animations()],
	draggable: () => true,
}

const [pare, tapes] = useDragAndDrop(localItems.value, config)

// 🧠 DnD → Store
watch(
	tapes,
	(val) => {
		store.setItems(val)
	},
	{ deep: true }
)

// 🔁 Store → DnD UI
watch(
	() => store.items,
	(val) => {
		localItems.value = [...val]
	},
	{ deep: true }
)

// ➕ Добавление
let nextId = 1 + store.items.length
const newLabel = ref('')
const addItem = () => {
	if (newLabel.value.trim()) {
		tapes.value.push({
			id: `item-${nextId++}`,
			label: newLabel.value,
		})
		// store.items.push({
		// 	id: `item-${nextId++}`,
		// 	label: newLabel.value,
		// })
		newLabel.value = ''
	}
}

// ❌ Удаление
const removeItem = (id: string) => {
	store.items = store.items.filter((item) => item.id !== id)
}
</script>

<template lang="pug">
q-card(flat bordered class="q-pa-md")
  q-card-section
    .text-h6.q-mb-sm Список с перетаскиванием

    q-input(
      v-model="newLabel"
      label="Новый элемент"
      dense outlined
      class="q-mb-sm"
      @keyup.enter="addItem"
    )
      template(v-slot:append)
        q-btn(
          icon="mdi-plus"
          round dense
          color="primary"
          @click="addItem"
        )

  q-separator

  q-card-section
    div(ref="pare")
      div.q-pa-sm.q-my-xs.bg-grey-2.flex.items-center.justify-between.q-rounded-borders.draggable-item(
        v-for="item in tapes"
        :key="item.id"
      )
        div.flex.items-center.gap-sm
          q-icon(name="mdi-drag" size="sm" class="text-grey")
          span {{ item.label }}
        q-btn(
          icon="mdi-delete"
          round dense flat
          color="negative"
          @click="removeItem(item.id)"
        )
</template>

<style scoped>
.draggable-item {
	cursor: grab;
	transition: background-color 0.2s;
}
.draggable-item:hover {
	background-color: #e0f7fa;
}
</style>

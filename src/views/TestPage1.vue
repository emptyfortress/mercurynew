<script setup lang="ts">
import { ref, computed } from "vue";
import { Container, Draggable } from "vue3-smooth-dnd";
import { applyDrag } from "@/utils/utils";
import { useKeyModifier } from "@vueuse/core";

const tapes = ref([
  { id: 0, group: false },
  { id: 1, group: false },
  { id: 2, group: false },
  { id: 3, group: false },
]);

const tap = ref([]);

const onDrop = (dropResult: number) => {
  console.log("fuck");
  tapes.value = applyDrag(tapes.value, dropResult);
};

const shift = useKeyModifier("Shift");

const type = computed(() => {
  return shift.value ? 1 : 0;
});

const acceptDrop = () => {
  return !shift.value;
};

const hoverItem = ref();
const draggingItem = ref();

const onDragEnter = (index: number) => {
  hoverItem.value = index;
};
const onDragLeave = () => {
  hoverItem.value = null;
};

const calcOver = (index: number) => {
  if (hoverItem.value == index && index !== draggingItem.value) return "green";
  return "";
};

const onDragStart = (n: number) => {
  draggingItem.value = n;
};

const onDrop1 = () => {
  let item = tapes.value[hoverItem.value];
  item.group = true;
  console.log(item);

  onDragLeave();
  tapes.value.splice(draggingItem.value, 1);
  draggingItem.value = null;
};
</script>

<template lang="pug">
q-page(padding)

	ul
		Container(v-if='type == 0' @drop="onDrop" orientation='horizontal' :should-accept-drop='acceptDrop' group-name='column')
			Draggable(v-for="(item, index) in tapes" :key="item.id")
				.fuck(:class="{ group: item.group }") {{ item.id }}
		.fuck(v-if='type == 1' v-for="(item, index) in tapes"
			:key="item.id"
			:draggable='true'
			@dragstart='onDragStart(index)'
			@dragover.prevent="onDragEnter(index)"
			@dragenter.prevent
			@dragleave="onDragLeave"
			@drop='onDrop1'
			:class='calcOver(index)'
			) {{ item.id }}

	// q-btn.q-mt-sm(unelevated color="primary" label="add" @click="action1") 

	// .target(v-if='dragging' @drop="test")
</template>

<style scoped lang="scss">
q-page {
  // position: relative;
}

ul {
  display: flex;
  flex-wrap: wrap;
}

.target {
  position: fixed;
  left: 50%;
  bottom: 1rem;
  width: 200px;
  height: 100px;
  background: #ccc;
  border: 2px dashed black;
}

.fuck {
  width: 100px;
  height: 100px;
  background: #fff;
  margin: 0.25rem;
  position: relative;

  &.group {
    box-shadow:
      2px 2px 3px rgba($color: #000000, $alpha: 0.2),
      -1px -1px 2px rgba($color: #000000, $alpha: 0.2);

    &:before {
      content: "";
      display: block;
      width: 100px;
      height: 100px;
      background: #fff;
      position: absolute;
      top: 0px;
      left: 0px;
      z-index: -2;
      transform: rotate(5deg);
      box-shadow: 1px 1px 5px rgba($color: #000000, $alpha: 0.2);
    }
  }

  &.green {
    background: #a8d7a8;
  }
}

.link {
  position: absolute;
  bottom: 2rem;
  right: 2rem;
  background: #fff;
  background: pink;
  width: 124px;
  height: 124px;
}
</style>

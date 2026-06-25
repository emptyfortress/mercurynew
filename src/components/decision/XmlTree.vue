<template lang="pug">
.xml-tree
  XmlNode(v-if="tree" :node="tree")
  .xml-error(v-else-if="error") {{ error }}
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import XmlNode from './XmlNode.vue'

export interface XmlNodeData {
	tag: string
	attrs: Record<string, string>
	children: XmlNodeData[]
	text: string | null
}

const props = defineProps<{ xml: string }>()

const tree = ref<XmlNodeData | null>(null)
const error = ref<string | null>(null)

function domToNode(el: Element): XmlNodeData {
	return {
		tag: el.tagName,
		attrs: Object.fromEntries([...el.attributes].map((a) => [a.name, a.value])),
		children: [...el.children].map(domToNode),
		text: el.children.length === 0 ? el.textContent : null,
	}
}

watchEffect(() => {
	const doc = new DOMParser().parseFromString(props.xml, 'application/xml')
	const parseErr = doc.querySelector('parsererror')
	if (parseErr) {
		error.value = 'Ошибка парсинга XML'
		tree.value = null
	} else {
		error.value = null
		tree.value = domToNode(doc.documentElement)
	}
})
</script>

<style scoped lang="scss">
.xml-error {
	color: red;
	font-family: monospace;
}
.xml-tree {
	background: #1e1e2e;
	padding: 16px;
	border-radius: 8px;
}
</style>

<script setup lang="ts">
import { ref } from 'vue'
import type { XmlNodeData } from './XmlTree.vue'

const props = defineProps<{ node: XmlNodeData }>()
const expanded = ref(true)

const lt = '<'
const gt = '>'
const slash = '/'

function toggle() {
	if (props.node.children.length) expanded.value = !expanded.value
}
</script>

<template lang="pug">
.xml-node
  .xml-tag(@click="toggle" :class="{ clickable: node.children.length }")
    span.xml-toggle(v-if="node.children.length") {{ expanded ? '▾' : '▸' }}
    span.xml-toggle-placeholder(v-else)
    span.xml-bracket {{ lt }}
    span.xml-tagname {{ node.tag }}
    template(v-for="(val, key) in node.attrs" :key="key")
      |  
      span.xml-attr {{ key }}
      span.xml-bracket =
      span.xml-value "{{ val }}"
    span.xml-bracket(v-if="!node.children.length") {{ slash + gt }}
    span.xml-bracket(v-else-if="!expanded") {{ gt }}…{{ lt + slash }}{{ node.tag }}{{ gt }}
    span.xml-bracket(v-else) {{ gt }}

  template(v-if="node.children.length && expanded")
    .xml-children
      XmlNode(
        v-for="(child, i) in node.children"
        :key="i"
        :node="child"
      )
    .xml-tag
      span.xml-toggle-placeholder
      span.xml-bracket {{ lt + slash }}
      span.xml-tagname {{ node.tag }}
      span.xml-bracket {{ gt }}

  span.xml-text(v-else-if="node.text") {{ node.text }}
</template>

<style scoped lang="scss">
.xml-node {
	font-family: 'Courier', monospace;
	font-size: 13px;
	font-weight: 600;
}

.xml-tag {
	display: flex;
	align-items: center;
	gap: 2px;
	white-space: pre;
	line-height: 1.6;

	&.clickable {
		cursor: pointer;
		&:hover {
			background: rgba(255, 255, 255, 0.05);
			border-radius: 3px;
		}
	}
}

.xml-toggle {
	width: 14px;
	text-align: center;
	color: #767993;
	user-select: none;
}
.xml-toggle-placeholder {
	display: inline-block;
	width: 14px;
}

.xml-children {
	padding-left: 20px;
	border-left: 1px solid hsl(234 12% 46% / 1);
	margin-left: 6px;
}

.xml-bracket {
	color: hsl(234 12% 65% / 1);
}
.xml-tagname {
	color: #89b4fa;
} // голубой — имя тега
.xml-attr {
	color: #a6e3a1;
} // зелёный — атрибуты
.xml-value {
	color: #f38ba8;
} // розовый — значения
.xml-text {
	color: #cdd6f4;
	margin-left: 34px;
} // светлый — текст
// .xml-node {
// 	font-family: monospace;
// 	font-size: 13px;
// }
//
// .xml-tag {
// 	display: flex;
// 	align-items: center;
// 	gap: 2px;
// 	white-space: pre;
// 	line-height: 1.6;
//
// 	&.clickable {
// 		cursor: pointer;
// 		&:hover {
// 			background: rgba(0, 0, 0, 0.04);
// 			border-radius: 3px;
// 		}
// 	}
// }
//
// .xml-toggle {
// 	width: 14px;
// 	text-align: center;
// 	color: #999;
// 	user-select: none;
// }
// .xml-toggle-placeholder {
// 	display: inline-block;
// 	width: 14px;
// }
//
// .xml-children {
// 	padding-left: 20px;
// 	border-left: 1px solid #e0e0e0;
// 	margin-left: 6px;
// }
//
// .xml-bracket {
// 	color: #666;
// }
// .xml-tagname {
// 	color: #0066cc;
// }
// .xml-attr {
// 	color: #cc6600;
// }
// .xml-value {
// 	color: #008800;
// }
// .xml-text {
// 	color: #333;
// 	margin-left: 34px;
// }
</style>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import MarkdownIt from 'markdown-it'

const route = useRoute()

const html = ref('')
const loading = ref(false)
const error = ref('')

const md = new MarkdownIt({
	html: false,
	linkify: true,
	typographer: true,
})

async function loadMarkdown() {
	loading.value = true
	error.value = ''

	try {
		const name = route.params.name
		const response = await fetch(`/docs/${name}.md`)

		if (!response.ok) {
			throw new Error(`Документ не найден: ${name}`)
		}

		const text = await response.text()
		html.value = md.render(text)
	} catch (e) {
		html.value = ''
		error.value = e.message
	} finally {
		loading.value = false
	}
}

watch(() => route.params.name, loadMarkdown, { immediate: true })
</script>

<template>
	<main class="markdown-page">
		<div v-if="loading">Загрузка…</div>

		<div
			v-else-if="error"
			class="error"
		>
			{{ error }}
		</div>

		<article
			v-else
			class="markdown-body"
			v-html="html"
		/>
	</main>
</template>

<style scoped>
.markdown-page {
	padding: 40px 24px;
	background: #fff;
}

.markdown-body {
	max-width: 860px;
	margin: 0 auto;
	line-height: 1.65;
}

.markdown-body :deep(h1) {
	font-size: 32px;
	font-weight: 600;
	margin: 0 0 32px;
}

.markdown-body :deep(h2) {
	font-size: 22px;
	font-weight: 600;
	margin: 40px 0 16px;
}

.markdown-body :deep(p) {
	margin: 12px 0;
}

.markdown-body :deep(ul),
.markdown-body :deep(ol) {
	padding-left: 24px;
}

.markdown-body :deep(li) {
	margin: 6px 0;
}

.markdown-body :deep(blockquote) {
	margin: 20px 0;
	padding: 12px 20px;
	border-left: 3px solid #ccc;
	background: #f6f6f6;
}

.markdown-body :deep(code) {
	background: hsl(0 0% 91% / 1);
	padding: 2px 5px;
	border-radius: 4px;
}

.markdown-body :deep(pre) {
	overflow-x: auto;
	padding: 16px;
	background: #f5f5f5;
	border-radius: 8px;
}

.markdown-body :deep(pre code) {
	padding: 0;
	background: transparent;
}

.error {
	max-width: 860px;
	margin: 0 auto;
}
</style>

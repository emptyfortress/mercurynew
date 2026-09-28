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
/*
 * Markdown в стиле ChatGPT
 */

.markdown-page {
	min-height: 100vh;
	padding: 48px 24px 80px;

	background: #ffffff;
	color: #0d0d0d;

	font-family:
		ui-sans-serif,
		-apple-system,
		BlinkMacSystemFont,
		'Segoe UI',
		sans-serif;

	font-size: 16px;
	line-height: 1.7;
	-webkit-font-smoothing: antialiased;
}

/* Основная колонка */

.markdown-body {
	width: 100%;
	max-width: 760px;
	margin: 0 auto;
}

/* Заголовки */

.markdown-body :deep(h1) {
	margin: 0 0 28px;

	font-size: 28px;
	line-height: 1.25;
	font-weight: 600;
	letter-spacing: -0.02em;
}

.markdown-body :deep(h2) {
	margin: 36px 0 14px;

	font-size: 20px;
	line-height: 1.35;
	font-weight: 600;
	letter-spacing: -0.01em;
}

.markdown-body :deep(h3) {
	margin: 28px 0 10px;

	font-size: 17px;
	line-height: 1.4;
	font-weight: 600;
}

/* Текст */

.markdown-body :deep(p) {
	margin: 0 0 16px;
}

.markdown-body :deep(strong) {
	font-weight: 600;
}

/* Списки */

.markdown-body :deep(ul),
.markdown-body :deep(ol) {
	margin: 0 0 16px;
	padding-left: 26px;
}

.markdown-body :deep(li) {
	margin: 5px 0;
	padding-left: 3px;
}

.markdown-body :deep(li > ul),
.markdown-body :deep(li > ol) {
	margin-top: 5px;
	margin-bottom: 5px;
}

/* Цитаты */

.markdown-body :deep(blockquote) {
	margin: 20px 0;
	padding: 2px 0 2px 16px;

	border-left: 2px solid #d9d9d9;
	color: #5d5d5d;
}

.markdown-body :deep(blockquote p:last-child) {
	margin-bottom: 0;
}

/* Inline code */

.markdown-body :deep(code) {
	padding: 4px 8px;

	border-radius: 5px;
	/* background: #f1f1f1; */
	background: hsl(0 0% 91% / 1);

	font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', monospace;

	font-size: 0.875em;
}

/* Блоки кода */

.markdown-body :deep(pre) {
	margin: 20px 0;
	padding: 16px 18px;

	overflow-x: auto;

	border: 1px solid #e5e5e5;
	border-radius: 10px;
	background: #f7f7f8;

	line-height: 1.55;
}

.markdown-body :deep(pre code) {
	padding: 0;

	border-radius: 0;
	background: transparent;

	font-size: 13px;
}

/* Ссылки */

.markdown-body :deep(a) {
	color: #0d0d0d;
	text-decoration: underline;
	text-decoration-color: #b4b4b4;
	text-underline-offset: 3px;
}

.markdown-body :deep(a:hover) {
	text-decoration-color: #0d0d0d;
}

/* Горизонтальная линия */

.markdown-body :deep(hr) {
	margin: 32px 0;

	border: 0;
	border-top: 1px solid #e5e5e5;
}

/* Таблицы */

.markdown-body :deep(table) {
	width: 100%;
	margin: 20px 0;

	border-collapse: collapse;

	font-size: 14px;
}

.markdown-body :deep(th),
.markdown-body :deep(td) {
	padding: 10px 12px;

	border-bottom: 1px solid #e5e5e5;

	text-align: left;
	vertical-align: top;
}

.markdown-body :deep(th) {
	font-weight: 600;
}

/* Изображения */

.markdown-body :deep(img) {
	display: block;

	max-width: 100%;
	height: auto;
	margin: 24px 0;

	border-radius: 8px;
}

/* Ошка загрузки */

.error {
	max-width: 760px;
	margin: 0 auto;

	color: #b42318;
}

/* Мобильный */

@media (max-width: 640px) {
	.markdown-page {
		padding: 28px 18px 60px;
	}

	.markdown-body :deep(h1) {
		font-size: 25px;
	}

	.markdown-body :deep(h2) {
		font-size: 19px;
	}
}
</style>

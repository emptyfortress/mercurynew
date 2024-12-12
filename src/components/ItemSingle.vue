<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { Container, Draggable } from 'vue3-smooth-dnd'
import { applyDrag } from '@/utils/utils'
import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'
import { useRouter } from 'vue-router'
import { useApps } from '@/stores/apps'
import { useStorage } from '@vueuse/core'

const tapes = defineModel<App[]>('tapes')

tapes.value?.map((item) => (item.expand = false))

gsap.registerPlugin(Flip)

const onDrop = (dropResult: number) => {
	tapes.value = applyDrag(tapes.value, dropResult)
}

const expanded = ref<boolean>(false)

const expand = (item: any) => {
	const state = Flip.getState('.item')
	expanded.value = !expanded.value
	item.expand = !item.expand
	nextTick(() => {
		Flip.from(state, {
			duration: 0.4,
			ease: 'power3.inOut',
			absolute: true,
			onEnter: (elements) =>
				gsap.fromTo(
					elements,
					{ opacity: 0 },
					{ opacity: 1, duration: 0.6, ease: 'linear', delay: 0.2 }
				),
			onLeave: (elements) =>
				gsap.fromTo(elements, { opacity: 1 }, { opacity: 0, duration: 0.2, ease: 'linear' }),
		})
	})
}

const calcClass = (item: App) => {
	if (expanded.value == true && item.expand == true) return 'active'
	if (expanded.value == true && item.expand == false) return 'inactive'
	if (item.group == true) return 'group'
	else return ''
}

const router = useRouter()
const myapps = useApps()
const app = useStorage('app', localStorage)

const navigate = (e: App) => {
	e.expand = false
	myapps.setCurrentApp(e)
	router.push('/assistent')
}
const navigate1 = (e: any) => {
	myapps.setCurrentApp(e)
	app.value = { ...e }
	router.push('/process')
}
</script>

<template lang="pug">
Container(@drop="onDrop" orientation='horizontal' group-name='column' :tag="{ value: 'div', props: { class: 'list' } }")
	Draggable(v-for="(item, index) in tapes"
		:key="item.id")
		.item(
			v-motion
			:initial="{ y: 100, opacity: 0 }"
			:enter='{ y: 0, opacity: 1, transition: { delay: 100 + (100 * index) } }'
			@click='expand(item)'
			:class="calcClass(item)"
			)
			div(v-if='item.group') Группа
			div(v-else) {{ item.label }}

			.content(v-if='item.expand'
				v-motion
				:initial="{ x: 100, opacity: 0 }"
				:enter="{ x: 0, opacity: 1, transition: { type: 'spring', stiffness: 500, damping: 30, delay: 300 } }")

				div() {{ item.id }}
				div() {{ item.descr }}
				div() Автор: {{ item.author }}
				div() Версия: {{ item.version }}

			q-card-actions(align="center"
				v-if='item.expand'
				v-motion
				:initial="{ y: -20, opacity: 0 }"
				:enter="{ y: 0, opacity: 1, transition: { type: 'spring', stiffness: 500, damping: 30, delay: 550 } }")
				q-btn(unelevated color="primary" icon="mdi-tune-variant" label="Первичные настройки" @click.stop="navigate(item)") 
				q-btn(unelevated color="primary" icon="mdi-code-block-braces" label="К приложению" @click.stop="navigate1(item)") 
</template>

<style scoped lang="scss">
.smooth-dnd-container.horizontal.list {
	display: flex;
	flex-wrap: wrap;
}

.content {
	margin-top: 3rem;
}
</style>

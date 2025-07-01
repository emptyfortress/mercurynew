<script setup lang="ts">
import { useServers } from '@/stores/servers'
import { motion } from 'motion-v'

const props = defineProps({
	adding: {
		type: Boolean,
		required: true,
		default: false,
	},
})

const Div = motion.div
const server = useServers()

const emit = defineEmits(['close', 'apply'])
const close = () => {
	emit('close')
}

const apply = () => {
	emit('apply')
}
const selectAll = () => {
	server.selectAll()
}
</script>

<template lang="pug">
.text-h6 Доступные базы данных (серверы?)
Div(v-if='props.adding'
	:initial="{ opacity: 0, x: 20 }"
	:animate="{ opacity: 1, x: 0, transition: { delay: 0.5  } }"
 )
	q-card-section
		q-list
			q-item(tag="label" v-ripple v-for="item in server.testservers" :key='item.id' dense)
				q-item-section
					q-item-label {{ item.nick }}
				q-item-section()
					q-item-label(caption) test
				q-item-section(side)
					q-checkbox(v-model="item.vis" color="positive")
			q-separator(space)

			q-item(tag="label" v-ripple v-for="item in server.prodservers" :key='item.id' dense)
				q-item-section(side)
					q-icon(name="mdi-access-point" color="negative" size='sm')
				q-item-section
					q-item-label {{ item.nick }}
				q-item-section
					q-item-label(caption) production
				q-item-section(side)
					q-checkbox(v-model="item.vis" color="negative")

	q-card-actions()
		q-btn(flat color="primary" label="Отмена"  @click='close') 
		q-space
		q-btn(flat color="primary" label="Выбрать все"  @click='selectAll') 
		q-btn(unelevated color="primary" label="Применить"  @click='apply') 

</template>

<style scoped lang="scss"></style>

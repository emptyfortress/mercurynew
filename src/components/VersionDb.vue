<script setup lang="ts">
import { useServers } from '@/stores/servers'

const server = useServers()

const selectAll = () => {
	server.selectAll()
}
</script>

<template lang="pug">
.info Выберите базы данных, которые будут доступны для публикации данного приложения

q-list
	q-item(tag="label" v-ripple v-for="item in server.testservers" :key='item.id' dense)
		q-item-section(side)
			q-icon.hid(name="mdi-access-point" color="negative" size='sm')
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

	q-btn.plus(unelevated round icon="mdi-plus" color="primary")

</template>

<style scoped lang="scss">
.info {
	text-align: center;
}
.hid {
	visibility: hidden;
}
.q-list {
	max-width: 500px;
	margin: 0 auto;
}
.plus {
	margin-top: 1rem;
	// margin: 1rem auto;
}
</style>

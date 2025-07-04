<script setup lang="ts">
import { ref } from 'vue'
import ServerTile from '@/components/ServerTile.vue'
import MySelect from '@/components/common/MySelect.vue'
import Draggable from 'vuedraggable'
import { useServers } from '@/stores/servers'

const server = useServers()

const filter = ref('')

const user = ref('')

const onClone = () => {
	console.log(111)
}
</script>

<template lang="pug">
.grid
	div
		q-input.filter(v-model="filter" dense clearable placeholder="Фильтр" @clear="filter = ''")
			template(v-slot:prepend)
				q-icon(name="mdi-magnify")

		draggable.list(
			:list="server.editors"
			:group="{ name: 'items', pull: 'clone', put: false }"
			:clone="onClone"
			item-key="id"
			:sort='false'
		)
			template(#item="{ element, index }")
				.myitem(clickable dense)
					q-item-section(side)
						q-icon(name="mdi-account-circle" color="primary")
					q-item-section
						q-item-label {{ element.name }}
					q-item-section(side)
						span(v-if='element.author') Автор
						q-btn(v-else flat round dense icon="mdi-close" color="secondary"  size="sm") 

		.add
			MySelect(v-model="user" prepend)
			q-btn(flat round dense color="primary" icon='mdi-plus-circle-outline') 

				
	ServerTile

</template>

<style scoped lang="scss">
.cont {
	max-width: 1000px;
	margin: 0 auto;
}

.hd {
	font-size: 1.5rem;
	text-align: center;
	.q-icon {
		margin-bottom: 4px;
		margin-right: 0.5rem;
	}
}
.grid {
	max-width: 900px;
	margin: 1rem auto;
	display: grid;
	grid-template-columns: 2fr 4fr;
	column-gap: 3rem;
}
.filter {
	margin-bottom: 1rem;
	margin-left: 1rem;
}
.add {
	display: flex;
	justify-content: start;
	align-items: center;
	gap: 0.5rem;
	margin-top: 2rem;
	margin-left: 1rem;
	:deep(.q-field--dense) {
		width: 250px;
	}
}
.myitem {
	display: flex;
	align-items: center;
	cursor: pointer;
	padding: 0.2rem 0.2rem 0.2rem 1rem;
	&:hover {
		background: white;
	}
}
</style>

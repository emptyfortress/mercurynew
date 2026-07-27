<script setup lang="ts">
import { ref } from 'vue'
import { useApproveStore } from '@/stores/approveStore'
import MaterialSymbolsAltRoute from '@/components/icons/MaterialSymbolsAltRoute.vue'
// import { useRoute } from 'vue-router'
import CardEtap from '@/components/decision/CardEtap.vue'
import CardMarshroute from '@/components/decision/CardMarshroute.vue'
import CardSoglas from '@/components/decision/CardSoglas.vue'
import CardFolder from '@/components/decision/CardFolder.vue'

// const route = useRoute()

const approveStore = useApproveStore()

const selectedElement = ref(approveStore.selectedElement)
</script>

<template lang="pug">
div(v-if='selectedElement')
	.row.items-start.justify-between.q-px-md
		.myblock
			MaterialSymbolsAltRoute(v-if="selectedElement.type == 2")
			q-icon.fold(name="mdi-flag-triangle" color="secondary" v-if='selectedElement.type == 3')
			q-icon.fold(name="mdi-message-check-outline" color="secondary" v-if='selectedElement.type == 1')
			q-icon.fold( name="mdi-folder-outline" color="secondary" v-if='selectedElement.type == 0')
			div
				.text-overline
					span(v-if='selectedElement.type == 2') Маршрут
					span(v-if='selectedElement.type == 3') Этап
					span(v-if='selectedElement.type == 1') Согласование
					span(v-if='selectedElement.type == 0') Папка
				.zg {{ selectedElement?.text }}
					// q-popup-edit(v-model="selectedElement.text" auto-save v-slot="scope")
					// 	q-input(v-model="scope.value" dense autofocus counter @keyup.enter="scope.set")

		.btngroup(v-if='!!selectedElement && selectedElement.type > 0')
			q-btn(unelevated color="primary" label="Сохранить" size="sm" @click="") 
			q-btn(outline color="primary" label="Отмена" size="sm") 
			q-btn(round flat color="primary" icon="mdi-sync" size="sm") 
			q-chip(size='sm' color="amber") Есть изменения
			q-chip(size='sm' color="blue-grey-3" icon="mdi-lock") Заблокировано вами
			q-btn(flat round color="negative" icon="mdi-delete-outline" size="sm") 
				q-menu
					q-list
						q-item.pink(clickable @click="")
							q-item-section Удалить

	CardFolder(v-if='selectedElement.type == 0')
	CardSoglas(v-if='selectedElement.type == 1')
	CardMarshroute(v-if='selectedElement.type == 2')
	CardEtap(v-if='selectedElement.type == 3')

</template>

<style scoped lang="scss">
.zg {
	font-size: 1rem;
	text-transform: uppercase;
	font-weight: 600;
	// color: $primary;
	// padding-bottom: 0;
	// border-bottom: 1px dotted var(--q-primary);
}
.myblock {
	display: grid;
	grid-template-columns: auto 1fr;
	justify-items: start;
	align-items: stretch;
	column-gap: 0.7rem;
	.text-h6,
	.text-overline {
		line-height: 1;
	}
	.text-overline {
		color: $blue-grey-6;
	}
	svg {
		width: 35px;
		height: 35px;
		color: $secondary;
	}
}
.fold {
	color: $secondary;
	font-size: 2.1rem;
}
.btngroup > * {
	margin-right: 0.25rem;
}
</style>

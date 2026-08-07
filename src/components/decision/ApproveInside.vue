<script setup lang="ts">
import { ref, computed } from 'vue'
import { useApproveStore } from '@/stores/approveStore'
import MaterialSymbolsAltRoute from '@/components/icons/MaterialSymbolsAltRoute.vue'
import CardEtap from '@/components/decision/CardEtap.vue'
import CardEtapTemp from '@/components/decision/CardEtapTemp.vue'
import CardMarshroute from '@/components/decision/CardMarshroute.vue'
import CardSoglas from '@/components/decision/CardSoglas.vue'
import CardFolder from '@/components/decision/CardFolder.vue'

const approveStore = useApproveStore()

const selectedElement = ref(approveStore.selectedElement)

const showGroup = computed(() => {
	if (
		!!selectedElement.value &&
		selectedElement.value.filetype &&
		selectedElement.value.filetype > 0
	)
		return true
	return false
})
</script>

<template lang="pug">
div(v-if='selectedElement')
	.row.items-start.justify-between.q-px-md
		.myblock
			.row.items-center
				MaterialSymbolsAltRoute(v-if="selectedElement.filetype == 2")
				q-icon.fold(name="mdi-flag-triangle" color="secondary" v-if='selectedElement.filetype == 3')
				q-icon.fold(name="mdi-message-check-outline" color="secondary" v-if='selectedElement.filetype == 1')
				q-icon.fold( name="mdi-folder-outline" color="secondary" v-if='selectedElement.filetype == 0')
				q-icon.fold(v-if="selectedElement.template" name="mdi-share-variant" color="secondary")
			div
				.text-overline
					span(v-if='selectedElement.filetype == 2 && selectedElement.template') Типовой маршрут
					span(v-if='selectedElement.filetype == 2 && !selectedElement.template') Маршрут
					span(v-if='selectedElement.filetype == 3 && selectedElement.template') Типовой этап
					span(v-if='selectedElement.filetype == 3 && !selectedElement.template') Этап
					span(v-if='selectedElement.filetype == 1 && selectedElement.template') Типовое согласование
					span(v-if='selectedElement.filetype == 1 && !selectedElement.template') Согласование
					span(v-if='selectedElement.filetype == 0') Папка
				.zg {{ selectedElement?.text }}

		.btngroup(v-if='showGroup')
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

	CardFolder(v-if='selectedElement.filetype == 0')
	CardSoglas(v-if='selectedElement.filetype == 1')
	CardMarshroute(v-if='selectedElement.filetype == 2')
	CardEtapTemp(v-if='selectedElement.filetype == 3 && selectedElement.template')
	CardEtap(v-if='selectedElement.filetype == 3')

	// q-dialog(v-model="share")
	// 	q-card
	// 		q-btn.close(icon="mdi-close" color="negative" round dense v-close-popup)
	// 		q-card-section
	// 			.text-h6
	// 				q-icon.q-mr-md(name="mdi-share-variant" color="primary")
	// 				span(v-if='selectedElement.filetype == 3') Типовой этап
	// 				span(v-if='selectedElement.filetype == 2') Типовой маршрут
	//
	// 		q-card-section
	// 			div Сделать этап доступным для использования в других маршрутах? Этап станет типовым и будущие изменения в нем затронут все связанные маршруты.
	// 		q-card-actions(align="right")
	// 			q-btn(flat color="primary" label="Отмена" v-close-popup) 
	// 			q-btn(unelevated color="primary" label="OK" @click="sharing") 

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

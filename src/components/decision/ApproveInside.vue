<script setup lang="ts">
import { ref, computed } from 'vue'
import { useApproveStore } from '@/stores/approveStore'
import MaterialSymbolsAltRoute from '@/components/icons/MaterialSymbolsAltRoute.vue'
import CardEtap from '@/components/decision/CardEtap.vue'
import CardMarshroute from '@/components/decision/CardMarshroute.vue'
import CardSoglas from '@/components/decision/CardSoglas.vue'
import CardFolder from '@/components/decision/CardFolder.vue'
import { useRouter } from 'vue-router'
// import IcTwotoneHandshake from '@/components/icons/IcTwotoneHandshake.vue'

const router = useRouter()

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

const remove = () => {
	router.push('/dvmain/approve/')
	setTimeout(() => {
		approveStore.toggleDelete()
	}, 200)
}

const save = () => {
	if (approveStore.selectedElement && approveStore.tempName) {
		approveStore.selectedElement.text = approveStore.tempName
	}
}
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
			q-btn(unelevated color="primary" label="Сохранить" size="sm" @click="save") 
			q-btn(outline color="primary" label="Отмена" size="sm" @click="") 
			q-btn(round flat color="primary" icon="mdi-sync" size="sm") 
			q-chip(size='sm' color="amber") Есть изменения
			q-chip(size='sm' color="blue-grey-3" icon="mdi-lock") Заблокировано вами
			q-btn(flat round color="negative" icon="mdi-delete-outline" size="sm") 
				q-menu
					q-list
						q-item.pink(clickable @click="remove")
							q-item-section Удалить

	CardFolder(v-if='selectedElement.filetype == 0')
	CardSoglas(v-if='selectedElement.filetype == 1')
	CardMarshroute(v-if='selectedElement.filetype == 2')
	CardEtap(v-if='selectedElement.filetype == 3')

</template>

<style scoped lang="scss">
.zg {
	font-size: 1rem;
	text-transform: uppercase;
	font-weight: 600;
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

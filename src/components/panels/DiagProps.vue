<script setup lang="ts">
import { ref, computed } from 'vue'
import etapProps from '@/assets/img/etap.png'
import roleProps from '@/assets/img/role.png'
import { useDiagram } from '@/stores/diagram'
import IconAttribute from '@/components/icons/IconAttribute.vue'
import IconRelation from '@/components/icons/IconRelation.vue'
import Empty1 from '@/components/Empty1.vue'
import PropField from '@/components/common/PropField.vue'

const mydiagram = useDiagram()

const next = () => {
	emit('next')
}

const emit = defineEmits(['next'])

const showEtap = computed(() => {
	if (
		mydiagram.selection == 'Создание заявления' ||
		mydiagram.selection == 'Согласование' ||
		mydiagram.selection == 'Доработка' ||
		mydiagram.selection == 'Завершение'
	)
		return true
})

const showRoot = computed(() => {
	if (mydiagram.selection == 'Заявление') return true
})

const showRole = computed(() => {
	if (
		mydiagram.selection == 'Инициатор' ||
		mydiagram.selection == 'Руководитель' ||
		mydiagram.selection == 'Кадровик'
	)
		return true
})
const item1 = ref(true)
const item2 = ref(true)

const list = [
	{
		id: 0,
		label: 'Метка',
		main: '',
	},
	{
		id: 1,
		label: 'Подсказка',
		main: '',
	},
	{
		id: 2,
		label: 'Текст-заполнитель',
		main: '',
	},
]
</script>

<template lang="pug">
Empty1(v-if='!mydiagram.selection')

template(v-if='mydiagram.selection && showRoot')
	.text-h6 Процесс: Заявление на отпуск 
	.q-mt-md.text-bold Длительность: 63ч.

template(v-if='mydiagram.selection && showRole')
	.text-h6 Роль: название роли
	.q-mt-md.text-bold Правила выбора

q-list(v-if='mydiagram.selection && showEtap' separator)
	q-expansion-item(v-model="item1")
		template(v-slot:header)
			q-item-section(side)
				IconAttribute.ic
			q-item-section.zg Атрибуты

		q-list.prop
			PropField(v-for="item in list" :key='item.id'
				:label='item.label'
				v-model:main="item.main"
				)


	q-expansion-item(v-model="item2")
		template(v-slot:header)
			q-item-section(side)
				IconRelation.ic
			q-item-section.zg Дополнительно

// div
// 	template(v-if='showRoot')
// 		.text-h6 Процесс: Заявление на отпуск 
// 		.q-mt-md.text-bold Длительность: 63ч.

	// template(v-if='showEtap')
	// 	img(:src="etapProps" usemap="#image-map" width="335")
	// 	map(name="image-map")
	// 		area(target="_self" alt="next" title="next" @click="next" coords="299,154,346,197" shape="rect")

	// template(v-if='showRole')
	// 	img(:src="roleProps" usemap="#image-map" width="335")
	// 	map(name="image-map")
	// 		area(target="_self" alt="next" title="next" @click="next" coords="275,209,330,248" shape="rect")

</template>

<style scoped lang="scss">
:deep(area) {
	cursor: pointer;
}
.ic {
	font-size: 1.5rem;
	margin-right: 0.5rem;
	color: $secondary;
}
.zg {
	text-transform: uppercase;
	color: $secondary;
	text-align: left;
}
.prop {
	margin-left: 0.5rem;
	margin-right: 0.5rem;
}
</style>

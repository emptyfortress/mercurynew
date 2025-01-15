<script setup lang="ts">
import IconGroup from '@/components/icons/IconGroup.vue'
import IconText from '@/components/icons/IconText.vue'
import IconTextBlock from '@/components/icons/IconTextBlock.vue'
import IconDivider from '@/components/icons/IconDivider.vue'
import IconSpacer from '@/components/icons/IconSpacer.vue'
import IconHeader from '@/components/icons/IconHeader.vue'

const layouts = [
	{
		id: 0,
		label: 'Группа',
		caption: 'Группировка элементов',
		icon: IconGroup
	},
	{
		id: 1,
		label: 'Заголовок',
		caption: 'Статичный заголовок',
		icon: IconHeader
	},
	{
		id: 2,
		label: 'Текст',
		caption: 'Статичный однострочный текст (метка)',
		icon: IconText
	},
	{
		id: 3,
		label: 'Блок текста',
		caption: 'Статичный текстовый параграф',
		icon: IconTextBlock
	},
	{
		id: 4,
		label: 'Разделитель',
		caption: 'Горизонтальная разделительная линейка',
		icon: IconDivider
	},
	{
		id: 5,
		label: 'Отступ',
		caption: 'Вертикальный отступ 20 px',
		icon: IconSpacer
	},
]
</script>

<template lang="pug">
q-list(bordered separator)
	q-item(v-for="item in layouts" :key="item.id" :draggable="true")
		q-item-section(avatar)
			component.big(:is="item.icon")
		q-item-section
			q-item-label.text-bold {{ item.label }}
			q-item-label.grey(caption) {{ item.caption }}

</template>

<style scoped lang="scss">
.q-list {
	text-align: left;
	margin: 0 1rem;
}

.q-item {
	cursor: all-scroll;
	color: $secondary;
	text-align: left;

	&:hover {
		color: $primary;
		background: #efefef;
	}
}

.grey {
	color: #aaa;
}

.big {
	font-size: 2rem;
}
</style>

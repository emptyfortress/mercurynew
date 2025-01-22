<script setup lang="ts">
import IconGroup from '@/components/icons/IconGroup.vue'
import IconPic from '@/components/icons/IconPic.vue'
import IconAa from '@/components/icons/IconAa.vue'

const layouts = [
	{
		id: 0,
		label: 'Группа',
		caption: 'Группировка элементов',
		icon: IconGroup
	},
	{
		id: 2,
		label: 'Текст',
		caption: 'Однострочный текст (метка)',
		icon: IconAa
	},
	{
		id: 6,
		label: 'Картинка',
		caption: 'Изображение в формате png, jpg, gif',
		icon: IconPic
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
	margin-bottom: 2rem;
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

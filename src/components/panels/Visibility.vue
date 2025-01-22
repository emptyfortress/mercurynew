<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const model = ref(false)
const all = ref<boolean | string>(true)
const phone = ref(true)
const tablet = ref(true)
const desktop = ref(true)

const action = (() => {
	if (all.value == true) {
		all.value = false
		phone.value = false
		tablet.value = false
		desktop.value = false
	} else {
		all.value = true
		phone.value = true
		tablet.value = true
		desktop.value = true
	}
})

const dev = computed(() => {
	let tmp = []
	tmp.push(phone.value)
	tmp.push(tablet.value)
	tmp.push(desktop.value)
	return tmp.filter((el) => el == true).length
})

watch(dev, (val) => {
	if (val > 0 && val < 3) {
		all.value = 'maybe'
	}
	if (val == 0) {
		all.value = false
	}
	if (val == 3) {
		all.value = true
	}
})
</script>

<template lang="pug">
q-expansion-item(v-model="model" expand-separator switch-toggle-side)
	template(#header)
		.header
			label Видимость
			div
				q-checkbox(:model-value="all" dense @click='action' indeterminate-value="maybe")

	q-list(dense)
		q-item.my(clickable tag="label")
			q-item-section(side style="padding-right: 6px;")
				q-icon(name="mdi-cellphone" size='16px' color="secondary")
			q-item-section.lab
				div Телефон
			q-item-section(side)
				q-checkbox(v-model="phone" dense)

		q-item.my(clickable tag="label")
			q-item-section(side style="padding-right: 6px;")
				q-icon(name="mdi-tablet" size='16px' color="secondary")
			q-item-section.lab Планшет
			q-item-section(side)
				q-checkbox(v-model="tablet" dense)

		q-item.my(clickable tag="label")
			q-item-section(side style="padding-right: 6px;")
				q-icon(name="mdi-monitor" size='16px' color="secondary")
			q-item-section.lab Десктоп
			q-item-section(side)
				q-checkbox(v-model="desktop" dense)
</template>

<style scoped lang="scss">
.header {
	display: grid;
	grid-template-columns: 88px 1fr;
	justify-items: start;
	align-items: center;
	column-gap: 1rem;
	font-size: .8rem;
	margin-left: -1rem;
}

.q-list {
	padding-bottom: .5rem;
	margin-bottom: .5rem;
}

.header,
label {
	cursor: pointer;

}

.lab {
	text-align: left;
	width: 90px;
}

.q-item__section--main {
	flex: initial;
}

:deep(.q-item) {
	padding-left: 0;
}

.my {
	padding-left: 1rem;
}
</style>

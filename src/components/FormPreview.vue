<script lang="ts" setup>
import { ref, computed } from 'vue'
import IconFaceMask from '@/components/icons/IconFaceMask.vue'
import IconRocket from '@/components/icons/IconRocket.vue'
import { useKeys } from '@/stores/keys'

const mykeys = useKeys()

const isKeyEmpty = computed(() => mykeys.keys.length === 0)

const emit = defineEmits(['search'])
const startSearch = () => {
	emit('search')
}
</script>

<template lang="pug">
.preview
	.empty(v-if="isKeyEmpty")
		IconFaceMask.big
		div Запрос не настроен.

	.grid(v-if='mykeys.hasParameters.length')
		template(v-for="(group, index) in mykeys.hasParameters" :key="group[0].id")
			.edit(:class="{'dis': !group[3].isActive}") {{ group[0].label }}:
				q-popup-edit(v-model="group[0].label" auto-save v-slot="scope")
					q-input(v-model="scope.value" dense autofocus counter @keyup.enter="scope.set")
			q-input(:model-value="group[2].label", filled, dense, :disable="!group[3].isActive")
			q-toggle(size="sm" v-model="group[3].isActive")
		
	.empty(v-if='!mykeys.hasParameters.length && !isKeyEmpty')
		IconRocket.big
		div Показ формы не требуется.


	.action(v-if="mykeys.hasParameters.length && !isKeyEmpty")
		q-btn(unelevated color="primary" label="Искать" @click="startSearch")
</template>

<style scoped lang="scss">
.preview {
	padding: 1rem;
}

.action {
	grid-column: 1/-1;
	margin-top: 1rem;
	width: 100%;
}

.empty {
	text-align: center;
	color: $secondary;
}

.big {
	font-size: 3rem;
	color: $secondary;
}

.grid {
	display: grid;
	grid-template-columns: 0.5fr 1fr auto;
	justify-items: start;
	align-items: center;
	column-gap: 1rem;
	row-gap: 0.5rem;

	.q-input {
		width: 100%;
	}
}

.condition {
	padding: 0.3rem 0.5rem 0.3rem 0;
	background: white;
	display: flex;
	justify-content: left;
	align-items: center;
	width: fit-content;
	gap: 0.5rem;
}
.edit {
	border-bottom: 1px dotted $primary;
	cursor: pointer;
}
.dis {
	opacity: 0.3;
}
</style>

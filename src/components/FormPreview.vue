<script lang="ts" setup>
import { useKeys } from '@/stores/keys'
import { ref, onMounted, watch } from 'vue'
import IconRocket from '@/components/icons/IconRocket.vue'

const mykeys = useKeys()

const emit = defineEmits(['search'])
const startSearch = () => {
	emit('search')
}

// Ref to store the local input values
const localInputValues = ref<{ [key: string]: string }>({})
const localLabelValues = ref<{ [key: string]: string }>({})

onMounted(() => {
	// Initialize local input values from the store on component mount
	mykeys.hasParameters.forEach((group) => {
		localInputValues.value[group[2].id] = group[2].label
		localLabelValues.value[group[0].id] = group[0].label
	})
})

// Watch for changes in mykeys.hasParameters to update localInputValues
watch(
	() => mykeys.hasParameters,
	(newParameters) => {
		newParameters.forEach((group) => {
			localInputValues.value[group[2].id] = group[2].label
			localLabelValues.value[group[0].id] = group[0].label
		})
	},
	{ deep: true }
)

// Function to update the local input value
const updateLocalInputValue = (id: string, newValue: any) => {
	localInputValues.value[id] = newValue
}
const updateLocalLabelValue = (id: string, newValue: any, scope: any) => {
	scope.set()
	localLabelValues.value[id] = newValue
}

const enter = (e: Event, id: string) => {
	mykeys.setHover(id)
}
const leave = () => {
	mykeys.setHover(null)
}
</script>

<template lang="pug">
.preview
	.grid(v-if='mykeys.hasParameters.length')
		template(v-for="(group, index) in mykeys.hasParameters", :key="group[0].id")
			.edit(
				:class="{'dis': !group[3].isActive}",
				@mouseenter='enter($event, group[0].id)',
				@mouseleave='leave',
			) {{ localLabelValues[group[0].id] }}:
				q-popup-edit(v-model="localLabelValues[group[0].id]" auto-save v-slot="scope")
					.small {{group[0].label}} {{ group[1].label}}
					q-input(v-model="scope.value" dense filled autofocus counter @keyup.enter="updateLocalLabelValue(group[0].id, scope.value, scope)")

			div(
				@mouseenter='enter($event, group[0].id)',
				@mouseleave='leave',
			)
				q-input(
					:model-value="localInputValues[group[2].id]"
					@update:model-value="updateLocalInputValue(group[2].id, $event)"
					filled
					dense
					:disable="!group[3].isActive"
				)
			q-toggle(size="sm" v-model="group[3].isActive")

	.empty(v-else)
		IconRocket.big
		div Параметры не заданы.<br />Показ формы не требуется.

	.action(v-if="mykeys.hasParameters.length")
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
	text-align: left;
}
.dis {
	opacity: 0.3;
}
.small {
	font-size: 0.7rem;
	color: hsl(198 23% 50% / 1);
}
</style>

<script lang="ts" setup>
import { useKeys } from '@/stores/keys'
import { ref, onMounted, watch } from 'vue'
import IconRocket from '@/components/icons/IconRocket.vue'
import { animations } from '@formkit/drag-and-drop'
import { useDragAndDrop } from '@formkit/drag-and-drop/vue'

const mykeys = useKeys()

const emit = defineEmits(['search'])
const startSearch = () => {
	emit('search')
}

// Ref to store the local input values
const localInputValues = ref<{ [key: string]: string }>({})
const localLabelValues = ref<{ [key: string]: string }>({})
// const localToggleValues = ref<{ [key: string]: boolean }>({})
const toggle = ref<boolean[]>([])

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
		tapes.value = newParameters
		toggle.value = new Array(mykeys.hasParameters.length).fill(false)
	},
	{ deep: true }
)

watch(localInputValues, (val) => {
	if (val) {
		console.log('fuck')
	}
})

// Function to update the local input value
const updateLocalInputValue = (id: string, index: number, newValue: any) => {
	localInputValues.value[id] = newValue
	toggle.value[index] = true
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

const config = {
	plugins: [animations()],
	dragPlaceholderClass: 'ghost',
	sortable: true,
	draggable: (child: HTMLElement) => {
		return child.classList.contains('grid')
	},
}
const [parent, tapes] = useDragAndDrop(mykeys.hasParameters, config)
</script>

<template lang="pug">
.preview
	div(v-if='mykeys.hasParameters.length' ref='parent')
		.grid(
			v-for="(group, index) in tapes",
			:key="group[0].id",
			@mouseenter='enter($event, group[0].id)',
			@mouseleave='leave',
		)
			q-icon.q-mr-sm(name='mdi-drag-vertical' size='20px' color="grey")
			.edit()
				span {{ localLabelValues[group[0].id] }}:
					q-popup-edit(v-model="localLabelValues[group[0].id]" auto-save v-slot="scope")
						.small {{group[0].label}} {{ group[1].label}}
						q-input(v-model="scope.value" dense filled autofocus @keyup.enter="updateLocalLabelValue(group[0].id, scope.value, scope)")

			q-input(
				:model-value="localInputValues[group[2].id]"
				@update:model-value="updateLocalInputValue(group[2].id, index, $event)"
				filled
				dense
			)
			q-toggle(size="sm" v-model="toggle[index]")

	.empty(v-else)
		IconRocket.big
		div Параметры не заданы.<br />Показ формы не требуется.

	.action()
		q-btn(unelevated color="primary" label="Искать" @click="startSearch")
</template>

<style scoped lang="scss">
.preview {
	padding: 1rem 0.25rem;
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
	grid-template-columns: 19px 139px 175px 48px;
	justify-items: start;
	align-items: center;
	column-gap: 0.25rem;
	background: #fff;
	margin-bottom: 0.25rem;
	cursor: move;
	&:hover {
		background: #efefef;
	}
}

.edit {
	text-align: left;
	overflow: hidden;
	text-overflow: ellipsis;
	width: 100%;
	span {
		border-bottom: 1px dotted $primary;
		cursor: pointer;
	}
}
.dis {
	opacity: 0.3;
}
.small {
	font-size: 0.7rem;
	color: hsl(198 23% 50% / 1);
}
.ghost {
	background: hsl(213 38% 91% / 1) !important;
	box-shadow: none !important;
	border: none !important;
	min-height: 40px;

	* {
		visibility: hidden;
	}
}
</style>

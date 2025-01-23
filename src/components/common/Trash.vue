<script setup lang="ts">
import { ref, computed } from 'vue'
import { useMotions } from '@vueuse/motion'
import IconTrash from '@/components/icons/IconTrash.vue'

const props = defineProps({
	group: {
		type: Boolean,
		default: false
	}

})
const modelValue = defineModel<boolean>()

const motions = useMotions()

const left = computed(() => {
	if (props.group) {
		return window.innerWidth / 2 - 350 + 'px'
	} else {
		return window.innerWidth / 2 - 110 + 'px'
	}
})

const over1 = ref(false)
const over2 = ref(false)
const onDragEnter1 = (() => {
	over1.value = true
})
const onDragLeave1 = (() => {
	over1.value = false
})
const onDragEnter2 = (() => {
	over2.value = true
})
const onDragLeave2 = (() => {
	over2.value = false
})

const emit = defineEmits(['remove'])
const onDrop = (() => {
	emit('remove')
	modelValue.value = false
	over1.value = false
	over2.value = false
})
</script>

<template lang="pug">
transition(:css="false" @leave="(el, done) => motions.cube.leave(done)")
	Teleport(to="body")
		.trash(v-if='modelValue'
			v-motion='"cube"'
			:initial="{ y: 200, opacity: 0, }"
			:enter="{ y: 0, opacity: 1, }"
			:leave="{ y: 200, opacity: 0, }"
			:delay=800
			)

			.myrow
				.one(v-if='props.group'
					@dragover.prevent="onDragEnter1"
					@dragenter.prevent
					@dragleave="onDragLeave1"
					@drop='onDrop'
					:class='{ over: over1 }'
					)
					q-icon(name="mdi-select-remove" color="negative" size="52px")
					label Исключить из группы
				.two(
					@dragover.prevent="onDragEnter2"
					@dragenter.prevent
					@dragleave="onDragLeave2"
					@drop='onDrop'
					:class='{ over: over2 }'
					)
					IconTrash
					label
						|Удалить
						span.q-ml-sm(v-if='props.group') навсегда

</template>

<style scoped lang="scss">
.trash {
	position: absolute;
	bottom: 3rem;
	left: v-bind(left);
	font-size: 3rem;
	color: darkred;
	vertical-align: middle;
	text-align: center;
	background: transparent;
}

.myrow {
	display: flex;
	gap: 0;
	align-items: center;
	justify-content: center;
	line-height: .5;
}

.one,
.two {
	padding: 2rem 5rem;
	box-sizing: border-box;
	border: 2px solid transparent;
	border-radius: var(--rad);
}

.over {
	background: pink;
	border: 2px dashed darkred;
}

label {
	display: block;
	font-size: 1rem;
	margin-top: 2rem;
}
</style>

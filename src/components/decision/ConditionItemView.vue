<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
	stat: Stat
}>()

const emit = defineEmits(['kill'])

const editText = ref(props.stat.data.text)

const kill = () => {
	emit('kill')
}

const par = computed(() => {
	return props.stat.data.parents
})
</script>

<template lang="pug">
.node
	q-form.one(v-if="props.stat.data.type === 1 || props.stat.data.type === 2" ref="myform" no-error-focus)
		.mai
			div
				.txt
					template(v-for="item in par" :key="item")
						div {{ item }}
						.q-mx-sm >
					div {{ props.stat.data.text}}

				.syno(v-if="props.stat.data.syn.length")
					template(v-for="item in props.stat.data.synparents" :key="item")
						span {{ item }}
						span.q-mx-sm >
					span {{props.stat.data.syn[0]}}

		.edit
			span {{ editText }}
				q-popup-edit(v-model="editText" auto-save v-slot="scope")
					q-input(v-model="scope.value" dense autofocus counter @keyup.enter="scope.set")


	.but
		q-btn.close(flat round icon="mdi-close" @click="kill" size="sm")

</template>

<style scoped lang="scss">
.node {
	cursor: pointer;
	position: relative;
	transition: 0.2s ease transform;

	.close {
		position: absolute;
		right: 0.5rem;
		top: 50%;
		transform: translateY(-50%);
	}
	.but {
		display: none;
	}
	&:hover {
		.but {
			display: block;
		}
	}
}
.edit {
	span {
		color: $primary;
		font-weight: 600;
		border-bottom: 1px dotted $primary;
	}
}

.one {
	display: grid;
	grid-template-columns: 3fr 1fr 80px;
	align-items: center;
	background: var(--node);
	padding: 0.5rem;
	padding-left: 1.3rem;
	border: 1px solid var(--nodeborder);
	border-radius: 4px;
	margin-bottom: 2px;
	position: relative;
	&:hover {
		border-color: $secondary;
	}
}

.mai {
	display: flex;
	justify-content: start;
	align-items: center;
	.syn {
		margin-left: 1rem;
	}
}
.txt {
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	font-size: 0.9rem;
	.syn {
		margin-left: 1rem;
		visibility: hidden;
	}
	&:hover {
		.syn {
			visibility: visible;
		}
	}
}
.syno {
	font-size: 0.9rem;
}
:deep(.q-field__control:before) {
	background: transparent;
}
</style>

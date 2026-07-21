<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { conditions, values } from '@/stores/select'
import SynModal from '@/components/decision/SynModal.vue'

const props = defineProps<{
	stat: Stat
}>()

const isMan = (el: string) => el == 'man'
const isDate = (el: string) => el == 'date'
const isState = (el: string) => el == 'state'
const isAll = (el: string) => el == 'all'

const calcSecond = computed(() => {
	if (props.stat.data.man) {
		return conditions.filter((e: any) => e.kind.some(isMan))
	}
	if (props.stat.data.state) {
		return conditions.filter((e: any) => e.kind.some(isState))
	}
	if (props.stat.data.date) {
		return conditions.filter((e: any) => e.kind.some(isDate))
	}
	return conditions.filter((e: any) => e.kind.some(isAll))
})
const options3 = ref(values)

const next = (e: Stat) => {
	e.data.typ = !e.data.typ
}

const toggle = (stat: any) => {
	stat.open = !stat.open
}

const emit = defineEmits(['kill', 'duble', 'toggleVis'])

const rukovoditel = ref('yes')
const vis = ref(true)

const req = computed(() => {
	if (vis.value == false) {
		return [(val: string) => (val && val.length > 0) || 'Это обязательное поле']
	}
	return [() => true]
})

const myform = ref()
const toggleVis = () => {
	emit('toggleVis')
	vis.value = !vis.value
	props.stat.data.vis ? myform.value.resetValidation() : myform.value.validate()
}
const text = computed(() => {
	if (!!props.stat.data.man || !!props.stat.data.date) {
		return false
	} else return true
})
const kill = () => {
	emit('kill')
}
const showLast = computed(() => {
	if (
		props.stat.data.text2 == 'Значение задано' ||
		props.stat.data.text2 == 'Значение не задано' ||
		props.stat.data.text2 == 'Я' ||
		props.stat.data.text2 == 'Мои подчиненные' ||
		props.stat.data.text2 == 'Мой руководитель' ||
		props.stat.data.text2 == 'Сегодня' ||
		props.stat.data.text2 == 'Сейчас' ||
		props.stat.data.text2 == 'Текущая неделя' ||
		props.stat.data.text2 == 'Текущий месяц' ||
		props.stat.data.text2 == 'Текущий квартал' ||
		props.stat.data.text2 == 'Текущий год'
	) {
		return false
	}
	return true
})
const par = computed(() => {
	// return props.stat.data.parents?.filter((el) => el !== '')
	return props.stat.data.parents
})
const modal = ref(false)

const showModal = () => {
	modal.value = !modal.value
	// console.log(props.stat.data)
}
const common = ref(false)
const commonName = ref('')
const setName = (e: string) => {
	common.value = true
	commonName.value = e
}
</script>

<template lang="pug">
.node
	.zero(v-if="props.stat.data.type === 0")
		q-icon.trig(name="mdi-chevron-down" v-if="stat.children.length" @click.stop="toggle(stat)" :class="{ 'closed': !stat.open }")
		q-icon.trig(name="mdi-alert-outline" color="negative" v-else size="xs")
			q-tooltip Оператор должен содержать не менее 2 условий
		.icon(:class="{ or: props.stat.data.typ === true }" @click.stop="next(props.stat)")
		.q-ml-md Оператор
		.text-weight-bold.q-ml-sm {{ props.stat.data.typ == true ? 'ИЛИ' : 'И' }}

	q-form.one(v-if="props.stat.data.type === 1 || props.stat.data.type === 2" ref="myform" no-error-focus)
		.mai(v-if="!common")
			div
				.txt
					template(v-for="item in par" :key="item")
						.text-weight-bold {{ item }}
						.q-mx-sm >
					.text-weight-bold {{ props.stat.data.text}}
				.syno(v-if="props.stat.data.syn.length")
					template(v-for="item in props.stat.data.synparents" :key="item")
						span.text-weight-bold {{ item }}
						span.q-mx-sm >
					span.text-weight-bold {{props.stat.data.syn[0]}}

			// q-btn.syn(dense flat round icon="mdi-playlist-plus" @click.stop="showModal" )
			// 	q-tooltip Добавить в условие поля

		.txt(v-else)
			.text-weight-bold
				span {{ commonName }}
				span.q-ml-sm *
				q-tooltip Общая метка
			q-btn.syn( dense flat round icon="mdi-playlist-plus" @click="showModal") 
				q-tooltip Добавить в условие поля

		template(v-if="props.stat.data.ruk")
			.row
				q-radio(v-model="rukovoditel" val="yes" label="Да")
				q-radio(v-model="rukovoditel" val="no" label="Нет")

		template(v-else)
			q-select.uslovie(v-model="props.stat.data.text2" :options="calcSecond" label="Условие" dense emit-value)
			template(v-if="showLast")
				q-input(v-if="text" dense v-model="props.stat.data.inp" outlined bg-color="white" placeholder="Значение" lazy-rules :rules="req" hide-bottom-space @blur="myform.validate()")
				q-select(v-else v-model="props.stat.data.text3" :options="options3" outlined label="Значение" dense bg-color="white" lazy-rules :rules="req" hide-bottom-space @blur="myform.validate()")
					template(v-slot:prepend v-if="props.stat.data.date")
						q-icon(name="mdi-calendar")
					template(v-slot:prepend v-if="props.stat.data.man")
						q-icon(name="mdi-book-open-page-variant-outline")
				q-checkbox(v-model='props.stat.data.param' label='Параметр' dense)

		// q-btn.eye(flat round @click.stop="toggleVis" size="md")
			q-icon(name="mdi-eye" v-if="props.stat.data.vis") 
			q-icon(name="mdi-eye-off" v-else) 
			q-tooltip Скрывать условие при поиске

	.but
		q-btn.close(flat round icon="mdi-close" @click="kill" size="sm")
		q-btn.dub(flat round icon="mdi-plus-circle-multiple-outline" @click="$emit('duble')" size="sm")

	SynModal(v-model="modal" :stat="props.stat" @setname="setName")
</template>

<style scoped lang="scss">
.node {
	cursor: pointer;
	position: relative;
	transition: 0.2s ease transform;

	img {
		width: 42px;
		margin-right: 1rem;
	}

	.eye {
		position: absolute;
		left: -1.8rem;
		top: 0.5rem;
	}
	.dub {
		position: absolute;
		right: 0.1rem;
		top: 2rem;
	}
	.close {
		position: absolute;
		right: 0.1rem;
		top: 0.2rem;
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

.restrict {
	position: absolute;
	top: 50%;
	left: -1rem;
	transform: translateY(-50%);
	display: none;
}

.zero {
	display: flex;
	align-items: center;
	background: transparent;
	margin-bottom: 4px;
	height: 54px;
	position: relative;
}

.one {
	display: grid;
	grid-template-columns: 2fr 165px 180px 120px 25px;
	align-items: center;
	background: var(--node);
	padding: 0.5rem;
	padding-left: 1.3rem;
	border: 1px solid var(--nodeborder);
	border-radius: 4px;
	margin-bottom: 4px;
	gap: 0.5rem;
	position: relative;
	&:hover {
		border-color: $primary;
	}
}

.trig {
	position: absolute;
	top: 1.2rem;
	left: -1.5rem;
	font-size: 1.3rem;
	// margin-right: 0.5rem;
	transition: 0.2s ease all;

	&.closed {
		transform: rotate(-90deg);
	}
}

.icon {
	width: 49px;
	height: 36px;
	background-image: url('@/assets/img/andor.svg');
	transition: 0.2s ease-out all;
	background-position: top left;
	cursor: pointer;

	&.or {
		background-position: bottom left;
	}
}
:deep(.q-field--error .q-field__bottom) {
	display: none;
}
.mai {
	display: flex;
	justify-content: start;
	align-items: center;
	.syn {
		margin-left: 1rem;
		// visibility: hidden;
	}
	// &:hover {
	// 	.syn {
	// 		visibility: visible;
	// 	}
	// }
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

<script setup lang="ts">
import { ref } from 'vue'
import AddAiDialog from '@/components/AddAiDialog.vue'
import CreateAiDialog from '@/components/CreateAiDialog.vue'

const adding = ref(false)

const emit = defineEmits(['create'])

function createApplication(e: any): void {
	emit('create', e)
}
const aiDialog = ref(false)
</script>

<template lang="pug">
.fucking(@click='adding = true')
	.button
		q-icon(name="mdi-plus" color="white" size="24px")

	AddAiDialog(v-model="adding" @create="createApplication" @goAi="aiDialog = true")
	CreateAiDialog(v-model="aiDialog" @create='createApplication')

</template>

<style scoped lang="scss">
.fucking {
	width: 100%;
	height: 100%;
	border-radius: 0.5rem;
	background: rgb(255 255 255 / 40%);
	display: flex;
	justify-content: center;
	align-items: center;
	cursor: pointer;
	&:hover {
		box-shadow: var(--shad0);
	}
}
.button {
	background: $primary;
	width: 42px;
	height: 42px;
	border-radius: 24px;
	display: flex;
	justify-content: center;
	align-items: center;
	cursor: pointer;
	position: relative;
}
</style>

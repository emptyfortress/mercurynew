<script setup lang="ts">
import { ref } from 'vue'
import PropField from '@/components/common/PropField.vue'

const main = ref(true)
</script>

<template lang="pug">
PropField(
	label='Доступность для редактирования'
	v-model="main"
	:toggle="true"
	:check='main'
	)
</template>

<style scoped lang="scss"></style>

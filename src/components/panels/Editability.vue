<script setup lang="ts">
import { ref } from 'vue'
import PropField from '@/components/common/PropField.vue'

const main = ref(false)
</script>

<template lang="pug">
PropField(
	label='Запрет на изменение'
	v-model="main"
	:toggle="true"
	:check='main'
	)
</template>

<style scoped lang="scss"></style>

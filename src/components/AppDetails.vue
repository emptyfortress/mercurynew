<script setup lang="ts">
import { useApps } from '@/stores/apps'

const myapps = useApps()
</script>

<template lang="pug">
.myItem {{ myapps.currentApp?.label }}
</template>

<style scoped lang="scss">
.myItem {
	width: 100%;
	min-height: 500px;
	background: #fff;
	padding: 1rem;
	border-radius: 0.5rem;
}
</style>

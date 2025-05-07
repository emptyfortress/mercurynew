<script setup lang="ts"></script>

<template lang="pug">
q-list.q-mt-lg
	q-item(clickable to='/bugs')
		q-item-section(avatar)
			q-icon(name="mdi-bug" color="primary")
		q-item-section
			q-item-label Баги
	q-item(clickable to='/vars')
		q-item-section(avatar)
			q-icon(name="mdi-puzzle-outline" color="primary")
		q-item-section
			q-item-label Общие компоненты
</template>

<style scoped lang="scss"></style>

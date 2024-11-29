<script setup lang="ts"></script>

<template lang="pug">
// .text-h6 Библиотека
q-list.q-mt-lg
	q-item(clickable v-for="n in 10" :key='n'
		v-motion
		:initial="{ y: 100, opacity: 0 }"
		:enter='{ y: 0, opacity: 1, transition: { delay: 500 + (50 * n) } }'
		)
		q-item-section item {{ n }}
</template>

<style scoped lang="scss"></style>

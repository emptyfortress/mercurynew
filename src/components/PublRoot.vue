<script setup lang="ts">
import DetailsAppEvents from '@/components/DetailsAppEvents.vue'
import WaitingPub from '@/components/WaitingPub.vue'
import Trends from '@/components/Trends.vue'
</script>

<template lang="pug">
div
	// Trends
	// br

	WaitingPub
	br
	DetailsAppEvents(:showAppColumn='true')

</template>

<style scoped lang="scss"></style>

<script setup lang="ts"></script>

<template lang="pug">
.pos
	q-btn.undo(round @click="" size="sm") 
		q-icon(name="mdi-undo")
		q-tooltip Отменить изменения 
	q-btn.save(round @click="" size="md") 
		q-icon(name="mdi-check-bold")
		q-tooltip Сохранить 
</template>

<style scoped lang="scss">
.pos {
	position: fixed;
	bottom: 3rem;
	right: 13rem;
}
.save {
	background: $primary;
	color: white;
	&:hover {
		background: $positive;
	}
}
.undo {
	position: absolute;
	top: 7px;
	left: -26px;
	background: $primary;
	color: white;
	&:hover {
		background: $positive;
	}
}
</style>

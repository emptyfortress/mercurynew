<template lang="pug">
.modal( data-blendy-to="example")
	div
		h6 Blendy
		q-btn(unelevated color="primary" label="Отмена" @click="$emit('close')") 
		p Meet Blendy, a framework-agnostic tool that smoothly transitions
		p one element into another with just a few lines of code.
</template>


<style scoped lang="scss">
.modal {
	background: #fff;
	width: 600px;
	// height: 100px;
	position: fixed;
	top: 300px;
	left: 500px;
}
</style>

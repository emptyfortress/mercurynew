<script setup>
  const emit = defineEmits(['prev', 'next', 'done']);

  defineProps({
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    hasPrevScene: {
      type: Boolean,
      required: true
    },
    hasNextScene: {
      type: Boolean,
      required: true
    }
  });
</script>

<template lang="pug">
.card
	.header
		div {{ title }}
		q-btn(flat round dense icon="mdi-close" @click="emit('done')" size='sm') 
	.content {{ content }}

	.action
		q-btn(v-show='hasPrevScene' unelevated label="Назад" @click="emit('prev')" size='sm' color="primary") 
		q-btn(v-show="hasNextScene" unelevated label="Далее" @click="emit('next')" size='sm' color="primary") 
		q-btn(v-show="!hasNextScene" unelevated label="Закончить" @click="emit('done')" size='sm' color="primary") 

</template>
<style scoped lang="scss">
.card {
	display: block;
	background: #fde047;
	margin: .5rem;
	border-radius: .5rem;
	box-shadow: 2px 2px 5px rgba(0,0,0,.3);
	// z-index: 99999;
	.header {
		display: flex;
		font-size: 1.2rem;
		padding: .5rem;
		font-weight: bold;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1px solid hsl(50 98% 48% / 1);
	}
	.content {
		font-size: .9rem;
		padding: .5rem;
	}
	.action {
		padding: .5rem;
		display: flex;
		justify-content: end;
		gap: 4px;
	}
}
</style>

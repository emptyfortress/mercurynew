<template>
  <q-card style="min-width: 260px;">
    <q-card-header>
      <div class="text-h5">Filter Settings</div>
    </q-card-header>

    <q-card-section>
      <p class="text-body1">Configure filter criteria for the column data.</p>
    </q-card-section>

    <q-card-actions>
      <q-btn flat label="Save" color="positive" @click="dummyClick" />
      <q-btn flat label="Cancel" color="negative" @click="dummyClick" />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'

function dummyClick() {
  // placeholder – replace with real logic later
  console.log('FilterPanel: dummy click')
}
</script>

<style lang="scss" scoped>
</style>
<script setup lang="ts">
import { RouterView } from 'vue-router';
</script>

<template>
  <main class="app-container">
    <RouterView />
  </main>
</template>

<style>
/* Reset basic styles to allow full-screen layout */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #f8fafc;
  min-height: 100vh;
}

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
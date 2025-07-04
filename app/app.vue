<template>
  <NuxtRouteAnnouncer />
  <NuxtLoadingIndicator color="#000000" />
  <UApp :toaster="{ position: 'top-center' }">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
<script setup lang="ts">
useHead({
  title: 'Wage Tracker',
  meta: [
    { name: 'description', content: 'Track your income and expenses easily.' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { charset: 'utf-8' }
  ],
  bodyAttrs: {
    class: 'test'
  }
});
</script>

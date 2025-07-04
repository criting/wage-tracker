<template>
  <NuxtRouteAnnouncer />
  <NuxtLoadingIndicator color="#000000" />
  <UApp :toaster="{ position: 'top-center' }">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

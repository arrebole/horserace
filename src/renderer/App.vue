
<template>
  <main class="font-mono cursor-default">
    <router-view v-slot="{ Component }">
        <keep-alive><component :is="Component"/></keep-alive>
    </router-view>
  </main>
</template>

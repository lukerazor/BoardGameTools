<script setup>
import { RouterLink, RouterView } from 'vue-router'


</script>

<template>
  <!--<div>
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/barenpark_randomiser">Barenpark</RouterLink>
    </nav>
  </div>-->

  <RouterView />
</template>

<style scoped>
  li {
    cursor: pointer;
  }
</style>

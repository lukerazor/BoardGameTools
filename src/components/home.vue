<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

</script>

<template>
  <div>
    <h1>Boardgame Tools</h1>
    <template v-for="route in router.getRoutes().filter(r => r.path != '/')">
      <button @click="router.push(route.path)">{{ route.name }}</button>  
    </template>
  </div>
</template>

<style scoped>
  div {
    display: grid;
    
    width: fit-content;
    grid-template-columns: max-content;
    margin: auto;
    
    font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-size: larger;
    text-align: center;

    gap: 1rem;

  }

  button {
    font-size: larger;
    margin: auto;
    width: 100%
  }
</style>

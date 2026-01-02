<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

</script>

<template>
  <div>
    <h1>Boardgame Tools</h1>
    <button @click="router.push('/barenpark_randomiser')">Barenpark Randomiser</button>
    <button @click="router.push('/simple_scorepad')">Simple Scorepad</button>
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

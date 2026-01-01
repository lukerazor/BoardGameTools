<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

</script>

<template>
  Boardgame Tools

  <button @click="router.push('/barenpark_randomiser')">Barenpark Randomiser</button>
</template>

<style scoped>
  li {
    cursor: pointer;
  }
</style>

<script setup>
import { ref, onMounted } from 'vue'
import InputInteger from "./input_integer.vue"

const inputValue = ref("0")

</script>

<template>
	<div id="page_body">
		<InputInteger v-model="inputValue"></InputInteger>

		<div id="value_div">
			{{ inputValue }}
		</div>
	</div>
</template>

<style scoped>
	#page_body {
		padding: 50px;
	}

	#value_div {
		margin: 50px;
		background-color: pink;
	}
</style>


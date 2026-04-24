<script setup>
import { ref, onMounted } from 'vue'

const value = defineModel()

const internalValue = ref(0)

let lastValue = ""

function beforeInput(value) {
	lastValue = value
	console.log("beforeinput", value)
}

function input(oldValue, event) {
	
	const rex = /^-{0,1}[0-9]*$/gm

	console.log("input", oldValue, event.data, event.target.value)

	const input = event.target
	
	if(input.value == "-" || input.value == "") {
		// allow the entry but set value = 0
		value.value = 0
	}
	else if(rex.test(input.value)) {
		// happy path, set the value
		console.log("happy")
		value.value = parseInt(input.value)
	}
	else {
		// revert edit
		console.log("revert")
		internalValue.value = oldValue
	}

}

onMounted(() => {
	if(parseInt(value.value)) {
		internalValue.value = value.value
	} 
	else {
		value.value = 0
	}

})

</script>

<template>
	 <input type="number" v-model="internalValue" v-on:input="input(value, $event)" v-on:focus="$event.target.select()" inputmode="numeric"/>
</template>

<style scoped>
	input[type="number"] { 
		width: 6rem;
		appearance: textfield;
	}
</style>
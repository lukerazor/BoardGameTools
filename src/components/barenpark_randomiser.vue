<script setup>
import { ref, onMounted } from 'vue'

const img0 = ref("./barenpark_blank.jpg")
const img1 = ref("./barenpark_blank.jpg")
const img2 = ref("./barenpark_blank.jpg")

function randomiseImages() {
	const chkbox = document.getElementById("chkIncludeExpansion")
	const imgCount = chkbox.checked == true ? 16 : 10

	let images = Array.from(new Array(imgCount), (x,i) => `./barenpark_${`${i}`.padStart(2, "0")}.jpg`)

	const randomImages = []

	for(let count = 0; count < 3; count++) {
		const idx = Math.floor(Math.random() * images.length)
		randomImages.push(images[idx])

		images.splice(idx, 1)
	}
	

	img0.value = randomImages[0]
	img1.value = randomImages[1]
	img2.value = randomImages[2]
}

</script>

<template>
	<div class="centred">
	<h1>Barenpark Randomiser</h1>
	<div id="divPicks">
		<img id="imgPick_0" class="selected_image" :src="img0">
		<img id="imgPick_1" class="selected_image" :src="img1">
		<img id="imgPick_2" class="selected_image" :src="img2">
	</div>
	<div id="divControls">
		<label for="chkIncludeExpansion">Include Bad News Bears Achievements</label>
		<input id="chkIncludeExpansion" type="checkbox" class="large-checks"/>

		<button id="cmdRandomise" @click="randomiseImages">Randomise</button>
	</div>
	</div>
</template>

<style scoped>
	.centred {
		margin: auto;
		width: 80vw;
	}

	button {
		font-size: x-large;
	}

	.selected_image {
		width: 10rem;
		aspect-ratio: 269 / 392;
		margin: 3px;
	}

	.large-checks {
		width: 20px;
		height: 20px;
		margin-right: 1rem;
	}
</style>
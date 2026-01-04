<script setup>
import { ref, reactive, onMounted } from 'vue'

const players = ref([])
const styleObject = reactive({ gridTemplateColumns: "min-content"})

function addPlayer() {
	console.log("adding")
	players.value.push(new Player())

	styleObject.gridTemplateColumns = `min-content repeat(${players.value.length * 2}, 1fr)`
}

function newGame() {
	players.value = []
	styleObject.gridTemplateColumns = "min-content"
}

function calculateDangerPoints(iconCount) {
	if(iconCount == 0) {
		return 0
	}

	const allCounts = players.value.map(p => p.dangerIconCount)
		
	// determine first and second icon counts
	const newPlaceStruct = (iconCount, initialNumPlayers = 0) => {
		return {
			iconCount: iconCount,
			numPlayers: initialNumPlayers,
			points: 0
		}
	}

	let firstPlace = newPlaceStruct(0)
	let secondPlace = newPlaceStruct(0)

	allCounts.forEach(ic => {
		if(ic > firstPlace.iconCount) {
			secondPlace = structuredClone(firstPlace)
				
			firstPlace = newPlaceStruct(ic, 1)
		} 
		else if(ic == firstPlace.iconCount) {
			firstPlace.numPlayers += 1
		}
		else if(ic > secondPlace.iconCount) {
			secondPlace = newPlaceStruct(ic, 1)
		}
		else if(ic = secondPlace.iconCount) {
			secondPlace.numPlayers += 1
		}
	})

	console.log(firstPlace)
	console.log(secondPlace)

	if(firstPlace.numPlayers > 1) {
		firstPlace.points = Math.ceil(18/firstPlace.numPlayers)
	} 
	else {
		firstPlace.points = 12

		if(secondPlace.numPlayers != 0) {
			secondPlace.points = Math.ceil(6/secondPlace.numPlayers)
		}
	}

	if(firstPlace.iconCount == iconCount) {
		return firstPlace.points
	} else if(secondPlace.iconCount == iconCount) {
		return secondPlace.points
	}

	return 0
	
}

/**** Classes ******/
class Player {
	name = ""
	travelCardCount = 0
	dangerIconCount = 0
	eventPoints = 0
	redTagCount = 0
	yellowTagCount = 0
	blueTagCount = 0
	purpleTagCount = 0
	greenTagCount = 0
	
	questCardPoints = []	
	nightCardPoints = []

	travelPoints() {
		if(this.travelCardCount <= 5) {
			return [0, 1, 3, 7, 12, 18][this.travelCardCount]
		}
		
		return 18 + (this.travelCardCount - 5)*4
	}
	
	dangerPoints() {
		return calculateDangerPoints(this.dangerIconCount)
		//self.parent.DangerPoints(self)
	}
	
	tagPoints(numTags) {
		if(numTags >= 4) {
			return numTags
		}
		
		return 0
	}
	
	redTagPoints() {
		return this.tagPoints(this.redTagCount)
	}

	yellowTagPoints() {
		return this.tagPoints(this.yellowTagCount)
	}

	blueTagPoints() {
		return this.tagPoints(this.blueTagCount)
	}

	purpleTagPoints() {
		return this.tagPoints(this.purpleTagCount)
	}

	greenTagPoints() {
		return this.tagPoints(this.greenTagCount)
	}
	
	grandTotal () {		
		var total = 
			this.travelPoints() + 
			this.dangerPoints() +
			this.eventPoints +
			this.redTagPoints() +
			this.yellowTagPoints() +
			this.blueTagPoints() +
			this.purpleTagPoints() +
			this.greenTagPoints()
		
		total += this.nightCardPoints.reduce((acc, val) => acc + val, 0)
		total += this.questCardPoints.reduce((acc, val) => acc + val, 0)
				
		return total
	}
	
	addNightCard() {
		this.nightCardPoints.push(0)
	}
	
	addQuest() {		
		this.questCardPoints.push(0)
	}	

}
</script>

<template>
	<div class="page">
		<img class="logo" src="/bauer_logo.png" />
		<div class="buttons">
			<button @click="newGame()">New Game</button>
			<button @click="addPlayer()">Add Player</button>
		</div>
		<div class="score-grid" :style="styleObject">
			<div></div>
			<div></div>
			<div><img src="/bauer_travel.png"></div>
			<div><img src="/bauer_danger.png"></div>
			<div><img src="/bauer_events.png"></div>
			<div><img src="/bauer_colour_red.png"></div>
			<div><img src="/bauer_colour_yellow.png"></div>
			<div><img src="/bauer_colour_blue.png"></div>
			<div><img src="/bauer_colour_purple.png"></div>
			<div><img src="/bauer_colour_green.png"></div>
			<div><img src="/bauer_quests.png"></div>
			<div><img src="/bauer_night.png"></div>
			<div class="total-row">Total</div>

			<div v-for="(player, p_idx) in players" class="subgrid span-2">
				<div class="span-2"><input v-model="players[p_idx].name" class="fill-cell"></div>
				
				<span>#</span>
				<img src="/bauer_points.png" class="icon_small" />

				<input type="number" inputmode="numeric" class="spinner" min=0 v-model="player.travelCardCount" />
				<span>{{ player.travelPoints() }}</span>

				<input type="number" min=0 v-model="player.dangerIconCount" />
				<span>{{ player.dangerPoints() }}</span>

				<div></div>
				<input type="number" min=0 v-model="player.eventPoints"/>

				<input type="number" min=0 v-model="player.redTagCount"/>
				<span>{{ player.redTagPoints() }}</span>

				<input type="number" min=0 v-model="player.yellowTagCount"/>
				<span>{{ player.yellowTagPoints() }}</span>

				<input type="number" min=0 v-model="player.blueTagCount"/>
				<span>{{ player.blueTagPoints() }}</span>

				<input type="number" min=0 v-model="player.purpleTagCount"/>
				<span>{{ player.purpleTagPoints() }}</span>

				<input type="number" min=0 v-model="player.greenTagCount"/>
				<span>{{ player.greenTagPoints() }}</span>

				<div class="array-grid span-2">
					<button @click="player.addQuest()">+</button>
					<template v-for="(quest, q_idx) in player.questCardPoints">
						<input type="number" min=0 v-model="player.questCardPoints[q_idx]"/>
					</template>
				</div>

				<div class="array-grid span-2">
					<button @click="player.addNightCard()">+</button>
					<template v-for="(nightCard, nc_idx) in player.nightCardPoints">
						<input type="number" min=0 v-model="player.nightCardPoints[nc_idx]"/>
					</template>
				</div>

				<div></div>
				<span class="total-row">{{ player.grandTotal() }}</span>

			</div>
		</div>
	</div>
</template>

<style scoped>
	.page {
		display: flex;
		flex-direction: column;
		justify-content: center;

		background: #ebdcc5;
		height: 100%;
	}

	.buttons{
		display: flex;
		flex-direction: row;
		justify-content: center;
		gap: 1rem;
	}

	.logo {
		width: 15rem;
		margin: 1rem auto;
	}

	.score-grid {
		width: max-content;
		max-width: 80dvw;
		display: grid;
		grid-auto-flow: column;
		grid-template-rows: repeat(13, auto);
		grid-template-columns: min-content 1fr; /* modified by code */
		margin: 1rem auto;

		& img {
			width: 1.5rem;
		}

		& .span-2 {
			grid-column: span 2;
		}

		& * {
			margin: auto;
			padding: 0.1rem;
		}
	}

	.total-row {
		font-weight: bolder;
	}

	.subgrid {
		display: grid;
		grid-template-columns: subgrid;
		grid-template-rows: subgrid;
		grid-row: span 13;
		align-items: center;
		justify-items: center;
		padding: 0.5rem;
		background: antiquewhite;

		border: 2px solid #ebdcc5;
		& input[type=number] {
			width: 3rem;
		}
	}

	.fill-cell {
		width: 100%;
	}

	.array-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.1rem;

		& > button {
			width: 3rem;
		}
	}

</style>

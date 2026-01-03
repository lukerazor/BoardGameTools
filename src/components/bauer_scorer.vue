<script setup>
import { ref, onMounted } from 'vue'

const players = ref([])

function addPlayer() {
	console.log("adding")
	players.value.push(new Player())
}

function newGame() {
	players.value = []
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
		return 10
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
		<div class="score-grid" :style="{ gridTemplateColumns:`min-content repeat(${players.count*2}, 1fr)`}">
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
			<div>Total</div>

			<div v-for="(player, p_idx) in players" class="subgrid span-2">
				<div class="span-2"><input v-model="players[p_idx].name"></div>
				
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

				<div class="span-2 inline-flex">
					<button class="" @click="player.addQuest()">+</button>
					<template v-for="(quest, q_idx) in player.questCardPoints">
						<input type="number" min=0 v-model="player.questCardPoints[q_idx]"/>
					</template>
				</div>

				<div class="span-2 inline-flex">
					<button class="" @click="player.addNightCard()">+</button>
					<template v-for="(nightCard, nc_idx) in player.nightCardPoints">
						<input type="number" min=0 v-model="player.nightCardPoints[nc_idx]"/>
					</template>
				</div>

				<div></div>
				<span>{{ player.grandTotal() }}</span>

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
		xgrid-template-columns: min-content 1fr; /* modified by code */
		margin: 1rem auto;

		& img {
			width: 1.5rem;
		}

		& .span-2 {
			grid-column: span 2;
		}
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

		& input {
			width: 3rem;
		}
	}

	.inline-flex {
		display: flex;
		flex-wrap: wrap;

	    align-items: flex-start;
		justify-content: flex-start;
		align-self: start;
	}
</style>

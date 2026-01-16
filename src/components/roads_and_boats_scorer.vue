<script setup>
import { ref } from 'vue'

const colours = [
	"red",
	"green",
	"blue",
	"yellow",
	"grey",
	"black"
]

/**** Classes ******/
class Pyramid {
	rows = []

	constructor() {
		const rowCounts = [4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 6, 7, 7, 7]

		// init row collection
		for(let rowCount of rowCounts) {
			this.rows.push( Array(rowCount).fill(null))
		}
	}

	addBrick(colour) {
		for(let rowIdx = 0; rowIdx < this.rows.length; rowIdx++) {
			for(let brickIdx = 0; brickIdx < this.rows[rowIdx].length; brickIdx++) {
				if(this.rows[rowIdx][brickIdx] == null) {
					this.rows[rowIdx][brickIdx] = colour
					return
				}
			}
		}
	}

	removeLastBrick() {
		// iterate backwards
		for(let rowIdx = this.rows.length - 1; rowIdx >= 0; rowIdx--) {
			for(let brickIdx = this.rows[rowIdx].length - 1; brickIdx >= 0 ; brickIdx--) {
				if(this.rows[rowIdx][brickIdx] != null) {
					this.rows[rowIdx][brickIdx] = null
					return
				}
			}
		}
	}

	calculatePoints() {
		
		const result = {}
		colours.forEach(c => result[c] = 0)

		this.rows.forEach(r => {
			const playerBricks = r.filter(b => b != null && b != "white")
			
			colours.forEach(c => {
				const numColour = playerBricks.filter(b => b == c).length

				if(numColour > 0) {
					result[c] += Math.floor(10/playerBricks.length * numColour)
				}		

			})
		})		

		return result
	}
}

class Player {
	colour = null
	gold = 0
	coins = 0
	shares = 0
	art = 0
	exhibits = 0
	jumpstartBids = 0

	constructor(colour) {
		this.colour = colour
	}	

	score() {
		return pyramid.value.calculatePoints()[this.colour]
		+ this.gold * 10
		+ this.coins * 40
		+ this.shares * 120
		+ (this.exhibits + 1) * this.art * 20
		- this.jumpstartBids
	}
}

/**** Refs *********/
const pyramid = ref(new Pyramid())
const players = ref(colours.map(c => new Player(c)))

</script>

<template>
	<div class="page">
		<h1>Roads and Boats Scoring</h1>
		<div class="pyramid">
			<div v-for="row in pyramid.rows.toReversed()">
				<template v-for="brickColour in row">
					<img v-if="brickColour != null" :src="'./roadsandboats_brick_' + brickColour + '.png'" class="brick">
					<img v-else :src="'./roadsandboats_brick_none.png'" class="brick no-brick">
				</template>
			</div>
		</div>
		<div class="pyramid-buttons">
			<template v-for="brickColour in colours">
				<img class="brick" :src="'./roadsandboats_brick_' + brickColour + '.png'" @click="pyramid.addBrick(brickColour)">
			</template>
			
			<img src="/roadsandboats_brick_white.png" class="brick" @click="pyramid.addBrick('white')">
			<button @click="pyramid.removeLastBrick()">Undo</button>
			
		</div>
		<div class="score-grid">
			<div></div>
			<div>
				<img src="/roadsandboats_brick_white.png" class="brick">
			</div>
			<div>
				<img src="/roadsandboats_gold.png" class="icon"> x 10
			</div>
			<div>
				<img src="/roadsandboats_coins.png" class="icon"> x 40
			</div>
			<div>
				<img src="/roadsandboats_share.png" class="icon"> x 120
			</div>
			<div>
				<img src="/roadsandboats_art.png" class="icon"> x 20
			</div>
			<div>
				<img src="/roadsandboats_exhibit.png" class="icon"> x Art
			</div>
			<div>
				Jumpstart Bid (-)
			</div>
			<div>
				Total
			</div>
			<div v-for="player in players" class="subgrid">
				<div>
					<img :src="'./roadsandboats_brick_' + player.colour + '.png'" class="brick">
				</div>
				<div>
					<span>{{ pyramid.calculatePoints()[player.colour] }}</span>
				</div>
				<div>
					<input type="number" v-model="player.gold">
				</div>
				<div>
					<input type="number" v-model="player.coins">
				</div>
				<div>
					<input type="number" v-model="player.shares">
				</div>
				<div>
					<input type="number" v-model="player.art">
				</div>
				<div>
					<input type="number" v-model="player.exhibits">
				</div>
				<div>
					<input type="number" step="5" v-model="player.jumpstartBids">
				</div>
				<div>
					{{ player.score() }}
				</div>
			</div>
		</div>
	</div>
</template>
	
<style>
	.page {
		display: flex;
		flex-direction: column;
		justify-content: center;
		text-align: center;

		background-color: #ebdcc5;
		height: fit-content;
	}

	.icon {
		width: 1.5rem;
	}

	.brick {
		width: 3rem;
		border: 1px solid black;
	}

	.no-brick {
		border: 1px dashed black;
		background-color: white;
	}

	.pyramid {
		display: flex;
		flex-direction: column;
		justify-content: center;
		margin:auto;		

		& > * {
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
			padding: 0.2rem;
		}		

		& > *:nth-child(even) {
			background-color: #bbbbbb;
		}

		& > *:nth-child(odd) {
			background-color: #dddddd;
		}

	}

	.pyramid-buttons {
		display:flex;
		gap: 0.5rem;
		margin: 0.5rem auto 2rem auto;
		align-items: center;
	}

	.score-grid {
		display: grid;
		grid-auto-flow: column;
		grid-template-columns: repeat(7, max-content);
		grid-template-rows: repeat(9, auto);
		margin: auto;
		gap: 0.25rem;
	}

	.subgrid {
		display: grid;		
		grid-template-columns: subgrid;
		grid-template-rows: subgrid;
		grid-row: span 9;
		align-items: center;
		justify-items: center;
		padding: 0.5rem;
		background-color: antiquewhite;

		border: 2px solid #ebdcc5;
		& input[type=number] {
			width: 3rem;
		}
	}
</style>
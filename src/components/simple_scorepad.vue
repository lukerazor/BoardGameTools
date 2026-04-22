<script setup>
import { ref, onMounted } from 'vue'
import InputInteger from "./input_integer.vue"
import Game from "../classes/GameBase.js"

const gameType = ref(null)
const game = ref(null)
const selectedPlayers = ref([])
const allPlayers = ref([])
// used for dialog
const newPlayerName = ref("")
const newPlayerList = ref([])

/***** dialog events *****/
function selectPlayersForNewGame(type) {
	console.log(type)
	gameType.value = type	
	selectPlayersDialog.showModal()
}

function selectPlayersDialogClosed(e) {
	
	if(selectPlayersDialog.returnValue == "ok" && newPlayerList.value.length > 0) {
		// match column count to player count
		selectedPlayers.value = JSON.parse(JSON.stringify(newPlayerList.value))

		scorePad.style.gridTemplateColumns = `repeat(${selectedPlayers.value.length}, 1fr)`
		const newGame = Game.create("ROUND", selectedPlayers.value)
	
		game.value = newGame
	}
}
	
/***** model manipulation functions *****/
function addNewPlayer() {
	if(newPlayerName.value.trim() != "") {
		
		if(!allPlayers.value.includes(newPlayerName.value)) {
			allPlayers.value.push(newPlayerName.value)
			saveAllPlayers()
		}
	
		selectPlayer(newPlayerName.value)
		newPlayerName.value = ""
	}
}
	
function selectPlayer(player) {
	if(!newPlayerList.value.includes(player)) {
		newPlayerList.value.push(player)
	}
}

function unselectPlayer(player) {
	const idx  = newPlayerList.value.indexOf(player)
	
	if(idx >= 0) {
		newPlayerList.value.splice(idx, 1)
	}
}

/***** storage *****/

const ALL_PLAYERS = "all_players"
	
function saveAllPlayers() {
	window.localStorage.setItem(ALL_PLAYERS, JSON.stringify(allPlayers.value))
}

function loadAllPlayers() {
	
	let players = window.localStorage.getItem(ALL_PLAYERS)
	
	allPlayers.value = players != null ? JSON.parse(players) : []
}

/***** mounted event *****/

let selectPlayersDialog = null;
let scorePad = null;
	
onMounted(() => {
	loadAllPlayers()
	
	selectPlayersDialog = document.getElementById("selectPlayersDialog")
	scorePad = document.getElementById("score-pad")
	
	selectPlayersDialog.addEventListener("close", selectPlayersDialogClosed);
})

function showNewGamePopover(event) {
	const popover = document.getElementById("new-game-popover")

	popover.showPopover({source: event.target})
}

</script>

<template>
	<div class="page-layout">
		<div id="toolbar">
			<div class="burger-menu-size"></div>
			<button @click="game.addRound()" :disabled="game == null" class="toolbar-button">New Round</button>
			
			<img popovertarget="new-game-popover" @click="showNewGamePopover" src="/public/burger_menu.svg" class="burger-menu-size" />
		</div>

		<div id="new-game-popover" popover>
			<button @click="selectPlayersForNewGame('ROUND')">New Round Mode Game</button>
			<button @click="selectPlayersForNewGame('TALLY')">New Tally Mode Game</button>
		</div>

		<div id="score-pad">
			<template v-if="game != null">
				<template v-if="game.type == 'ROUND'">
					<template v-for="player in game.players">
						<div class="header">{{ player }}</div>
					</template>
					<template v-for="total in game.totals()">
						<div class="header totals">{{ total }}</div>
					</template>
					<template v-for="(round, r_idx) in game.rounds">
						<div v-for="(score, s_idx) in round">
							<InputInteger v-model="game.rounds[r_idx][s_idx]"></InputInteger>
						</div>
					</template>
				</template>
			</template>
		</div>
		
		<dialog id="selectPlayersDialog">
			<div class="selectPlayersDialogBody">
				<div id="selectedPlayers" class="player-list">
					<div v-for="player in newPlayerList" class="player-tag remove" @click="unselectPlayer(player)">{{ player }}</div>
				</div>
				<div id="addPlayers" class="align-centre">
					<input type=text v-model="newPlayerName" @keyup.enter="addNewPlayer()"></input>
					<button @click="addNewPlayer">Add</button>
				</div>
				<div id="playerList" class="player-list">
					<div v-for="player in allPlayers.sort()" class="player-tag add" :class="{ selected: newPlayerList.includes(player) }"
						@click="selectPlayer(player)">{{ player }}
					</div>
				</div>

				<form method="dialog" class="buttons">
					<button value="ok" formmethod="dialog">OK</button>
					<button value="cancel" formmethod="dialog">Cancel</button>
				</form>
			</div>
		</dialog>
	</div>	
</template>

<style scoped>
	.page-layout {
		--popover-background: rgb(0 0 0 / 40%);

		display: grid;
		grid-template-rows: min-content 1fr;
	}
	
	#toolbar {
		display: flex;
		justify-content: space-between;
		padding: 0.5rem 2rem;
	}

	.burger-menu-size {
		height: 2rem;
		width: 2rem;
	}

	#new-game-popover {
		position-anchor: --burger-menu-button;
  		top: anchor(--burger-menu-button bottom);
  		right: anchor(--burger-menu-button right);
		
		&:popover-open {
			border: 0;
			padding: 2rem;
			display: flex;
			flex-direction: column;
			gap: 10px;
		}

		&::backdrop {
			background: var(--popover-background)
		}
	}
	
	button {
		all: revert;
		padding: 0.35rem 1rem;
	}
	
	#score-pad {
		--border: solid 1px grey;		

		width: 95%;
		display: grid;
		grid-template-columns: repeat(3, 1fr); /* NOTE: modified by code */
		gap: 0px;
		margin: auto;
		border: var(--border);

		& > * {
			white-space: nowrap;
			background-color: white;
			text-align: center;
			border: var(--border);
		}

		& > .header {
			background-color: lightgray;
			font-weight: bold;
		}		
		
		& > .totals {
			font-style: italic;
		}
	}

	input[type="number"] { 
		appearance: textfield;
		width: 98%;		
		justify-self: center;
		text-align: center;
		border: solid 1px grey;
		border:0;
		outline:0;
	}
	
	#selectPlayersDialog {
		width: 80dvw;
		height: 80dvh;

		&::backdrop {
			background: var(--popover-background)
		}
	}

	.selectPlayersDialogBody {
		display: flex;
		flex-direction: column;
		gap: 1rem;

		& input {
			padding: 0.4rem 0.2rem;
			margin-right: 0.5rem;
		}
	}
	
	.align-centre {
		text-align:center;
	}

	.player-list {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}	

	.player-tag {
		background: lightgrey;
		text-align: center;
		border-radius: 999em;
		padding: 0.05rem 0.75rem;		
	}

	.remove:hover {
		background-color: #FF6040;

		&::after {
			content: " -";
		}
	}

	.add:hover {
		background-color: lightgreen;

		&::after {
			content: " +";
		}
	}
	
	.selected {
		background: rgba(152, 251, 152, 0.947);
	}

	.buttons {
		display: flex;
		justify-content: end;
		gap: 1rem;
	}
	
</style>

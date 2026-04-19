<script setup>
import { ref, computed, onMounted } from 'vue'
import { XMLParser } from "fast-xml-parser"

class ExitGame {
	id = null
	name = null
	year = null
	thumbnailUrl = null
	played = false

	constructor(id, name, year) {
		this.id = id
		this.name = name
		this.year = year
	}
}

const FETCH_DELAY = 3
const STORAGE_KEY = "bgg_user"
const IGNORE_IDS = ["154195", "311309", "343072", "390933"];

const queryUrl = "https://boardgamegeek.com/xmlapi2/search?query=exit+the+game"

function collectionUrl(user, ids) {
	return `https://boardgamegeek.com/xmlapi2/collection?username=${user}&id=${ids.join(",")}`
}

function gameDetailUrl(ids) {
	return `https://boardgamegeek.com/xmlapi2/thing?id=${ids.join(",")}`
}

const apiToken = "6f6a2c46-70a9-4f72-b78c-506b17b8b0e2"

const games = ref([])
const bggUser = ref("")

const gameIds = computed(() => games.value.map(g => g.id))

async function bggFetch(url) {
	const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `bearer ${apiToken}`
        }
	})

	if(response.ok) {
		if(response.status != 202) {
			const xmlText = await response.text()
			const parser = new XMLParser( { ignoreAttributes: false, attributeNamePrefix: "" } ) 
			const xmlDoc = parser.parse(xmlText)

			return xmlDoc
		}
	}

	return null
}

async function getExitGames() {
	const allGames = await bggFetch(queryUrl)
		
	if(allGames) {
		games.value = allGames.items.item.filter(i => !IGNORE_IDS.includes(i.id)).map(i => new ExitGame(i.id, i.name.value, i.yearpublished.value))

		getUsersCollection()
		startGetGameDetails()
	}
	else {
		console.log(`Failed to get list of Exit games. Retrying in ${FETCH_DELAY} seconds`)
		setTimeout(getExitGames, FETCH_DELAY * 1000)
	}
}

async function startGetGameDetails() {
	const chunkSize = 10;

	for(let idx = 0; idx < gameIds.value.length; idx += chunkSize) {
		const ids = gameIds.value.slice(idx, idx + chunkSize)

		getGameDetails(ids)
	}
}

async function getGameDetails(ids) {
	const allGames = await bggFetch(gameDetailUrl(ids))
		
	if(allGames) {
		allGames.items.item.forEach(i => {
			const idx = games.value.findIndex(g => g.id == i.id)

			if(idx >= 0){
				games.value[idx].thumbnailUrl = i.thumbnail
			}
		})
	}
	else {
		console.log(`Failed to get game details. Retrying in ${FETCH_DELAY} seconds`)
		setTimeout(getGameDetails, FETCH_DELAY * 1000, ids)
	}
	
}

async function getUsersCollection() {
	if(bggUser.value.trim() != "") {
		const allGames = await bggFetch(collectionUrl(bggUser.value, gameIds.value))
			
		if(allGames) {
			allGames.items.item.forEach(i => {
				if(i.status.own == 1 || i.status.prevowned == 1) {
					const gameIdx = games.value.findIndex(g => g.id == i.objectid)

					if(gameIdx >= 0) {
						games.value[gameIdx].played = true
					}
				}
			})
		}
		else {
			console.log(`Failed to get game details. Retrying in ${FETCH_DELAY} seconds`)
			setTimeout(getUsersCollection, FETCH_DELAY * 1000)
		}
	}
}

async function onBggUserChange() {
	window.localStorage.setItem(STORAGE_KEY, bggUser.value)
	
	games.value.forEach(g => g.played = false)

	getUsersCollection()
}

onMounted(async () => {
	var username = window.localStorage.getItem(STORAGE_KEY)
	if(username) {
		bggUser.value = username

		await onBggUserChange()
	}

	getExitGames()
})

</script>

<template>
	<div class="page">
		<h1>Exit Tracker</h1>

		<div class="header">
			<label for="bggUserTxt">BGG Username</label>
			<input id="bggUserTxt" v-model="bggUser" @change="onBggUserChange()">
			<button @click="onBggUserChange()">Refresh</button>
		</div>
		<div class="game-table">
			<div v-for="game in games" class="game-table-row">
				<img :src="game.thumbnailUrl" class="thumbnail">
				<a :href="'https://boardgamegeek.com/boardgame/' + game.id">{{ game.id }}</a>
				<div>{{ game.name }}</div>
				<div>{{ game.year }}</div>
				<img class="played_image" :src="game.played ? '/tick_icon.svg' : ''" />
			</div>
		</div>

		<a href="https://boardgamegeek.com">
			<img src="https://cf.geekdo-images.com/HZy35cmzmmyV9BarSuk6ug__small/img/gbE7sulIurZE_Tx8EQJXnZSKI6w=/fit-in/200x150/filters:strip_icc()/pic7779581.png">
		</a>

</div>

</template>

<style scoped>
	.page {
		--num-cols: 5;

		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
	}

	label {
		font-weight: bolder;
	}

	.header {
		display: flex;
		width: 100%;
		padding: 1rem;
		gap: 1rem;
		flex-direction: row;
		justify-content: center;
		background-color: lightgrey;
		
	}
	.game-table {
		width: max-content;
		display: grid;
		gap: 0.5rem;
		grid-template-columns: repeat(var(--num-cols), max-content);
		margin: auto;	
	}

	.game-table-row {
		display: grid;
		grid-column: span var(--num-cols);
		grid-template-columns: subgrid;
		grid-template-rows: subgrid;

		& > * {
			padding: 0.5rem;
			align-self: center;
		}
		
		&:nth-child(odd) {
			background-color: #eeeeee;
		}
	}

	.played_image {
		width: 1em;
	}

	.thumbnail {
		width: 5rem;
	}
</style>

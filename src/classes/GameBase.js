export default class Game {
	players = []
	type = null

	constructor(players) {
		this.players = players
	}

	static create(gameType, players) {
		switch(gameType) {
			case "ROUND":
				return new RoundGame(players)
				break
			case "TALLY":
				return new TallyGame(players)
				break
			default:
				alert(`Game type ${gameType} does not exist`)
		}
	}	
}

class RoundGame extends Game {
	rounds = []

	constructor(players) {
		super(players)
		this.type = "ROUND"

		this.addRound()
	}

	initRound() {
		return Array(this.players.length).fill(0)
	}		
	
	addRound() {
		this.rounds.push(this.initRound())
	}
	
	totals() {
		const result = this.initRound()
	
		for(let col = 0; col < this.players.length; col++) {
			for(let row = 0; row < this.rounds.length; row++) {
				result[col] += this.rounds[row][col]
			}
		}
	
		return result
	}
}

class TallyGame extends Game {
	tally = []

	constructor(players) {
		super(players)
		this.type = "TALLY"
		
		this.addRound()
	}
}
class Killers {
  constructor(card) {
    this.card = card

    this.url = 'https://dutchdaddydoes.github.io/ACNHAPI/killers.json'
    
    this.killers = new Array()
    this.versions = new Object()
  }

  async getKillers() {
    const response = await fetch(this.url)
    const json = await response.json()
    Object.entries(await json).forEach(killer => {
      let killerNew = killer[1]
      killerNew.id = killer[0]
      this.card.killers.killers.push(killerNew)
    })
  }
  
  sortKillers() {
    const { killers } = this.card.killers

    const base = killers.filter(killer => killer.version === 'BaseGame')
    const original = killers.filter(killer => killer.version === 'OriginalDLC')
    const franchise = killers.filter(killer => killer.version === 'FranchiseDLC')
  
    return {
      base: {
        gameVersion: 'Base Game',
        base,
      },
      original: {
        gameVersion: 'Original DLC',
        original,
      },
      franchise: {
        gameVersion: 'Franchise DLC',
        franchise,
      },
    }
  }
}
class Card {
  constructor() {
    this.killers = new Killers(this)
    this.ui = new UI(this)
    this.slotData = new SlotData(this)

    this.activeSlot = undefined
    this.activeGridPosition = undefined

    this.random = false
  }

  async init() {
    if (this.killers.killers) {
      // Initialize Killers List
      if (this.killers.killers.length === 0) {
        // Populate `this.killers.killers` from API
        await this.killers.getKillers()
        // Call `init()` again to sort animals
        this.init()
      // After retrieving killers, sort into Animals
      } else if (this.killers.killers.length === 413) {
        // Sort Killers
        this.killers.animals = await this.killers.sortKillers()
        // Render Animal List
        this.ui.renderPortraitSelectors()
      }
    } else {
      // Reset `this.killers.killers` if undefined
      this.killers.killers = new Array()
      // Call `init()` again to restart process
      setTimeout(this.init(), 5000)
    }
  }

  downloadImage(element) {
    let image = this.ui.canvas.toDataURL('image/jpg')
    element.href = image
  }

  randomizeCard() {
    // For each slot on Bingo Card (1-25, except 13)
    for (let slot = 0; slot < 26; slot++) {
      this.activeSlot = slot
      this.activeGridPosition = this.slotData.slotToGrid[slot]

      if (slot !== 13) {  
        // Get random integer between 0 and 391
        const randomKillerNumber = Math.floor(Math.random() * Math.floor(414))
        
        // Get Killer from `randomKillerNumber`
        const killer = this.killers.killers[randomKillerNumber]

        // Call updateKiller() to place Killer on card
        this.ui.updateKiller(killer.id, killer.name, true)
      }
    }
    
    this.random = true
    this.ui.toggleRandomVerificationElement()
  }
}

const card = new Card()
card.init()